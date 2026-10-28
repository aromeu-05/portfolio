"use client";

import { useEffect, useRef, useState } from "react";

// Fait apparaître le bloc (classe .rv → .rv.in) quand il entre dans l'écran.
export function Reveal({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: "div" | "section" | "h2";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement & HTMLHeadingElement>} className={`rv${inView ? " in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

// Chiffre qui compte jusqu'à sa valeur à l'entrée dans l'écran.
export function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const t0 = performance.now(), d = 1400;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / d);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}
