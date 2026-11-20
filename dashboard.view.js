import { loadKpis, loadMonthly, loadActivity } from "./dashboard.service.js";
import { barChart } from "./chart.js";
import { icon } from "../../ui/icons.js";
import { esc } from "../../utils/dom.js";
import { num, brl, monthLong, relTime } from "../../utils/format.js";

function delta(atual, anterior) {
  if (atual == null || anterior == null) return "";
  if (anterior === 0) return `<span class="chip flat">${atual === 0 ? "sem variação" : "novo"}</span>mês anterior: 0`;
  const p = Math.round(((atual - anterior) / anterior) * 100);
  const cls = p > 0 ? "up" : p < 0 ? "down" : "flat";
  return `<span class="chip ${cls}">${p > 0 ? "+" : ""}${p}%</span>vs. mês anterior (${anterior})`;
}

function kpi(ico, label, value, note) {
  return `<article class="kpi"><div class="kpi-ico">${icon(ico)}</div><div>
    <p class="kpi-lbl">${esc(label)}</p><p class="kpi-val">${value}</p><p class="kpi-note">${note}</p></div></article>`;
}

function renderKpis(k) {
  return [
    kpi("building", "Imóveis ativos", esc(num(k.imoveisAtivos)), "Publicados e disponíveis"),
    kpi("users", "Novos contatos no mês", esc(num(k.leadsMes)), delta(k.leadsMes, k.leadsMesAnterior) || "Contatos recebidos neste mês"),
    kpi("calendar", "Visitas agendadas", esc(num(k.visitasAgendadas)), "A partir de agora"),
    kpi("wallet", "Faturamento e comissões", esc(brl(k.comissoes)), "Disponível com o módulo Financeiro"),
  ].join("");
}

function renderActivity(list) {
  if (!list.length) return '<p class="empty">Nenhuma atividade ainda. Os contatos do site, atendimentos e visitas aparecem aqui.</p>';
  return `<ul class="act">${list.map((a) => `<li><span class="dot">${icon(a.icon)}</span>
    <div><b>${esc(a.title)}</b><small>${esc(a.sub)} · ${esc(relTime(a.when))}</small></div></li>`).join("")}</ul>`;
}

export async function mount(el, { profile }) {
  const primeiro = (profile.nome || "").split(" ")[0];
  el.innerHTML = `
    <div class="page-head"><h2>Olá${primeiro ? ", " + esc(primeiro) : ""}</h2><p>Resumo de ${esc(monthLong())}</p></div>
    <section class="kpis" id="kpis" aria-label="Indicadores"><div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div></section>
    <div class="dash-grid">
      <section class="card" aria-labelledby="t-chart">
        <div class="card-head"><h3 id="t-chart">Desempenho mensal</h3><div class="legend" id="legend"></div></div>
        <div class="chart" id="chart"><div class="skel" style="min-height:240px"></div></div>
      </section>
      <section class="card" aria-labelledby="t-act">
        <div class="card-head"><h3 id="t-act">Atividades recentes</h3></div>
        <div id="activity"><div class="skel" style="min-height:240px"></div></div>
      </section>
    </div>`;

  // as três consultas rodam em paralelo; cada bloco aparece assim que ficar pronto
  const q = (s) => el.querySelector(s);
  loadKpis().then((k) => { q("#kpis").innerHTML = renderKpis(k); });
  loadMonthly().then((d) => {
    q("#chart").innerHTML = barChart(d);
    q("#legend").innerHTML = d.series.map((s) => `<span><i style="background:${esc(s.color)}"></i>${esc(s.name)}</span>`).join("");
  });
  loadActivity().then((a) => { q("#activity").innerHTML = renderActivity(a); });
}
