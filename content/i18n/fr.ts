// Textes validés (brief, section 5). Langue par défaut.
export const fr = {
  meta: {
    title: "Alexie Romeu · Lead Product Designer",
    description:
      "Portfolio d'Alexie Romeu, Lead Product Designer spécialisée dans les outils métier complexes.",
  },
  nav: {
    role: "Lead Product Designer · Paris",
    projects: "Projets",
    gallery: "Galerie · Asia.fr, La Poste…",
    gallerySub: "Galerie",
    approach: "Approche",
    about: "À propos",
    navigation: "Navigation",
    language: "Langue",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
  },
  hero: {
    // Le H1 est découpé autour du mot sélectionné façon Figma.
    titleBefore: "Des problèmes métier complexes, des interfaces qui les rendent",
    titleSelected: "simples",
    titleAfter: ".",
    intro:
      "Lead Product Designer chez Galadrim depuis 2021. Plus de 200 projets, de l'entrepreneur aux grands groupes, avec une spécialité : les applications métier complexes. J'ai fait de l'IA un outil central de mon process, du cadrage au prototype fonctionnel.",
    photoAlt: "Portrait d'Alexie Romeu",
    bubble: "Bienvenue sur mon portfolio",
    scroll: "Défiler pour découvrir",
  },
  work: {
    title: ["Des outils pour faciliter", "le quotidien"],
    label: "Selected work",
    readCase: "Lire l'étude de cas",
  },
  gallery: {
    title: "Et aussi",
    label: "Webflow · Apps · Refonte",
    aria: "Galerie de projets",
  },
  approach: {
    title: "Comment je travaille",
    label: "03 principes",
    steps: [
      {
        tag: "01 · Semaine 1",
        title: "Prototyper avant de spécifier",
        body: "Des protos codés avec l'IA dès la première semaine pour tester le flow avec le client et les utilisateurs finaux.",
      },
      {
        tag: "02 · En binôme",
        title: "Travailler avec les ingés et les PM",
        body: "Avec les product managers et les ingénieurs full stack et IA, on décide ensemble de ce qui compte pour l'utilisateur et de ce qui est faisable.",
      },
      {
        tag: "03 · Dans la durée",
        title: "Systématiser le craft",
        body: "Des design systems qui tiennent dans la durée, pour livrer vite sans perdre la qualité d'interface.",
      },
    ],
  },
  leadership: {
    label: "Leadership",
    period: "2021 — 2026",
    title: "J'ai aussi construit une équipe",
    body: "Recrutement et formation de l'équipe design, création d'un studio dédié que j'ai dirigé, puis refusion avec l'agence.",
    team: "designers recrutés et formés",
    company: "personnes chez Galadrim, une vingtaine à mon arrivée",
    studio: "studio design lancé et dirigé",
  },
  about: {
    label: "À propos",
    languages: "FR · EN",
    title: "6 ans entre la compréhension métier et le craft d'interface.",
    paragraphs: [
      "Depuis 6 ans chez Galadrim, j'enchaîne les projets dans la santé, la finance, la mode ou le voyage. Chaque client m'oblige à comprendre vite un métier que je ne connais pas, à travailler en binôme avec les développeurs et à livrer des outils qui tiennent en production.",
      "Je travaille en français et en anglais.",
    ],
    timeline: [
      { when: "2021 —", role: "Lead Product Designer", where: "Galadrim" },
      { when: "2022 – 2024", role: "Co-fondatrice et CEO, studio design", where: "Pop Tarte" },
      { when: "Études", role: "MBA création et stratégie publicitaire", where: "EFAP Paris" },
      { when: "Échange", role: "Marketing", where: "ESG UQAM Montréal" },
    ],
  },
  caseStudy: {
    back: "Retour aux projets",
    toc: "Sommaire",
    next: "Projet suivant",
  },
  footer: {
    thanks: "Et si on parlait autour d’un café ?",
    copyright: "© 2026 Alexie Romeu · Lead Product Designer",
    status: "Ouverte aux opportunités",
  },
  // Textes par projet : ligne de Selected work + bloc projet de l'accueil
  projects: {
    athos: {
      sector: "Énergie · CEE",
      line: "Traitement IA des dossiers de rénovation",
      title: "Effy · ATHOS",
      lead: "Un back-office où l'IA lit les pièces du dossier.",
      body: "Les gestionnaires ne recopient plus les devis et factures : ils vérifient ce que l'IA a extrait et tranchent les cas douteux.",
      metric: { to: 500, prefix: "400–", suffix: "", label: "extractions par jour" },
      award: null,
      hint: "À vous de jouer · validez le point",
      caption: "Fiche dossier · reconstruite depuis la V18 validée",
    },
    rgc: {
      sector: "Golf · Hôtellerie",
      line: "Rosie, un PMS pour les golfs",
      title: "Resonance Golf Collection",
      lead: "Rosie, le PMS d'un réseau de golfs.",
      body: "Chaque module, de la caisse au planning des départs, est prototypé en code et testé au comptoir avant d'être spécifié.",
      metric: { to: 100, prefix: "", suffix: " %", label: "des modules prototypés en code" },
      award: null,
      hint: "À vous de jouer · encaissez la partie",
      caption: "Planning des départs · reconstruit depuis le proto Rosie",
    },
    opportunity: {
      sector: "SaaS B2B",
      line: "Plateforme de marketing automation",
      title: "Opportunity",
      lead: "Un outil de marketing automation.",
      body: "Rendre lisibles des scénarios à plusieurs branches pour des équipes marketing qui ne sont pas techniques.",
      metric: null,
      award: null,
      hint: "À vous de jouer · branchez la relance SMS",
      caption: "Éditeur de scénario · données fictives",
    },
    vidal: {
      sector: "Santé · Mobile",
      line: "L'info médicament pour les patients",
      title: "Vidal Ma Santé",
      lead: "La base médicament de Vidal dans la poche des patients.",
      body: "Une information écrite pour les professionnels, rendue compréhensible et adaptée à la prescription de chacun.",
      metric: { to: 3, prefix: "", suffix: "", label: "reconnaissances en 2022" },
      award: "Prix Galien 2022",
      hint: "À vous de jouer · ajoutez le médicament",
      caption: "Écrans réinterprétés · contenus fictifs",
    },
  } as Record<
    "athos" | "rgc" | "opportunity" | "vidal",
    {
      sector: string;
      line: string;
      title: string;
      lead: string;
      body: string;
      metric: { to: number; prefix: string; suffix: string; label: string } | null;
      award: string | null;
      hint: string | null;
      caption: string;
    }
  >,
};

export type Dict = typeof fr;
