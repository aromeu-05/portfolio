import { getDict, isLocale, locales } from "@/lib/i18n";
import { homeOg, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Alexie Romeu · Lead Product Designer";
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDict(isLocale(lang) ? lang : "fr");
  return homeOg({ before: t.hero.titleBefore, selected: t.hero.titleSelected, after: t.hero.titleAfter, role: t.nav.role });
}
