// Camada de dados do Dashboard. Todas as consultas passam pelas regras de acesso (RLS) do banco:
// cada perfil enxerga apenas o que tem direito, sem filtro extra aqui.
import { sb } from "../../supabase.js";
import { monthShort } from "../../utils/format.js";

const startOfMonth = (d, offset = 0) => new Date(d.getFullYear(), d.getMonth() + offset, 1);

async function count(query) {
  const { count: n, error } = await query;
  if (error) throw error;
  return n ?? 0;
}
const settled = (r) => (r.status === "fulfilled" ? r.value : null);

export async function loadKpis() {
  const now = new Date(), m0 = startOfMonth(now), m1 = startOfMonth(now, -1);
  const head = { count: "exact", head: true };
  const [ativos, mes, anterior, visitas] = await Promise.allSettled([
    count(sb.from("imoveis").select("id", head).eq("publicado", true).eq("status", "disponivel")),
    count(sb.from("clientes").select("id", head).gte("created_at", m0.toISOString())),
    count(sb.from("clientes").select("id", head).gte("created_at", m1.toISOString()).lt("created_at", m0.toISOString())),
    count(sb.from("visitas").select("id", head).eq("status", "agendada").gte("data_hora", now.toISOString())),
  ]);
  return {
    imoveisAtivos: settled(ativos),
    leadsMes: settled(mes),
    leadsMesAnterior: settled(anterior),
    visitasAgendadas: settled(visitas),
    comissoes: null, // chega com o módulo Financeiro
  };
}

export async function loadMonthly(n = 6) {
  const now = new Date();
  const months = [...Array(n)].map((_, i) => startOfMonth(now, -(n - 1) + i));
  const key = (d) => d.getFullYear() + "-" + d.getMonth();
  const startISO = months[0].toISOString();

  const [leads, visitas] = await Promise.allSettled([
    sb.from("clientes").select("created_at").gte("created_at", startISO).limit(5000),
    sb.from("visitas").select("data_hora").gte("data_hora", startISO).neq("status", "cancelada").limit(5000),
  ]);

  const bucket = (res, field) => {
    const acc = Object.fromEntries(months.map((m) => [key(m), 0]));
    const ok = res.status === "fulfilled" && !res.value.error;
    if (ok) (res.value.data || []).forEach((r) => { const k = key(new Date(r[field])); if (k in acc) acc[k]++; });
    return months.map((m) => acc[key(m)]);
  };

  return {
    labels: months.map(monthShort),
    series: [
      { name: "Novos contatos", color: "#490607", values: bucket(leads, "created_at") },
      { name: "Visitas", color: "#dda02f", values: bucket(visitas, "data_hora") },
    ],
  };
}

export async function loadActivity(limit = 8) {
  const desc = { ascending: false };
  const [cl, at, im, vi] = await Promise.allSettled([
    sb.from("clientes").select("nome,origem,created_at").order("created_at", desc).limit(limit),
    sb.from("atendimentos").select("tipo,texto,created_at,clientes(nome)").order("created_at", desc).limit(limit),
    sb.from("imoveis").select("titulo,created_at").order("created_at", desc).limit(limit),
    sb.from("visitas").select("data_hora,created_at,clientes(nome),imoveis(titulo)").order("created_at", desc).limit(limit),
  ]);
  const rows = (r) => (r.status === "fulfilled" && !r.value.error ? r.value.data || [] : []);
  const cut = (t, n = 70) => (t.length > n ? t.slice(0, n - 1) + "…" : t);

  const items = [
    ...rows(cl).map((x) => ({ icon: "users", title: "Novo contato: " + x.nome, sub: "Origem: " + x.origem, when: x.created_at })),
    ...rows(at).map((x) => ({ icon: "chat", title: "Atendimento" + (x.clientes ? " · " + x.clientes.nome : ""), sub: cut(x.texto), when: x.created_at })),
    ...rows(im).map((x) => ({ icon: "building", title: "Imóvel cadastrado", sub: x.titulo, when: x.created_at })),
    ...rows(vi).map((x) => ({ icon: "calendar", title: "Visita agendada" + (x.clientes ? " · " + x.clientes.nome : ""),
      sub: (x.imoveis ? x.imoveis.titulo + " · " : "") + new Date(x.data_hora).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }), when: x.created_at })),
  ];
  return items.sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, limit);
}
