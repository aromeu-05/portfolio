// Les 4 études de cas, dans l'ordre d'affichage.
// Les textes (nom de secteur, accroche…) sont dans content/i18n.
export const projects = [
  { slug: "athos", num: "01", name: "Effy · ATHOS", theme: "p-athos" },
  { slug: "rgc", num: "02", name: "Resonance Golf", theme: "p-rgc" },
  { slug: "opportunity", num: "03", name: "Opportunity", theme: "p-opp" },
  { slug: "vidal", num: "04", name: "Vidal Ma Santé", theme: "p-vidal" },
] as const;

export type ProjectSlug = (typeof projects)[number]["slug"];

export const LINKEDIN_URL = "https://www.linkedin.com/in/alexie-romeu/";
