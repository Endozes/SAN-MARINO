import { icon } from "./icons.js";
import { esc } from "../utils/dom.js";
import { ROLE_LABEL } from "../permissions.js";

const iniciais = (nome = "") =>
  nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase() || "?";

export function renderHeader(el, { profile, company, user }) {
  const nome = profile.nome || user.email || "";
  el.innerHTML = `
    <button class="icon-btn only-mobile" id="btn-menu" type="button" aria-label="Abrir menu" aria-controls="sidebar" aria-expanded="false">${icon("menu")}</button>
    <h1 id="page-title">Dashboard</h1>
    <span class="sp"></span>
    <span class="company">${esc(company.nome || "")}</span>
    <div class="user">
      <span class="avatar" aria-hidden="true">${esc(iniciais(nome))}</span>
      <span class="user-meta"><b>${esc(nome)}</b><small>${esc(ROLE_LABEL[profile.role] || profile.role)}</small></span>
    </div>
    <button class="icon-btn" id="btn-sair" type="button" aria-label="Sair" title="Sair">${icon("logout")}</button>`;
}

export const setTitle = (el, text) => {
  el.querySelector("#page-title").textContent = text;
  document.title = text + " · San Marino";
};
