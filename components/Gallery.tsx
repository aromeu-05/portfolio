import HoverSelection from "@/components/HoverSelection";
import type { Dict } from "@/content/i18n/fr";
import type { Locale } from "@/lib/i18n";
import items from "@/public/images/gallery/gallery.json";

type Item = (typeof items)[number];

function Tile({ item, lang, copy }: { item: Item; lang: Locale; copy?: boolean }) {
  const hidden = copy ? { "aria-hidden": true, tabIndex: -1 } : {};
  const external = item.href.startsWith("http");
  const body = (
    <>
      <div className="thumb">
        <img
          src={item.src}
          srcSet={`${item.src} 800w, ${item.src2x} 1600w`}
          sizes="(max-width: 960px) 260px, 370px"
          width={800}
          height={600}
          alt={copy ? "" : item.alt[lang]}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div>
        <b>{item.name}</b>
        <br />
        <small>{item.sub[lang]}</small>
      </div>
      <HoverSelection name={item.name} />
    </>
  );

  // Pas encore de page dédiée : carte non cliquable.
  if (item.href === "#") {
    return (
      <div className="tile has-sel" {...(copy ? { "aria-hidden": true } : {})}>
        {body}
      </div>
    );
  }
  return (
    <a
      className="tile has-sel"
      href={item.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...hidden}
    >
      {body}
    </a>
  );
}

// Slider automatique en boucle : les cartes sont dupliquées (copies masquées aux lecteurs d'écran).
// La liste des projets et les vignettes sont dans public/images/gallery/gallery.json.
export default function Gallery({ t, lang }: { t: Dict["gallery"]; lang: Locale }) {
  return (
    <section className="wrap" id="galerie">
      <div className="sh">
        <h2>{t.title}</h2>
        <span className="mono">{t.label}</span>
      </div>
      <div className="marquee" aria-label={t.aria}>
        <div className="mq-track">
          {items.map((item) => (
            <Tile key={item.slug} item={item} lang={lang} />
          ))}
          {items.map((item) => (
            <Tile key={`${item.slug}-copy`} item={item} lang={lang} copy />
          ))}
        </div>
      </div>
    </section>
  );
}
