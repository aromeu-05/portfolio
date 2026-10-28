"use client";

import { useEffect, useRef, useState } from "react";

// Sélection façon Figma au survol du parent (qui doit porter la classe "has-sel").
// L'étiquette donne le nom et les dimensions réelles mesurées au survol : « Asia.fr · 432 × 398 ».
// Même rendu que FigmaSelection ; le cadre doit être enfant direct du parent pour le CSS.
export default function HoverSelection({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState(name);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const measure = () => {
      const r = parent.getBoundingClientRect();
      setLabel(`${name} · ${Math.round(r.width)} × ${Math.round(r.height)}`);
    };
    parent.addEventListener("mouseenter", measure);
    return () => parent.removeEventListener("mouseenter", measure);
  }, [name]);

  return (
    <span ref={ref} className="fsel" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b>{label}</b>
    </span>
  );
}
