import HoverSelection from "@/components/HoverSelection";
import { projects } from "@/content/projects";
import type { Dict } from "@/content/i18n/fr";
import Icon from "@/components/Icon";

export default function SelectedWork({ t }: { t: Dict }) {
  return (
    <section className="wrap index" id="work">
      <div className="sh">
        <h2>
          {t.work.title[0]}
          <br />
          {t.work.title[1]}
        </h2>
        <span className="mono">{t.work.label}</span>
      </div>
      <div className="index-card">
        {projects.map((p) => {
          const c = t.projects[p.slug];
          return (
            <a key={p.slug} className={`row has-sel ${p.theme}`} href={`#${p.slug}`}>
              <span className="n mono">{p.num}</span>
              <span className="c">{p.name}</span>
              <span className="s">
                <span className="chip pc">{c.sector}</span>
              </span>
              <span className="p">{c.line}</span>
              <span className="arr">
                <Icon name="arrow-down" size={18} />
              </span>
              <HoverSelection name={p.name} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
