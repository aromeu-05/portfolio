import { projects } from "@/content/projects";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { caseOg, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Étude de cas · Alexie Romeu";
export const generateStaticParams = () =>
  locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const t = getDict(isLocale(lang) ? lang : "fr");
  const p = projects.find((x) => x.slug === slug) ?? projects[0];
  const tp = t.projects[p.slug];
  return caseOg({ slug: p.slug, num: p.num, sector: tp.sector, title: tp.title, lead: tp.lead, role: t.nav.role });
}
