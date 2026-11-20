// Gráfico de barras agrupadas em SVG puro (sem biblioteca externa).
import { esc } from "../../utils/dom.js";

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p;
}

export function barChart({ labels, series, height = 260 }) {
  const W = 640, H = height, m = { t: 18, r: 10, b: 30, l: 34 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const top = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const step = top <= 5 ? 1 : top / 5; // degraus sempre inteiros (2, 4, 10, 20...)
  const y = (v) => m.t + ih - (v / top) * ih;

  let grid = "";
  for (let v = 0; v <= top + 1e-9; v += step) {
    grid += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`;
  }

  const gw = iw / labels.length, bw = Math.min(26, (gw * 0.64) / series.length);
  let bars = "", names = "";
  labels.forEach((lab, i) => {
    const x0 = m.l + i * gw + (gw - bw * series.length) / 2;
    series.forEach((s, j) => {
      const v = s.values[i], x = x0 + j * bw, h = ih - (y(v) - m.t);
      bars += `<rect x="${x}" y="${y(v)}" width="${bw - 3}" height="${Math.max(h, 0)}" rx="3" fill="${esc(s.color)}"><title>${esc(s.name)}: ${v}</title></rect>`;
      if (v > 0) bars += `<text class="val" x="${x + (bw - 3) / 2}" y="${y(v) - 5}" text-anchor="middle">${v}</text>`;
    });
    names += `<text x="${m.l + i * gw + gw / 2}" y="${H - 9}" text-anchor="middle">${esc(lab)}</text>`;
  });

  const resumo = series.map((s) => `${s.name}: ${s.values.join(", ")}`).join("; ");
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Desempenho mensal. ${esc(resumo)}">${grid}${bars}${names}</svg>`;
}
