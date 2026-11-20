import { MODULES } from "../permissions.js";
import { icon } from "./icons.js";
import { esc } from "../utils/dom.js";

const MARCA = `<svg viewBox="0 0 40 30" fill="#fff" aria-hidden="true"><path d="M15 2h3v2h2V2h2v2h2v2h0v10H15zM6 9h3v2h1V9h2v2h1v6H6zM27 9h3v2h1V9h2v2h1v6h-7z"/><path d="M0 28 14 19h12l14 9-14-4H14z" fill="#dda02f"/></svg>`;

export function renderSidebar(el, role, siteUrl = "../") {
  const itens = MODULES.filter((m) => m.roles.includes(role))
    .map((m) => `<a href="#/${esc(m.id)}" data-id="${esc(m.id)}">${icon(m.icon)}<span>${esc(m.label)}</span></a>`)
    .join("");
  el.innerHTML = `
    <div class="brand">${MARCA}<div><b>SAN MARINO</b><small>Painel administrativo</small></div></div>
    <nav class="nav" aria-label="Módulos">${itens}</nav>
    <div class="sb-foot"><a href="${esc(siteUrl)}">Ver o site</a></div>`;
}

export function setActive(el, id) {
  el.querySelectorAll(".nav a").forEach((a) => {
    if (a.dataset.id === id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}
