import type { Dict } from "./fr";

// Version anglaise. Même structure que fr.ts : toute clé ajoutée en FR doit l'être ici.
export const en: Dict = {
  meta: {
    title: "Alexie Romeu · Lead Product Designer",
    description:
      "Portfolio of Alexie Romeu, Lead Product Designer specializing in complex business tools.",
  },
  nav: {
    role: "Lead Product Designer · Paris",
    projects: "Projects",
    gallery: "Gallery · Asia.fr, La Poste…",
    gallerySub: "Gallery",
    approach: "Approach",
    about: "About",
    navigation: "Navigation",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    titleBefore: "Complex business problems, interfaces that make them",
    titleSelected: "simple",
    titleAfter: ".",
    intro:
      "Lead Product Designer at Galadrim since 2021. Over 200 projects, from founders to large corporations, with one specialty: complex business applications. AI is a core part of my process, from scoping to working prototype.",
    photoAlt: "Portrait of Alexie Romeu",
    bubble: "Welcome to my portfolio",
    scroll: "Scroll to explore",
  },
  work: {
    title: ["Tools that make", "everyday work easier"],
    label: "Selected work",
    readCase: "Read the case study",
  },
  gallery: {
    title: "Also",
    label: "Webflow · Apps · Redesign",
    aria: "Project gallery",
  },
  approach: {
    title: "How I work",
    label: "03 principles",
    steps: [
      {
        tag: "01 · Week 1",
        title: "Prototype before specifying",
        body: "AI-coded prototypes from the first week, to test the flow with the client and end users.",
      },
      {
        tag: "02 · Side by side",
        title: "Work with engineers and PMs",
        body: "With product managers and full-stack and AI engineers, we decide together what matters to the user and what is feasible.",
      },
      {
        tag: "03 · For the long run",
        title: "Make craft systematic",
        body: "Design systems built to last, so we can ship fast without losing interface quality.",
      },
    ],
  },
  leadership: {
    label: "Leadership",
    period: "2021 — 2026",
    title: "I also built a team",
    body: "Hired and trained the design team, launched and ran a dedicated design studio, then merged it back into the agency.",
    team: "designers hired and trained",
    company: "people at Galadrim, about twenty when I joined",
    studio: "design studio launched and run",
  },
  about: {
    label: "About",
    languages: "FR · EN",
    title: "6 years between understanding the business and crafting the interface.",
    paragraphs: [
      "For 6 years at Galadrim, I have worked on projects in healthcare, finance, fashion and travel. Each client forces me to quickly learn a business I don't know, to work side by side with developers, and to ship tools that hold up in production.",
      "I work in French and English.",
    ],
    timeline: [
      { when: "2021 —", role: "Lead Product Designer", where: "Galadrim" },
      { when: "2022 – 2024", role: "Co-founder and CEO, design studio", where: "Pop Tarte" },
      { when: "Education", role: "MBA in creative and advertising strategy", where: "EFAP Paris" },
      { when: "Exchange", role: "Marketing", where: "ESG UQAM Montréal" },
    ],
  },
  caseStudy: {
    back: "Back to projects",
    toc: "Contents",
    next: "Next project",
  },
  footer: {
    thanks: "Let’s talk over coffee?",
    copyright: "© 2026 Alexie Romeu · Lead Product Designer",
    status: "Open to opportunities",
  },
  projects: {
    athos: {
      sector: "Energy · CEE",
      line: "AI processing of renovation files",
      title: "Effy · ATHOS",
      lead: "A back office where AI reads the documents in each file.",
      body: "Case handlers no longer retype quotes and invoices: they check what the AI extracted and decide the doubtful cases.",
      metric: { to: 500, prefix: "400–", suffix: "", label: "extractions per day" },
      award: null,
      hint: "Your turn · approve the flag",
      caption: "Case file · rebuilt from the approved V18",
    },
    rgc: {
      sector: "Golf · Hospitality",
      line: "Rosie, a PMS for golf courses",
      title: "Resonance Golf Collection",
      lead: "Rosie, the PMS of a golf course network.",
      body: "Every module, from the till to the tee sheet, is prototyped in code and tested at the front desk before it is specified.",
      metric: { to: 100, prefix: "", suffix: "%", label: "of modules prototyped in code" },
      award: null,
      hint: "Your turn · take the payment",
      caption: "Tee sheet · rebuilt from the Rosie prototype",
    },
    opportunity: {
      sector: "B2B SaaS",
      line: "Marketing automation platform",
      title: "Opportunity",
      lead: "A marketing automation tool.",
      body: "Making multi-branch scenarios readable for marketing teams who aren't technical.",
      metric: null,
      award: null,
      hint: "Your turn · connect the SMS follow-up",
      caption: "Scenario editor · sample data",
    },
    vidal: {
      sector: "Health · Mobile",
      line: "Drug information for patients",
      title: "Vidal Ma Santé",
      lead: "Vidal's drug database in patients' pockets.",
      body: "Information written for healthcare professionals, made understandable and tailored to each person's prescription.",
      metric: { to: 3, prefix: "", suffix: "", label: "awards in 2022" },
      award: "Prix Galien 2022",
      hint: "Your turn · add the medication",
      caption: "Reinterpreted screens · sample content",
    },
  },
};
