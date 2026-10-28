"use client";

import type { MotionText } from "./labels";
import { useEffect, useRef } from "react";
import { Raleway } from "next/font/google";
import { VIDAL_MARKUP } from "./vidal-markup";
import { runMotion } from "./engine";
import "./vidal-motion.css";
import "./motion-shared.css";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-raleway" });


type Box = { left: string; top: string; width: string; height: string };
const LOCK: Box = { left: "116px", top: "302px", width: "126px", height: "108px" };
const DET0: Box[] = [
  { left: "58px", top: "340px", width: "150px", height: "62px" },
  { left: "136px", top: "312px", width: "146px", height: "84px" },
];

// Motion Vidal : 1. scan du Datamatrix de la boîte ; 2. la fiche médicament s'ouvre ;
// 3. ajout au traitement (le visiteur clique sur le bouton en mode interactif).
export default function VidalMotion({ interactive = false, aria, cue }: MotionText & { interactive?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T;
    const $$ = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
    const on = (s: string, v = true) => $$(s).forEach((e) => e.classList.toggle("v-on", v));

    const cv = $(".v-cv");
    const cta = $(".v-cta");
    const tap = $(".v-tap");
    const detA = $('.v-det[data-d="a"]');
    const detB = $('.v-det[data-d="b"]');
    // Le repère de tap passe au-dessus du bouton : il ne doit pas capter le clic.
    tap.style.pointerEvents = "none";

    // Datamatrix pseudo-aléatoire (graine fixe)
    const dm = $(".v-dm");
    if (!dm.children.length) {
      let x = 7;
      for (let r = 0; r < 14; r++)
        for (let c = 0; c < 14; c++) {
          x = (x * 1103515245 + 12345) & 0x7fffffff;
          const lit = c === 0 || r === 13 || (r === 0 && c % 2 === 0) || (c === 13 && r % 2 === 1) || (x >> 16) & 1;
          dm.appendChild(document.createElement(lit ? "b" : "i"));
        }
    }

    const reset = () => {
      root.classList.remove("v-go", "v-out");
      $$(".v-on").forEach((e) => e.classList.remove("v-on"));
      $$(".v-pulse,.v-press,.v-lock,.v-rip").forEach((e) =>
        e.classList.remove("v-pulse", "v-press", "v-lock", "v-rip"),
      );
      [detA, detB].forEach((d, i) => Object.assign(d.style, DET0[i]));
    };

    const finalState = () => {
      root.classList.add("v-go");
      on(".v-box");
      on(".v-fiche");
      on("[data-i]");
      on(".v-cta");
      on(".v-note");
      $(".v-hot").classList.add("v-pulse");
    };

    return runMotion(root, {
      width: 1200,
      // Mobile : le téléphone seul, sans les annotations latérales.
      mobile: { aspect: 400 / 690, start: { x: 400, y: 22, w: 400 } },
      canvas: cv,
      outClass: "v-out",
      interactive,
      reset,
      finalState,
      play: ({ at, gate, end }) => {
        at(60, () => root.classList.add("v-go"));

        // 1 · scan
        at(500, () => on(".v-box"));
        at(1100, () => {
          on(".v-sweep");
          on('.v-note[data-n="1"]');
        });
        at(1500, () => detA.classList.add("v-on"));
        at(1750, () => detB.classList.add("v-on"));
        at(2000, () => Object.assign(detA.style, { left: "104px", top: "318px", width: "150px", height: "78px" }));
        at(2350, () => {
          on(".v-sweep", false);
          [detA, detB].forEach((d) => {
            Object.assign(d.style, LOCK);
            d.classList.add("v-lock");
          });
        });
        at(2650, () => {
          on(".v-ok");
          on(".v-flash");
        });

        // 2 · fiche
        at(3250, () => on(".v-fiche"));
        $$("[data-i]").forEach((e, i) => at(3700 + i * 110, () => e.classList.add("v-on")));
        at(4300, () => on(".v-cta"));
        at(4650, () => {
          $(".v-hot").classList.add("v-pulse");
          on('.v-note[data-n="2"]');
        });

        // 3 · ajout au traitement
        at(6100, () =>
          gate({
            target: cta,
            label: cue,
            then: (byUser) => {
              // Sans clic du visiteur, le repère de tap apparaît puis appuie 350 ms plus tard.
              const t0 = byUser ? 0 : 350;
              if (byUser) on(".v-tap");
              else at(0, () => on(".v-tap"));
              at(t0, () => {
                tap.classList.add("v-rip");
                cta.classList.add("v-press");
                on('.v-note[data-n="3"]');
              });
              at(t0 + 200, () => cta.classList.remove("v-press"));
              at(t0 + 300, () => {
                on(".v-tap", false);
                on(".v-toast");
              });
              end(t0 + 2550);
            },
          }),
        );
      },
    });
  }, [interactive, cue]);

  return (
    <div
      ref={rootRef}
      className={interactive ? `vidm m-interactive ${raleway.variable}` : `vidm ${raleway.variable}`}
      role={interactive ? "group" : "img"}
      aria-label={aria}
      dangerouslySetInnerHTML={{ __html: VIDAL_MARKUP }}
    />
  );
}
