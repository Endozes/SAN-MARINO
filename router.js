import { MODULES, canAccess } from "./permissions.js";
import { esc } from "./utils/dom.js";

// Telas com código próprio. As demais usam a tela "em construção".
const VIEWS = {
  dashboard: () => import("./modules/dashboard/dashboard.view.js"),
};

let ctx, outlet, onRoute, cleanup = null, seq = 0;

const current = () => {
  const m = /^#\/([a-z-]+)/.exec(location.hash);
  return m ? m[1] : "dashboard";
};

export function start(opts) {
  ({ ctx, outlet, onRoute } = opts);
  addEventListener("hashchange", render);
  render();
}

export function stop() {
  removeEventListener("hashchange", render);
  if (cleanup) { try { cleanup(); } catch (_) {} cleanup = null; }
  seq++;
}

async function render() {
  const my = ++seq;
  const id = current();
  const mod = MODULES.find((m) => m.id === id);
  if (!mod || !canAccess(ctx.profile.role, id)) { location.replace("#/dashboard"); return; }

  if (cleanup) { try { cleanup(); } catch (_) {} cleanup = null; }
  onRoute(mod);
  outlet.innerHTML = '<div class="skel" style="min-height:160px" aria-label="Carregando"></div>';

  try {
    const view = await (VIEWS[id] || (() => import("./modules/placeholder.view.js")))();
    if (my !== seq) return;               // o usuário já foi para outra tela
    outlet.innerHTML = "";
    const c = await view.mount(outlet, { ...ctx, module: mod });
    if (my !== seq) { if (typeof c === "function") c(); return; }
    cleanup = typeof c === "function" ? c : null;
    outlet.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } catch (e) {
    console.error(e);
    if (my === seq) outlet.innerHTML = `<div class="card empty"><h2>Não foi possível carregar esta tela</h2><p>${esc(e.message || e)}</p></div>`;
  }
}
