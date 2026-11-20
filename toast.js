export function toast(msg, type = "ok") {
  const root = document.getElementById("toast-root");
  const el = document.createElement("div");
  el.className = "toast" + (type === "err" ? " err" : "");
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
