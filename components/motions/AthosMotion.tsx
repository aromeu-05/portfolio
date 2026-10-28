"use client";

import type { MotionText } from "./labels";
import { useEffect, useRef } from "react";
import { ATHOS_MARKUP } from "./athos-markup";
import { runMotion } from "./engine";
import "./athos-motion.css";
import "./motion-shared.css";

const RING = 81.7; // périmètre de l'anneau de confiance
const SCORE = 0.81;

// Motion ATHOS : 1. l'IA lit le devis et remplit les champs ; 2. elle détecte une incohérence
// d'adresse ; 3. l'instructeur valide (le visiteur clique sur « Valider » en mode interactif).
export default function AthosMotion({ interactive = false, aria, cue }: MotionText & { interactive?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T;
    const $$ = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];

    const cv = $(".a-cv");
    const card = $('.a-card[data-c="addr"]');
    const iaP = card.querySelector<HTMLElement>(".a-ia p")!;
    const ringC = $<SVGElement>(".a-ring .a-pr");
    const ringT = $(".a-ring [data-p]");
    const cnt = $('.a-cnt[data-c="w"]');
    const cntN = cnt.querySelector<HTMLElement>("span:last-child")!;
    const btnV = $(".a-acts .a-v");
    const cur = $<SVGElement>(".a-cur");
    const HOME = "translate(1080px,700px)";

    const reset = () => {
      root.classList.remove("a-go", "a-out");
      $$(".a-fi[data-v]").forEach((f) => {
        f.classList.remove("a-hit", "a-got");
        f.querySelector(".a-tx")!.textContent = "";
      });
      $$(".a-fi.a-err").forEach((f) => f.classList.remove("a-show"));
      $$(".a-hl,.a-pin,.a-ocr").forEach((e) => e.classList.remove("a-on"));
      $(".a-scan").classList.remove("a-run");
      $("[data-r]").classList.remove("a-on");
      card.classList.remove("a-open", "a-done");
      iaP.textContent = "";
      iaP.classList.remove("a-caret");
      ringC.style.transition = "none";
      ringC.style.strokeDashoffset = String(RING);
      ringT.textContent = "0%";
      cntN.textContent = "2";
      cur.classList.remove("a-on");
      cur.style.transition = "none";
      cur.style.transform = HOME;
    };

    const finalState = () => {
      root.classList.add("a-go");
      $$(".a-fi[data-v]").forEach((f) => {
        f.classList.add("a-got");
        f.querySelector(".a-tx")!.textContent = f.dataset.v ?? "";
      });
      $$(".a-fi.a-err").forEach((f) => f.classList.add("a-show"));
      $("[data-r]").classList.add("a-on");
      $$(".a-hl.a-addr,.a-pin").forEach((e) => e.classList.add("a-on"));
      card.classList.add("a-open");
      iaP.textContent = iaP.dataset.t ?? "";
      ringC.style.strokeDashoffset = String(RING * (1 - SCORE));
      ringT.textContent = `${Math.round(SCORE * 100)}%`;
    };

    return runMotion(root, {
      width: 1200,
      // Mobile : la caméra suit l'action (devis lu, champs remplis, point d'adresse, validation).
      mobile: { aspect: 4 / 5, start: { x: 60, y: 0, w: 600 }, end: { x: 66, y: 120, w: 440 } },
      canvas: cv,
      outClass: "a-out",
      interactive,
      reset,
      finalState,
      play: ({ at, track, gate, end, pos, cam }) => {
        const type = (el: HTMLElement, txt: string, dur: number) => {
          const step = dur / txt.length;
          el.classList.add("a-caret");
          for (let i = 1; i <= txt.length; i++)
            at(step * i, () => {
              el.textContent = txt.slice(0, i);
              if (i === txt.length) el.classList.remove("a-caret");
            });
        };
        const fill = (k: string, t0: number) => {
          const f = $(`.a-fi[data-k="${k}"]`), h = root.querySelector(`.a-hl[data-k="${k}"]`);
          at(t0, () => {
            h?.classList.add("a-on");
            f.classList.add("a-hit");
          });
          at(t0 + 120, () => {
            const v = f.dataset.v ?? "", tx = f.querySelector(".a-tx")!;
            [...v].forEach((_, i) => at(i * 28, () => (tx.textContent = v.slice(0, i + 1))));
          });
          at(t0 + 620, () => {
            f.classList.remove("a-hit");
            f.classList.add("a-got");
            h?.classList.remove("a-on");
          });
        };

        at(60, () => root.classList.add("a-go"));

        // Caméra mobile
        at(850, () => cam({ x: 650, y: 110, w: 540 }));
        at(1500, () => cam({ x: 376, y: 150, w: 470 }));
        at(2750, () => cam({ x: 650, y: 110, w: 540 }));
        at(3250, () => cam({ x: 66, y: 120, w: 440 }));

        // 1 · lecture OCR du devis
        at(900, () => {
          $(".a-ocr").classList.add("a-on");
          $(".a-scan").classList.add("a-run");
        });
        fill("num", 1150);
        fill("date", 1350);
        at(1550, () => $("[data-r]").classList.add("a-on"));
        fill("date2", 1700);
        fill("ht", 2150);
        at(2450, () => {
          $(".a-scan").classList.remove("a-run");
          $(".a-ocr").classList.remove("a-on");
          $$(".a-fi.a-err").forEach((f, i) => at(i * 140, () => f.classList.add("a-show")));
        });

        // 2 · incohérence d'adresse détectée
        at(2900, () => {
          $(".a-hl.a-addr").classList.add("a-on");
          $(".a-pin").classList.add("a-on");
        });
        at(3150, () => card.classList.add("a-open"));
        at(3450, () => type(iaP, iaP.dataset.t ?? "", 1300));
        at(4500, () => {
          ringC.style.transition = "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)";
          ringC.style.strokeDashoffset = String(RING * (1 - SCORE));
          const target = Math.round(SCORE * 100);
          let t = 0;
          const id = setInterval(() => {
            t += target / 20;
            ringT.textContent = `${Math.min(target, Math.round(t))}%`;
            if (t >= target) clearInterval(id);
          }, 45);
          track(id);
        });

        // 3 · l'instructeur valide
        at(5300, () =>
          gate({
            target: btnV,
            label: cue,
            then: (byUser) => {
              // Sans clic du visiteur, le curseur vient appuyer sur « Valider ».
              const t0 = byUser ? 0 : 1100;
              if (!byUser) {
                const [x, y] = pos(btnV);
                cur.classList.add("a-on");
                cur.style.transition = "transform 1s cubic-bezier(.45,0,.2,1),opacity .3s";
                cur.style.transform = `translate(${x}px,${y}px)`;
                at(t0, () => {
                  cur.style.transition = "transform .12s";
                  cur.style.transform += " scale(.85)";
                });
                at(t0 + 160, () => (cur.style.transform = `translate(${x}px,${y}px)`));
                at(t0 + 800, () => {
                  cur.style.transition = "transform .8s ease,opacity .5s";
                  cur.style.transform = HOME;
                  cur.classList.remove("a-on");
                });
              }
              at(t0, () => btnV.classList.add("a-press"));
              at(t0 + 160, () => btnV.classList.remove("a-press"));
              at(t0 + 350, () => {
                card.classList.remove("a-open");
                card.classList.add("a-done");
                $(".a-hl.a-addr").classList.remove("a-on");
                $(".a-pin").classList.remove("a-on");
                cnt.classList.add("a-bump");
              });
              at(t0 + 550, () => {
                cntN.textContent = "1";
                cnt.classList.remove("a-bump");
              });
              end(t0 + 2600);
            },
          }),
        );
      },
    });
  }, [interactive, cue]);

  return (
    <div
      ref={rootRef}
      className={interactive ? "athm m-interactive" : "athm"}
      role={interactive ? "group" : "img"}
      aria-label={aria}
      dangerouslySetInnerHTML={{ __html: ATHOS_MARKUP }}
    />
  );
}
