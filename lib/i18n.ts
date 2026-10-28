import { fr, type Dict } from "@/content/i18n/fr";
import { en } from "@/content/i18n/en";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

const dicts: Record<Locale, Dict> = { fr, en };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const getDict = (l: Locale) => dicts[l];
