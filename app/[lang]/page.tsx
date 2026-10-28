import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import { About, Approach, Leadership } from "@/components/HomeSections";
import ProjectBlock from "@/components/ProjectBlock";
import SelectedWork from "@/components/SelectedWork";
import CoverMotion from "@/components/motions/CoverMotion";
import { projects } from "@/content/projects";
import { getDict, isLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  return (
    <main id="top">
      <Hero t={t.hero} />
      <SelectedWork t={t} />
      {projects.map((p) => (
        <ProjectBlock
          key={p.slug}
          project={p}
          t={t.projects[p.slug]}
          readCase={t.work.readCase}
          href={`/${lang}/projets/${p.slug}`}
        >
          <CoverMotion slug={p.slug} lang={lang} interactive />
        </ProjectBlock>
      ))}
      <Gallery t={t.gallery} lang={lang} />
      <Approach t={t.approach} />
      <Leadership t={t.leadership} />
      <About t={t.about} />
    </main>
  );
}
