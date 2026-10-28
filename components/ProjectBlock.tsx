import Link from "next/link";
import { CountUp, Reveal } from "@/components/Reveal";
import type { Dict } from "@/content/i18n/fr";
import type { projects } from "@/content/projects";
import Icon from "@/components/Icon";

type Project = (typeof projects)[number];

// Bloc projet de l'accueil : en-tête + chiffre clé, maquette sur fond pastel, lien vers l'étude de cas.
export default function ProjectBlock({
  project,
  t,
  readCase,
  href,
  children,
}: {
  project: Project;
  t: Dict["projects"][Project["slug"]];
  readCase: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`wrap case ${project.theme}`} id={project.slug}>
      <Reveal className="case-head">
        <div>
          <div className="top">
            <span className="mono">{project.num}</span>
            <span className="chip pc">{t.sector}</span>
            {t.award && (
              <span className="award">
                <i aria-hidden="true">✦</i>
                {t.award}
              </span>
            )}
          </div>
          <h3>{t.title}</h3>
          <p>
            <b>{t.lead}</b> {t.body}
          </p>
        </div>
        {t.metric && (
          <div className="metric">
            <div className="v">
              <CountUp to={t.metric.to} prefix={t.metric.prefix} suffix={t.metric.suffix} />
            </div>
            <div className="l mono">{t.metric.label}</div>
          </div>
        )}
      </Reveal>

      <Reveal className="stage">
        {t.hint && (
          <div className="stage-hint mono">
            <i />
            {t.hint}
          </div>
        )}
        {children}
        <span className="stage-cap mono">{t.caption}</span>
      </Reveal>

      <Reveal className="case-foot">
        <Link className="btn" href={href}>
          {readCase}
          <span>
            <Icon name="arrow-right" />
          </span>
        </Link>
      </Reveal>
    </article>
  );
}
