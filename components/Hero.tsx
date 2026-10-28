"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FigmaSelection from "@/components/FigmaSelection";
import type { Dict } from "@/content/i18n/fr";
import Icon from "@/components/Icon";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const prefersReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pointeur façon Figma (noir pour le H1, orange sur la photo)
const CURSOR_PATH = "M3 2 L3 18 L7.5 13.8 L10.6 20 L13.4 18.7 L10.4 12.6 L16.5 12.4 Z";

export default function Hero({ t }: { t: Dict["hero"] }) {
  const title = `${t.titleBefore} ${t.titleSelected}${t.titleAfter}`;
  const before = t.titleBefore.split(/\s+/).filter(Boolean);
  const after = t.titleAfter.split(/\s+/).filter(Boolean);
  const selIndex = before.length;

  return (
    <section className="wrap hero">
      <HeroTitle title={title} before={before} selected={t.titleSelected} after={after} selIndex={selIndex} intro={t.intro} />

      <div className="photo">
        <div className="frame">
          <Image src="/images/alexie-about.webp" alt={t.photoAlt} fill priority sizes="(max-width: 960px) 270px, 370px" />
        </div>
        <TypingCursor text={t.bubble} />
      </div>

      <a className="scroll" href="#work">
        <i aria-hidden="true">
          <Icon name="arrow-down" />
        </i>
        {t.scroll}
      </a>
    </section>
  );
}

function HeroTitle({
  title,
  before,
  selected,
  after,
  selIndex,
  intro,
}: {
  title: string;
  before: string[];
  selected: string;
  after: string[];
  selIndex: number;
  intro: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<SVGSVGElement>(null);
  const [freed, setFreed] = useState(false); // laisse dépasser le cadre hors du masque du mot
  const [selOn, setSelOn] = useState(false);
  const [label, setLabel] = useState(selected);
  const [cursorGone, setCursorGone] = useState(false);

  // Étiquette « simples · 66 px » : taille réelle, recalculée au redimensionnement.
  useEffect(() => {
    const update = () => {
      if (!wordRef.current) return;
      const px = Math.round(parseFloat(getComputedStyle(wordRef.current).fontSize));
      setLabel(`${selected} · ${px} px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selected]);

  // Après la montée des mots, le curseur vient sélectionner le mot comme un calque.
  useEffect(() => {
    let cancelled = false;
    const box = boxRef.current, word = wordRef.current, cur = cursorRef.current;
    if (!box || !word || !cur) return;
    if (prefersReduced()) {
      setFreed(true);
      setSelOn(true);
      setCursorGone(true);
      return;
    }
    (async () => {
      await sleep(1700);
      if (cancelled) return;
      setFreed(true);
      const br = box.getBoundingClientRect(), r = word.getBoundingClientRect();
      cur.style.transition = "none";
      cur.style.transform = `translate(${r.left - br.left - 180}px, ${r.top - br.top - 120}px)`;
      cur.style.opacity = "1";
      await sleep(40);
      if (cancelled) return;
      cur.style.transition = "";
      cur.style.transform = `translate(${r.left - br.left + r.width * 0.55}px, ${r.top - br.top + r.height * 0.5}px)`;
      await sleep(1050);
      if (cancelled) return;
      setSelOn(true);
      await sleep(900);
      if (cancelled) return;
      cur.style.opacity = "0";
      await sleep(350);
      if (!cancelled) setCursorGone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const word = (w: string, i: number) => (
    <span key={i}>
      <span className="w" aria-hidden="true">
        <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
      </span>{" "}
    </span>
  );

  return (
    <div className="hero-text" ref={boxRef}>
      <h1 aria-label={title}>
        {before.map((w, i) => word(w, i))}
        <span className={`w${freed ? " free" : ""}`} aria-hidden="true">
          <span style={{ "--i": selIndex } as React.CSSProperties}>
            <span className="ul" ref={wordRef}>
              {selected}
              <FigmaSelection label={label} on={selOn} />
            </span>
          </span>
        </span>
        {after.map((w, i) => (
          <span key={`a${i}`} className="w" aria-hidden="true">
            <span style={{ "--i": selIndex + 1 + i } as React.CSSProperties}>{w}</span>
          </span>
        ))}
      </h1>
      {!cursorGone && (
        <svg className="fcursor" ref={cursorRef} viewBox="0 0 22 22" aria-hidden="true">
          <path d={CURSOR_PATH} fill="#121211" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
      <p className="intro">{intro}</p>
    </div>
  );
}

// Curseur orange avec bulle de chat : écrit le message, l'efface, recommence.
function TypingCursor({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (prefersReduced()) {
      setShown(text);
      return;
    }
    (async () => {
      await sleep(2400);
      while (!cancelled) {
        for (let i = 1; i <= text.length && !cancelled; i++) {
          setShown(text.slice(0, i));
          await sleep(70 + Math.random() * 60);
        }
        await sleep(2200);
        for (let i = text.length; i >= 0 && !cancelled; i--) {
          setShown(text.slice(0, i));
          await sleep(28);
        }
        await sleep(500);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div className="ccursor" aria-hidden="true">
      <svg viewBox="0 0 22 22">
        <path d={CURSOR_PATH} fill="#FF4A1C" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <span className="cbubble">
        <span>{shown}</span>
        <i />
      </span>
    </div>
  );
}
