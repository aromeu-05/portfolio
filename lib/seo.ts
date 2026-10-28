import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

// Adresse publique du site. À définir dans Vercel (NEXT_PUBLIC_SITE_URL) une fois le domaine choisi.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexieromeu.vercel.app").replace(/\/$/, "");

// Canonical + liens hreflang entre les versions FR et EN d'une même page.
// `path` est le chemin sans la langue : "" pour l'accueil, "/projets/athos" pour une étude de cas.
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: `/${lang}${path}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
      "x-default": `/fr${path}`,
    },
  };
}

export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };
