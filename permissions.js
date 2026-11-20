// Módulos do painel e quem pode acessar cada um.
// Perfis do banco: chefe (Administrador), secretaria (Gerente), corretor (Corretor).
// Mapeamento provisório: será revisado na etapa "Usuários e Permissões".
export const ROLE_LABEL = { chefe: "Administrador", secretaria: "Gerente", corretor: "Corretor" };

const TODOS = ["chefe", "secretaria", "corretor"];

export const MODULES = [
  { id: "dashboard",  label: "Dashboard",              icon: "home",     roles: TODOS,
    desc: "Visão geral da operação." },
  { id: "imoveis",    label: "Imóveis",                icon: "building", roles: TODOS,
    desc: "Cadastro, filtros avançados, fotos e destaques.",
    planned: ["Listagem com filtros (código, tipo, status, bairro, preço)", "Formulário completo com CEP e características", "Fotos com arrastar e ordenar", "Tags: destaque, oportunidade, baixou o preço"] },
  { id: "crm",        label: "CRM e Leads",            icon: "users",    roles: TODOS,
    desc: "Funil de vendas e histórico dos clientes.",
    planned: ["Quadro Kanban com as etapas do funil", "Ficha do cliente com histórico de interações", "Vínculo com imóveis de interesse", "Aviso quando um novo imóvel combina com o perfil do cliente"] },
  { id: "agenda",     label: "Agenda de Visitas",      icon: "calendar", roles: TODOS,
    desc: "Visitas por imóvel, cliente e corretor.",
    planned: ["Calendário e lista cronológica", "Visita ligada a imóvel, cliente e corretor", "Checklist de vistoria com fotos"] },
  { id: "financeiro", label: "Contratos e Financeiro", icon: "wallet",   roles: ["chefe", "secretaria"],
    desc: "Contratos, reajustes e fluxo de caixa.",
    planned: ["Contratos de locação e venda", "Alertas de vencimento e reajuste (IGP-M/IPCA)", "Fluxo de caixa: comissões, taxas e despesas", "Gerador de propostas em PDF"] },
  { id: "usuarios",   label: "Usuários",               icon: "shield",   roles: ["chefe"],
    desc: "Acessos e permissões da equipe.",
    planned: ["Convidar e ativar usuários", "Níveis: Administrador, Gerente e Corretor", "Ranking e desempenho da equipe"] },
];

export const canAccess = (role, id) => {
  const m = MODULES.find((x) => x.id === id);
  return !!m && m.roles.includes(role);
};
