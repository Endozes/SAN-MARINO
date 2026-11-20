// Tela provisória dos módulos que serão construídos nas próximas etapas.
import { esc } from "../utils/dom.js";

export function mount(el, { module: mod }) {
  const lista = (mod.planned || []).map((t) => `<li>${esc(t)}</li>`).join("");
  const extra = mod.id === "imoveis"
    ? `<p style="margin-top:18px"><a class="btn" href="../admin.html">Abrir a gestão de imóveis atual</a></p>`
    : "";
  el.innerHTML = `
    <div class="page-head"><h2>${esc(mod.label)}</h2><p>${esc(mod.desc)}</p></div>
    <div class="card empty">
      <h2>Em construção</h2>
      <p>Este módulo será construído nas próximas etapas. Previsto:</p>
      <ul class="soon-list">${lista}</ul>
      ${extra}
    </div>`;
}
