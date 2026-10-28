import HoverSelection from "@/components/HoverSelection";
import { CountUp, Reveal } from "@/components/Reveal";
import type { Dict } from "@/content/i18n/fr";

export function Approach({ t }: { t: Dict["approach"] }) {
  return (
    <section className="wrap" id="approche">
      <div className="sh">
        <h2>{t.title}</h2>
        <span className="mono">{t.label}</span>
      </div>
      <div className="steps">
        {t.steps.map((s) => (
          <Reveal key={s.title} className="step has-sel">
            <span className="mono">{s.tag}</span>
            <h4>{s.title}</h4>
            <p>{s.body}</p>
            <HoverSelection name={s.title} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Leadership({ t }: { t: Dict["leadership"] }) {
  return (
    <section className="wrap">
      <div className="sh">
        <span className="mono">{t.label}</span>
        <span className="mono">{t.period}</span>
      </div>
      <div className="lead">
        <Reveal>
          <h2>{t.title}</h2>
          <p>{t.body}</p>
        </Reveal>
        <Reveal className="nums">
          <div>
            <div className="v">
              2
              <svg viewBox="0 0 30 20" aria-hidden="true">
                <path d="M2 10h24M19 3l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <CountUp to={6} />
            </div>
            <small>{t.team}</small>
          </div>
          <div>
            <div className="v">
              <CountUp to={200} prefix="~" />
            </div>
            <small>{t.company}</small>
          </div>
          <div>
            <div className="v">
              <CountUp to={1} />
            </div>
            <small>{t.studio}</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function About({ t }: { t: Dict["about"] }) {
  return (
    <section className="wrap" id="about">
      <div className="sh">
        <span className="mono">{t.label}</span>
        <span className="mono">{t.languages}</span>
      </div>
      <div className="about">
        <Reveal>
          <h2>{t.title}</h2>
          {t.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal className="timeline">
          {t.timeline.map((r) => (
            <div key={r.role}>
              <span className="mono">{r.when}</span>
              <b>{r.role}</b>
              <span>{r.where}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
