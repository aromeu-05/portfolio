import type { ProjectSlug } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { motionText } from "./labels";
import AthosMotion from "./AthosMotion";
import OpportunityMotion from "./OpportunityMotion";
import RgcMotion from "./RgcMotion";
import VidalMotion from "./VidalMotion";

// Motion d'un projet (brief, section 4bis).
// interactive : sur l'accueil, la séquence attend que le visiteur fasse le geste clé.
// Sur la page d'étude de cas, elle joue d'une traite.
export default function CoverMotion({ slug, lang, interactive = false }: { slug: ProjectSlug; lang: Locale; interactive?: boolean }) {
  const text = motionText[lang][slug];
  switch (slug) {
    case "athos":
      return <AthosMotion interactive={interactive} {...text} />;
    case "rgc":
      return <RgcMotion interactive={interactive} {...text} />;
    case "opportunity":
      return <OpportunityMotion interactive={interactive} {...text} />;
    case "vidal":
      return <VidalMotion interactive={interactive} {...text} />;
  }
}
