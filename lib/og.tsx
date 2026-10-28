import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Images d'aperçu (LinkedIn, Slack, iMessage…). Même DA que le site : fond crème, une touche d'orange.
export const OG_SIZE = { width: 1200, height: 630 };

const C = { bg: "#F7F5EF", fg: "#121211", muted: "#6E6B63", line: "#E2DED4", pop: "#FF4A1C" };

export const projectColors: Record<string, { pc: string; pt: string }> = {
  athos: { pc: "#F5E2A6", pt: "#FAF0D2" },
  rgc: { pc: "#CBE6CF", pt: "#E5F2E6" },
  opportunity: { pc: "#DDD3F3", pt: "#EEE9FA" },
  vidal: { pc: "#CCDFF3", pt: "#E5EEF9" },
};

// Geist récupérée sur Google Fonts au moment du build (en TTF, seul format lu par next/og).
// En cas d'échec réseau, l'image sort avec la police par défaut.
async function geist(family: string, weight: number) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

async function fonts() {
  const list = await Promise.all([
    geist("Geist", 400).then((data) => data && { name: "Geist", data, weight: 400 as const }),
    geist("Geist", 600).then((data) => data && { name: "Geist", data, weight: 600 as const }),
    geist("Geist+Mono", 400).then((data) => data && { name: "Geist Mono", data, weight: 400 as const }),
  ]);
  return list.filter((f) => f !== null);
}

const mono = { fontFamily: "Geist Mono" };

async function portrait() {
  const buf = await readFile(path.join(process.cwd(), "public/images/Alexie-7a2b48.jpg"));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

function Signature({ role, photo }: { role: string; photo: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} width={64} height={64} style={{ borderRadius: 999, border: `2px solid ${C.line}` }} alt="" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.fg }}>Alexie Romeu</div>
        <div style={{ ...mono, fontSize: 18, color: C.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>{role}</div>
      </div>
    </div>
  );
}

// Accueil : le titre du hero, avec le mot sélectionné façon Figma.
export async function homeOg(t: { before: string; selected: string; after: string; role: string }) {
  const photo = await portrait();
  return new ImageResponse(
    (
      <div style={{ fontFamily: "Geist", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: C.bg, padding: 72 }}>
        <Signature role={t.role} photo={photo} />
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", fontSize: 64, fontWeight: 600, lineHeight: 1.1, color: C.fg, letterSpacing: -1.5 }}>
          <span>{t.before}&nbsp;</span>
          <span style={{ display: "flex", position: "relative", border: `3px solid ${C.pop}`, padding: "0 8px" }}>
            {t.selected}
            {[{ top: -7, left: -7 }, { top: -7, right: -7 }, { bottom: -7, left: -7 }, { bottom: -7, right: -7 }].map((p, i) => (
              <span key={i} style={{ position: "absolute", width: 11, height: 11, background: "#fff", border: `3px solid ${C.pop}`, ...p }} />
            ))}
          </span>
          <span>{t.after}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

// Étude de cas : fond pastel du projet, tag de secteur, titre et accroche.
export async function caseOg(t: { slug: string; num: string; sector: string; title: string; lead: string; role: string }) {
  const photo = await portrait();
  const col = projectColors[t.slug] ?? { pc: C.line, pt: C.bg };
  return new ImageResponse(
    (
      <div style={{ fontFamily: "Geist", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: col.pt, padding: 72 }}>
        <div style={{ ...mono, display: "flex", alignItems: "center", gap: 16, fontSize: 20, letterSpacing: 1.5, textTransform: "uppercase", color: C.fg }}>
          <span style={{ color: C.muted }}>{t.num}</span>
          <span style={{ background: col.pc, padding: "6px 12px", borderRadius: 6 }}>{t.sector}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 600, color: C.fg, letterSpacing: -2, lineHeight: 1 }}>{t.title}</div>
          <div style={{ fontSize: 34, color: C.fg, lineHeight: 1.3, maxWidth: 980 }}>{t.lead}</div>
        </div>
        <Signature role={t.role} photo={photo} />
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
