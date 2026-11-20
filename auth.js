import { sb } from "./supabase.js";
import { CONFIG } from "./config.js";
import { esc } from "./utils/dom.js";

// Monta o contexto da sessão (usuário, perfil e imobiliária) ou devolve { error }.
async function buildContext(user) {
  const { data: profile } = await sb.from("profiles")
    .select("nome,role,ativo,imobiliaria_id").eq("id", user.id).single();
  if (!profile || !profile.ativo || !profile.imobiliaria_id) {
    await sb.auth.signOut();
    return { error: "Seu acesso ainda não foi liberado. Fale com o administrador." };
  }
  const { data: company } = await sb.from("imobiliarias").select("nome").eq("id", profile.imobiliaria_id).single();
  return { user, profile, company: company || { nome: "" } };
}

export async function loadSession() {
  const { data: { session } } = await sb.auth.getSession();
  return session ? buildContext(session.user) : null;
}

export async function signIn(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    const rede = /fetch|network|failed|retryable/i.test((error.message || "") + (error.name || ""));
    return { error: rede ? "Sem conexão com o servidor. Abra o painel pelo endereço do site publicado e tente de novo." : "E-mail ou senha incorretos." };
  }
  const { data: { user } } = await sb.auth.getUser();
  return buildContext(user);
}

export const signOut = () => sb.auth.signOut();

export function renderLogin(root, onDone, mensagem = "") {
  root.hidden = false;
  root.className = "login";
  root.innerHTML = `
    <form id="lf" onsubmit="return false">
      <h1>San Marino</h1><p class="sub">Painel administrativo</p>
      <div><label for="em">E-mail</label><input id="em" type="email" autocomplete="username" required></div>
      <div><label for="pw">Senha</label><input id="pw" type="password" autocomplete="current-password" required></div>
      <div class="err" id="lm" role="alert">${esc(mensagem)}</div>
      <button class="btn" type="submit">Entrar</button>
      <div class="conn" id="lc">Verificando conexão com o servidor…</div>
    </form>`;
  const $ = (id) => root.querySelector("#" + id);
  fetch(CONFIG.SUPABASE_URL + "/auth/v1/health", { headers: { apikey: CONFIG.SUPABASE_KEY } })
    .then((r) => { $("lc").textContent = r.ok ? "Servidor conectado." : "O servidor respondeu com erro (" + r.status + ")."; })
    .catch(() => { $("lc").textContent = "Sem conexão com o servidor. Abra o painel pelo endereço do site publicado, não pela pré-visualização."; $("lc").classList.add("bad"); });

  $("lf").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("lf").querySelector("button");
    btn.disabled = true; $("lm").textContent = "";
    const ctx = await signIn($("em").value.trim(), $("pw").value);
    btn.disabled = false;
    if (ctx.error) { $("lm").textContent = ctx.error; return; }
    $("pw").value = "";
    onDone(ctx);
  });
}
