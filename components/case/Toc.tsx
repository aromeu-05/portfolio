"use client";

import { useEffect, useState } from "react";

// Sommaire collant : un point orange marque le chapitre en cours.
export default function Toc({ chapters, label }: { chapters: { id: string; nav: string }[]; label: string }) {
  const [active, setActive] = useState(chapters[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.slice(3))),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(`ch-${c.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [chapters]);

  return (
    <nav className="toc" aria-label={label}>
      {chapters.map((c) => (
        <a key={c.id} href={`#ch-${c.id}`} className={c.id === active ? "on" : undefined} aria-current={c.id === active ? "location" : undefined}>
          {c.nav}
        </a>
      ))}
    </nav>
  );
}
