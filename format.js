export const brl = (n) =>
  n == null ? "—" : Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const num = (n) => (n == null ? "—" : Number(n).toLocaleString("pt-BR"));

export const monthShort = (d) =>
  d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

export const monthLong = (d = new Date()) =>
  d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

export function relTime(iso) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const steps = [["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, secs] of steps) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "agora";
}
