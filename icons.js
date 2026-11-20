// Ícones em SVG (traço). Uso: icon("home")
const P = {
  home:     '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  users:    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5c2.4.3 4 1.9 4.5 4.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  wallet:   '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v4"/><path d="M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9H6.5A2.5 2.5 0 0 1 4 7.5z"/><circle cx="16" cy="13.5" r="1.2"/>',
  shield:   '<path d="M12 3l7.5 3v5.5c0 4.4-3 8-7.5 9.5C7.5 19.5 4.5 15.9 4.5 11.5V6L12 3z"/><path d="m9 12 2 2 4-4"/>',
  menu:     '<path d="M4 7h16M4 12h16M4 17h16"/>',
  logout:   '<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/><path d="M16 8l4 4-4 4M20 12H9"/>',
  clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  chat:     '<path d="M4 5h16v11H9l-5 4V5z"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
};
export const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ""}</svg>`;
