"use client";

import type { MotionText } from "./labels";
import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { OPPORTUNITY_MARKUP } from "./opportunity-markup";
import { runMotion } from "./engine";
import "./opportunity-motion.css";
import "./motion-shared.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter" });


// Icônes injectées à la place des <i data-ic> du canevas.
const P: Record<string, string> = {chevL:'<path d="M15 5l-7 7 7 7"/>',chevR:'<path d="M9 5l7 7-7 7"/>',undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',split:'<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9c0 5-12 3-12 8"/>',ab:'<rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/><path d="M5.5 10h3M15.5 10h3M15.5 14h3"/>',pause:'<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',end:'<path d="M4 20L20 4M8 4h12v12"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 6.5L20.5 6"/>',msg:'<path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.3A8 8 0 1 1 21 12z"/>',msg2:'<path d="M17 10a6 6 0 0 1-8.8 5.3L4 16.5l.9-3.5A6 6 0 1 1 17 10z"/><path d="M11 18.5a6 6 0 0 0 7.8 1.2l2.7.8-.8-2.7A6 6 0 0 0 19 10"/>',rcs:'<rect x="4" y="5" width="16" height="12" rx="3"/><path d="M8 17l-2 3M9 10h6"/>',wa:'<path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4.1A8 8 0 1 1 20 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z"/>',vm:'<circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M7 15.5h10"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',play:'<path d="M7 4l13 8-13 8z"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c1.9.7 3.1 2.6 3.5 5.5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>'};

const HOME = "translate(1000px,780px)";

// Motion Opportunity : 1. un bloc Email est glissé sur le canevas ; 2. ses sorties apparaissent ;
// 3. une relance SMS est branchée sur « Aucune interaction » (le visiteur clique en mode interactif).
export default function OpportunityMotion({ interactive = false, aria, cue }: MotionText & { interactive?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T;
    const $$ = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];

    const cv = $(".o-cv");
    const ic = (n: string) => `<svg class="o-i" viewBox="0 0 24 24">${P[n] || ""}</svg>`;
    if (!root.dataset.built) {
      root.dataset.built = "1";
      $$("i[data-ic]").forEach((e) => {
        const st = e.getAttribute("style"), cl = e.getAttribute("class");
        let s = ic(e.dataset.ic ?? "");
        if (cl) s = s.replace('class="o-i"', `class="o-i ${cl}"`);
        if (st) s = s.replace("<svg ", `<svg style="${st}" `);
        e.outerHTML = s;
      });
      root
        .querySelectorAll<SVGPathElement>(".o-wires path.o-dr")
        .forEach((p) => p.style.setProperty("--l", String(Math.ceil(p.getTotalLength()) + 1)));
    }

    const cur = $<SVGElement>(".o-cur"), gh = $(".o-ghost");
    const K = (k: string) => $(`[data-k="${k}"]`);
    const W = (k: string) => $(`[data-w="${k}"]`), A = (k: string) => $(`[data-a="${k}"]`);
    const on = (el: Element, v = true) => el.classList.toggle("o-on", v);
    const panel = (v: string) => $$(".o-pv").forEach((e) => e.classList.toggle("o-hid", e.dataset.pv !== v));

    const reset = () => {
      root.classList.remove("o-out");
      $$(".o-on").forEach((e) => e.classList.remove("o-on"));
      $$(".o-sel,.o-act,.o-hot,.o-hide,.o-hov,.o-grab,.o-foc").forEach((e) =>
        e.classList.remove("o-sel", "o-act", "o-hot", "o-hide", "o-hov", "o-grab", "o-foc"),
      );
      panel("start");
      K("sub").textContent = "1 bloc · modifié il y a 3 min";
      const n = K("smsname");
      n.textContent = "SMS";
      n.classList.add("o-ph0");
      n.classList.remove("o-caret");
      K("step").innerHTML = "<b>01</b> · Glisser un bloc";
      K("smssub").textContent = "Pas d'application";
      gh.style.transition = "none";
      gh.style.transform = "translate(60px,330px)";
      cur.classList.remove("o-on");
      cur.style.transition = "none";
      cur.style.transform = HOME;
    };

    const finalState = () => {
      [
        '[data-w="fr"]', '[data-a="fr"]', '[data-w="ex"]', '[data-w="e1"]', '[data-w="e2"]', '[data-w="e3"]',
        '[data-w="e4"]', '[data-w="sms"]', '[data-a="sms"]', '[data-w="sx"]', '[data-b="email"]', '[data-b="sms"]',
        ".o-pill.o-ex", ".o-plus.o-ex", ".o-step",
      ].forEach((s) => $$(s).forEach((e) => on(e)));
      K("frp").classList.add("o-hide");
      $('[data-p="2"]').classList.add("o-hide");
      $('[data-x="2"]').classList.add("o-act");
      panel("sms");
      K("smsname").textContent = "Relance SMS J+2";
      K("smsname").classList.remove("o-ph0");
      K("sub").textContent = "3 blocs · 2 connexions";
      K("step").innerHTML = "<b>03</b> · Enchaîner une relance";
    };

    return runMotion(root, {
      width: 1440,
      // Mobile : la caméra suit la construction (palette, bloc Email, sorties, relance SMS, réglages).
      mobile: { aspect: 4 / 5, start: { x: 0, y: 76, w: 560 }, end: { x: 520, y: 220, w: 560 }, overlay: [".o-step"] },
      canvas: cv,
      outClass: "o-out",
      interactive,
      reset,
      finalState,
      play: ({ at, gate, end, pos, cam }) => {
        const mv = (x: number, y: number, dur = 800) => {
          cur.classList.add("o-on");
          cur.style.transition = `transform ${dur}ms cubic-bezier(.45,0,.2,1),opacity .3s`;
          cur.style.transform = `translate(${x}px,${y}px)`;
        };
        const move = (el: Element, dur: number, dx = 0.5, dy = 0.55) => {
          const [x, y] = pos(el, dx, dy);
          mv(x, y, dur);
        };
        const click = () => {
          const t = cur.style.transform;
          cur.style.transition = "transform .12s";
          cur.style.transform = t + " scale(.85)";
          at(160, () => (cur.style.transform = t));
        };
        const step = (n: number, txt: string) => {
          const el = K("step");
          el.style.opacity = "0";
          at(230, () => {
            el.innerHTML = `<b>0${n}</b> · ${txt}`;
            el.style.opacity = "1";
          });
        };
        const sub = (t: string) => {
          const s = K("sub");
          s.style.opacity = "0";
          at(200, () => {
            s.textContent = t;
            s.style.opacity = "1";
          });
        };

        at(300, () => on($(".o-step")));

        // Caméra mobile
        at(1650, () => cam({ x: 270, y: 120, w: 560 }));
        at(3400, () => cam({ x: 520, y: 220, w: 480 }));
        at(5500, () => cam({ x: 600, y: 230, w: 470 }));

        // 1 · glisser le bloc Email
        const it = $('[data-pal="email"]');
        at(600, () => move(it, 900, 0.35, 0.5));
        at(1450, () => it.classList.add("o-hov"));
        at(1600, () => {
          click();
          it.classList.add("o-grab");
          const [x, y] = pos(it, 0.2, 0.25);
          gh.style.transition = "none";
          gh.style.transform = `translate(${x}px,${y}px)`;
          void gh.offsetWidth;
          on(gh);
          on($(".o-drop"));
        });
        at(1750, () => {
          gh.style.transition = "transform 1.1s cubic-bezier(.45,0,.2,1),opacity .2s";
          gh.style.transform = "translate(600px,280px)";
          mv(650, 302, 1100);
          K("frp").classList.add("o-hot");
        });
        at(2950, () => {
          click();
          on(gh, false);
          on($(".o-drop"), false);
          it.classList.remove("o-grab", "o-hov");
          K("frp").classList.add("o-hide");
          const b = $('[data-b="email"]');
          on(b);
          b.classList.add("o-sel");
          on(W("fr"));
          on(A("fr"));
          panel("email");
          sub("2 blocs · 1 connexion · modifié à l'instant");
        });

        // 2 · les sorties apparaissent
        at(3500, () => {
          step(2, "Les sorties apparaissent");
          on(W("ex"));
        });
        [1, 2, 3, 4].forEach((n, i) =>
          at(3700 + i * 170, () => {
            on(W("e" + n));
            on($(`[data-x="${n}"]`));
            const p = root.querySelector(`[data-p="${n}"]`);
            if (p) on(p);
          }),
        );
        at(4600, () => move($('[data-x="1"]'), 700, 0.7, 0.5));
        at(5300, () => on($(".o-tip")));
        at(6500, () => on($(".o-tip"), false));

        // 3 · relance SMS branchée sur « Aucune interaction »
        const plus = $('[data-p="2"]'), out2 = $('[data-x="2"]'), mSms = $('[data-m="sms"]');
        at(6600, () => {
          step(3, "Enchaîner une relance");
          gate({
            target: out2,
            label: cue,
            then: (byUser) => {
              // Sans clic du visiteur, le curseur vient cliquer sur le « + » de la sortie.
              const t0 = byUser ? 0 : 800;
              if (!byUser) move(plus, 750);
              at(t0, () => {
                if (!byUser) click();
                plus.classList.add("o-hot");
                out2.classList.add("o-act");
                on($(".o-menu"));
              });
              at(t0 + 300, () => move(mSms, 650, 0.3));
              at(t0 + 950, () => mSms.classList.add("o-hov"));
              at(t0 + 1100, () => click());
              at(t0 + 1300, () => {
                on($(".o-menu"), false);
                mSms.classList.remove("o-hov");
                plus.classList.add("o-hide");
                $('[data-b="email"]').classList.remove("o-sel");
                on(W("sms"));
                on(A("sms"));
                at(250, () => {
                  const b = $('[data-b="sms"]');
                  on(b);
                  b.classList.add("o-sel");
                });
                panel("sms");
                sub("3 blocs · 2 connexions · modifié à l'instant");
              });
              at(t0 + 1900, () => {
                on(W("sx"));
                at(250, () => on($('[data-x="5"]')));
                at(420, () => on($('[data-x="6"]')));
              });
              at(t0 + 1950, () => cam({ x: 1065, y: 76, w: 375 }));
              at(t0 + 2100, () => move(K("smsname"), 800, 0.3));
              at(t0 + 2950, () => {
                click();
                const n = K("smsname");
                n.classList.add("o-foc", "o-caret");
                n.classList.remove("o-ph0");
                n.textContent = "";
                const t = "Relance SMS J+2";
                [...t].forEach((_, i) => at(i * 55, () => (n.textContent = t.slice(0, i + 1))));
              });
              at(t0 + 4000, () => {
                K("smsname").classList.remove("o-caret", "o-foc");
                K("smssub").textContent = "Relance SMS J+2";
                cur.style.transition = "transform .9s ease,opacity .6s";
                cur.style.transform = HOME;
                cur.classList.remove("o-on");
              });
              at(t0 + 4300, () => cam({ x: 520, y: 220, w: 560 }));
              end(t0 + 6200);
            },
          });
        });
      },
    });
  }, [interactive, cue]);

  return (
    <div
      ref={rootRef}
      className={interactive ? `oppm m-interactive ${inter.variable}` : `oppm ${inter.variable}`}
      role={interactive ? "group" : "img"}
      aria-label={aria}
      dangerouslySetInnerHTML={{ __html: OPPORTUNITY_MARKUP }}
    />
  );
}
