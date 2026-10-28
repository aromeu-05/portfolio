import type { ComponentType } from "react";
import type { ProjectSlug } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

// En-tête d'une étude de cas, exporté par chaque fichier MDX (`export const meta = {…}`).
export type CaseMeta = {
  lede: string;
  facts: [label: string, value: string][]; // 5 colonnes : Client, Produit, Mon rôle, Période, Équipe
  cover: { motion: ProjectSlug; caption: string };
  chapters: { id: string; nav: string }[]; // sommaire, dans l'ordre des <Chapter>
};

type CaseModule = { default: ComponentType; meta: CaseMeta };

// Charge content/cases/<langue>/<slug>.mdx (repli sur le français si le fichier manque).
export async function loadCase(lang: Locale, slug: ProjectSlug): Promise<CaseModule | null> {
  for (const l of lang === "fr" ? ["fr"] : [lang, "fr"]) {
    try {
      return (await import(`@/content/cases/${l}/${slug}.mdx`)) as CaseModule;
    } catch {
      // fichier absent : on essaie la langue suivante
    }
  }
  return null;
}
