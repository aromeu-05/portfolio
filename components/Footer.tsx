import { Reveal } from "@/components/Reveal";
import { LINKEDIN_URL } from "@/content/projects";
import type { Dict } from "@/content/i18n/fr";
import Icon from "@/components/Icon";

export default function Footer({ t }: { t: Dict["footer"] }) {
  return (
    <footer className="end wrap">
      <Reveal as="h2">{t.thanks}</Reveal>
      <Reveal className="end-links">
        <a className="btn" href={LINKEDIN_URL} target="_blank" rel="noopener">
          LinkedIn
          <span>
            <Icon name="arrow-up-right" />
          </span>
        </a>
      </Reveal>
      <div className="legal mono">
        <span className="nocaps">{t.copyright}</span>
        <span className="nocaps">{t.status}</span>
      </div>
    </footer>
  );
}
