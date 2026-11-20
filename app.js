import { CONFIG } from "./config.js";
import { renderSidebar, setActive } from "./ui/sidebar.js";
import { renderHeader, setTitle } from "./ui/header.js";
import * as router from "./router.js";

const $ = (id) => document.getElementById(id);
const app = $("app"), loginRoot = $("login-root");
let auth; // módulo de autenticação (carregado em boot)

function openNav(open) {
  app.classList.toggle("nav-open", open);
  $("scrim").hidden = !open;
  const b = $("btn-menu"); if (b) b.setAttribute("aria-expanded", String(open));
}

function enter(ctx) {
  loginRoot.hidden = true;
  app.hidden = false;
  if (!location.hash) location.hash = "#/" + CONFIG.DEFAULT_ROUTE;

  renderSidebar($("sidebar"), ctx.profile.role);
  renderHeader($("header"), ctx);

  $("btn-menu").onclick = () => openNav(!app.classList.contains("nav-open"));
  $("scrim").onclick = () => openNav(false);
  $("sidebar").onclick = (e) => { if (e.target.closest("a")) openNav(false); };
  addEventListener("keydown", (e) => { if (e.key === "Escape") openNav(false); });
  $("btn-sair").onclick = async () => { router.stop(); await auth.signOut(); openNav(false); showLogin(); };

  router.start({
    ctx,
    outlet: $("view"),
    onRoute: (mod) => { setTitle($("header"), mod.label); setActive($("sidebar"), mod.id); },
  });
}

function showLogin(msg = "") {
  app.hidden = true;
  auth.renderLogin(loginRoot, enter, msg);
}

async function boot() {
  try {
    auth = await import("./auth.js");
    const ctx = await auth.loadSession();
    if (!ctx) return showLogin();
    if (ctx.error) return showLogin(ctx.error);
    enter(ctx);
  } catch (e) {
    console.error(e);
    app.hidden = true; loginRoot.hidden = false; loginRoot.className = "login";
    loginRoot.innerHTML = '<form onsubmit="return false"><h1>San Marino</h1><p class="err" role="alert"></p></form>';
    loginRoot.querySelector(".err").textContent = "Não foi possível iniciar o painel: " + (e.message || e) + ". Abra o painel pelo endereço do site publicado.";
  }
}
boot();
