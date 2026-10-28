import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Toc from "@/components/case/Toc";
import Icon from "@/components/Icon";
import CoverMotion from "@/components/motions/CoverMotion";
import { projects, type ProjectSlug } from "@/content/projects";
import { loadCase } from "@/lib/cases";
import { getDict, isLocale, locales } from "@/lib/i18n";
import { alternates, ogLocale } from "@/lib/seo";

type Params = Promise<{ lang: string; slug: string }>;

export const dynamicParams = false;
export const generateStaticParams = () =>
  locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

const findProject = (slug: string) => projects.find((p) => p.slug === slug);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = findProject(slug);
  if (!isLocale(lang) || !p) return {};
  const t = getDict(lang);
  const c = await loadCase(lang, p.slug);
  const title = `${t.projects[p.slug].title} · Alexie Romeu`;
  const description = c?.meta.lede ?? t.projects[p.slug].lead;
  return {
    title,
    description,
    alternates: alternates(lang, `/projets/${p.slug}`),
    openGraph: {
      type: "article",
      siteName: "Alexie Romeu",
      title,
      description,
      url: `/${lang}/projets/${p.slug}`,
      locale: ogLocale[lang],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CasePage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (!isLocale(lang) || index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const c = await loadCase(lang, project.slug as ProjectSlug);
  if (!c) notFound();

  const t = getDict(lang);
  const p = t.projects[project.slug];
  const { meta, default: Body } = c;

  return (
    <main className={`case-page ${project.theme}`}>
      <section className="wrap cs-hero">
        <Link className="back" href={`/${lang}#work`}>
          <Icon name="arrow-left" />
          {t.caseStudy.back}
        </Link>
        <div className="cs-tags">
          <span className="mono">{project.num}</span>
          <span className="chip pc">{p.sector}</span>
          {p.award && (
            <span className="award">
              <i aria-hidden="true">✦</i>
              {p.award}
            </span>
          )}
        </div>
        <h1>{p.title}</h1>
        <p className="cs-lede">{meta.lede}</p>
        <dl className="facts">
          {meta.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <figure className="fig cs-cover">
          <CoverMotion slug={meta.cover.motion} lang={lang} />
          <figcaption>{meta.cover.caption}</figcaption>
        </figure>
      </section>

      <section className="wrap cs-body">
        <Toc chapters={meta.chapters} label={t.caseStudy.toc} />
        <div>
          <Body />
        </div>
      </section>

      <section className="wrap">
        <Link className={`next ${next.theme}`} href={`/${lang}/projets/${next.slug}`}>
          <div>
            <span className="mono muted">{t.caseStudy.next}</span>
            <h3>{t.projects[next.slug].title}</h3>
          </div>
          <span className="arr" aria-hidden="true">
            <Icon name="arrow-right" size={26} />
          </span>
        </Link>
      </section>
    </main>
  );
}
