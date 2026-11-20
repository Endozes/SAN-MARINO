import { CONFIG } from "./config.js";

if (!window.supabase) {
  throw new Error("Biblioteca do Supabase não carregou (internet bloqueada ou fora do ar).");
}
// Cliente único, compartilhado por todos os módulos.
export const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
