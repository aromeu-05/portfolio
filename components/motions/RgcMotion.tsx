"use client";

import type { MotionText } from "./labels";
import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";
import { RGC_MARKUP } from "./rgc-markup";
import { runMotion } from "./engine";
import "./rgc-motion.css";
import "./motion-shared.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter" });


// Icônes du produit (tracés SVG repris tels quels).
const P: Record<string, string> = {flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',layout:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',till:'<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9V6h10v3M10 14h4"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',cap:'<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>',trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c1.9.7 3.1 2.6 3.5 5.5"/>',box:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/>',doc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',print:'<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>',plus:'<path d="M12 5v14M5 12h14"/>',alert:'<path d="M12 7v6M12 16.5v.5"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',table:'<path d="M3 9h18M6 9v10M18 9v10M8 5h8"/>',cart:'<path d="M3 15V7h10l3 5h4v3"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 11h11"/>',trolley:'<path d="M6 3l4 13h8M8 9h9l-1 4"/><circle cx="10" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>',bag:'<rect x="7" y="7" width="10" height="14" rx="3"/><path d="M10 7V4h4v3M10 12h4"/>',in:'<path d="M10 17l5-5-5-5M15 12H3M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',chevL:'<path d="M15 5l-7 7 7 7"/>',chevD:'<path d="M6 9l6 6 6-6"/>',warn:'<path d="M12 3l10 18H2zM12 10v4M12 17.5v.5"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'};
const ic = (n: string) => `<svg class="q-i" viewBox="0 0 24 24">${P[n] || ""}</svg>`;

type Row = { b?: string; n?: string; h?: number; w?: number; g?: number; x?: string; d?: number; free?: number; id?: string };
type Eq = [number, number];
type Slot = { t: string; y: number; h: number; ty?: string; e?: [Eq, Eq, Eq]; id?: string; full?: number; rows?: Row[]; blk?: string; bs?: string };
type Col = { n: string; k: string; c: string; bg: string; x: number; w: number; cad: string; f: string; r: string[]; nine?: number; slots: Slot[] };

// Construit le planning, le calendrier et les icônes (une seule fois par racine).
function build(root: HTMLElement) {
  if (root.dataset.built) return;
  root.dataset.built = "1";
  const $ = (s: string) => root.querySelector(s) as HTMLElement;
  const B: Record<string, string> = {MBR:'#2e6f4e',INV:'#c48d2e',LIC:'#2663eb','-26':'#bf185d',TO:'#7c3aec',AS:'#b85b1a','NON-LIC':'#414651'};
  const row = (r: Row) =>
    r.free
      ? `<div class="q-p q-fr">${ic("plus")}Place libre</div>`
      : `<div class="q-p${r.g ? " q-g" : ""}"><span class="q-bg" style="background:${B[r.b ?? ""]}">${r.b}</span><span class="q-nm">${r.n}</span><span class="q-hc">${r.h}</span><span class="q-ics">${r.w ? `<span class="q-w">${ic("warn")}</span>` : ""}${r.x ? `<span class="q-x">${ic(r.x)}</span>` : ""}<span class="q-eu${r.d ? " q-due" : ""}">€</span><span class="q-ar${r.g ? "" : " q-no"}">${ic("in")}</span></span></div>`;
  const eq = (a: Eq, b: Eq, c: Eq) =>
    `<div class="q-eq"><div>${ic("cart")}${a[0]}<u>|</u>${a[1]}</div><div>${ic("trolley")}${b[0]}<u>|</u>${b[1]}</div><div>${ic("bag")}${c[0]}<u>|</u>${c[1]}</div></div>`;
  const F: Row = { free: 1 };
  const COLS: Col[] = [
   {n:'La Mer',k:'M',c:'var(--mer)',bg:'var(--mer-bg)',x:50,w:323,cad:'1 départ / 10 min',f:'1er 07h30',r:['18','1-9','10-18','18 inversé'],slots:[
    {t:'07h30',y:0,h:150,ty:'18 TROUS',e:[[24,28],[8,9],[3,3]],rows:[{b:'MBR',n:'Charlotte Dup…',h:12,w:1,g:1},{b:'MBR',n:'Marc Lefèvre',h:18,g:1},{b:'INV',n:'Sophie Bernard',h:24,g:1},{b:'INV',n:'Julien Caron',h:31,g:1}]},
    {t:'07h40',y:150,h:150,ty:'18 TROUS',e:[[23,28],[8,9],[3,3]],id:'s740',rows:[{b:'-26',n:'Maxime Cheva…',h:12,x:'cart'},{b:'LIC',n:'Jean-Pierre Du…',h:14,x:'bag',d:1},{b:'LIC',n:'Bernard Lelouch',h:9},{free:1,id:'slot4'}]},
    {t:'07h50',y:300,h:150,ty:'9 TROUS · 1-9',e:[[23,28],[8,9],[3,3]],rows:[{b:'LIC',n:'Hugo Fournier',h:12,x:'trolley',g:1},F,F,F]},
    {t:'08h00',y:450,h:150,ty:'18 TROUS',e:[[22,28],[7,9],[3,3]],full:1,rows:[F,F,F,F]}]},
   {n:'La Forêt',k:'F',c:'var(--for)',bg:'var(--for-bg)',x:379,w:316,cad:'1 départ / 9 min',f:'1er 07h35',r:['18','1-9','10-18','18 inversé'],slots:[
    {t:'07h35',y:76,h:135,ty:'18 TROUS',e:[[23,28],[8,9],[3,3]],rows:[F,F,F,F]},
    {t:'07h44',y:211,h:135,blk:'Intervention parcours',bs:'Entretien greens'},
    {t:'07h53',y:346,h:135,blk:'Intervention parcours',bs:'Entretien greens'},
    {t:'08h02',y:481,h:135,ty:'18 TROUS',e:[[22,28],[7,9],[3,3]],full:1,rows:[{b:'TO',n:'Jean-Pierre Ro…',h:12,x:'trolley',g:1},{b:'TO',n:'Hugo Fournier',h:12,x:'cart',g:1},F,F]}]},
   {n:'Le Manoir',k:'Ma',c:'var(--man)',bg:'var(--man-bg)',x:701,w:259,cad:'1 départ / 9 min',f:'1er 07h30',r:['1-9'],nine:1,slots:[
    {t:'07h30',y:0,h:135,ty:'9 TROUS',e:[[26,29],[9,9],[3,3]],rows:[F,F,F,F]},
    {t:'07h39',y:135,h:135,ty:'9 TROUS',e:[[25,28],[8,9],[3,3]],rows:[{b:'LIC',n:'Jean-Pierre Robin',h:12},{b:'MBR',n:'Hugo F…',h:12,w:1},{b:'NON-LIC',n:'Jean-Pierre Ro…',h:12},F]},
    {t:'07h48',y:270,h:135,ty:'9 TROUS',e:[[24,28],[8,9],[3,3]],rows:[F,F,F,F]},
    {t:'07h57',y:405,h:135,ty:'9 TROUS',e:[[23,28],[8,9],[3,3]],rows:[{b:'AS',n:'Jean-Pierre Robin',h:12},{b:'AS',n:'Hugo Fourn…',h:12,w:1},{b:'AS',n:'Jean-Pierre Robin',h:12},F]}]}];
  let h=`<div class="q-rail">${['7h','8h','9h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h'].map((t,i)=>`<span style="top:${i?58+(i-1)*46:0}px">${t}</span>`).join('')}</div>`;
  COLS.forEach((c)=>{
    h+=`<div class="q-col" style="left:${c.x}px;width:${c.w}px;background:${c.bg};border-top-color:${c.c}"><div class="q-ch"><b><i style="background:${c.c}">${c.k}</i>${c.n}<em>${c.nine?'9T':'18T'}</em></b><p><strong style="color:${c.c}">${c.cad}</strong>&nbsp; ${c.f}</p><div class="q-rad">${c.r.map((r,i)=>`<span><i${i?'':' class="q-on"'}></i>${r}</span>`).join('')}</div></div><div style="position:absolute;left:0;right:0;top:83px;bottom:0">`;
    c.slots.forEach((s)=>{
      const tm=`<span class="q-tm" style="${s.full?`background:${c.c};color:#fff;border-color:${c.c}`:`color:${c.c};border-color:color-mix(in srgb,${c.c} 45%,white)`}">${s.t}</span>`;
      h+=`<div class="q-slot${s.h<150?' q-tight':''}"${s.id?` data-s="${s.id}"`:''} style="top:${s.y}px;height:${s.h}px"><div class="q-sl">${tm}${s.e?eq(...s.e):''}</div>`;
      if(s.blk) h+=`<div class="q-rw"><small>BLOQUÉ</small></div><div class="q-blk"><div>${s.blk}<small>${s.bs}</small></div></div>`;
      else h+=`<div class="q-rw"><small>${s.ty}</small>${(s.rows ?? []).map((r)=>r.id?`<div data-r="${r.id}">${row(r)}</div>`:row(r)).join('')}</div>`;
      h+='</div>';
    });
    h+='</div></div>';
  });
  $('.q-tb').innerHTML=h;
  let d = '';['Lu','Ma','Me','Je','Ve','Sa','Di'].forEach(x=>d+=`<small>${x}</small>`);
  for(let i=1;i<=35;i++){const n=i>30?i-30:i;d+=`<span class="${i>30?'q-mu':''}${i===18?' q-on':''}">${n}</span>`}
  $('.q-days').innerHTML=d;
  root.querySelectorAll<HTMLElement>('i[data-ic]').forEach((e)=>{const st=e.getAttribute('style'),n=e.dataset.ic ?? '';e.outerHTML=st?ic(n).replace('<svg ',`<svg style="${st}" `):ic(n)});
}

// Motion Resonance Golf (Rosie) : 1. l'accueil ouvre la partie de 07h40 ; 2. ajoute un proche ;
// 3. règle le paiement (le visiteur clique sur « Enregistrer le paiement » en mode interactif).
export default function RgcMotion({ interactive = false, aria, cue }: MotionText & { interactive?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    build(root);
    const $ = (s: string) => root.querySelector(s) as HTMLElement;
    const $$ = (s: string) => [...root.querySelectorAll<HTMLElement>(s)];
    const K = (k: string) => $(`[data-k="${k}"]`);

    const cv = $(".q-cv");
    const cur = $(".q-cur");
    const HOME = "translate(1300px,860px)";
    const slot4 = $('[data-r="slot4"]');
    const freeHTML = slot4.innerHTML;
    const s740 = $('[data-s="s740"]');
    const btnSave = K("save");
    const sophieRow = `<div class="q-p q-new"><span class="q-bg" style="background:#2663eb">LIC</span><span class="q-nm">Sophie Chevalier</span><span class="q-hc">14</span><span class="q-ics"><span class="q-eu">€</span><span class="q-ar q-no">${ic("in")}</span></span></div>`;

    const view = (v: string) =>
      $$(".q-vw").forEach((e) => {
        const on = e.dataset.v === v;
        e.classList.toggle("q-hid", !on && e.dataset.v === "add");
        e.classList.toggle("q-left", !on && e.dataset.v === "flight");
      });

    const reset = () => {
      root.classList.remove("q-out");
      [".q-ov", ".q-dr", ".q-pay", ".q-toast", ".q-step", "[data-new]"].forEach((s) => $(s).classList.remove("q-on"));
      $$(".q-pr").forEach((e) => e.classList.remove("q-on", "q-pk"));
      view("flight");
      $$(".q-hot").forEach((e) => e.classList.remove("q-hot"));
      slot4.innerHTML = freeHTML;
      K("sel").textContent = "Sélectionner";
      K("addbtn").classList.add("q-dis");
      K("addbtn").textContent = "Ajouter à la partie";
      K("tot").textContent = "242 €";
      K("due").innerHTML = "<b>1</b> joueur à régler";
      K("scsel").textContent = "À payer (lien ou caisse)";
      K("scsel").classList.remove("q-hl");
      $$("[data-rd] span").forEach((e, i) => e.classList.toggle("q-on", i === 0));
      K("jpm").textContent = "via le lien";
      K("scm").textContent = "Green-fee";
      K("scr").textContent = "95 €";
      K("scp").textContent = "95 €";
      K("car").textContent = "3/10";
      K("lien").textContent = "190 €";
      K("cai").textContent = "0 €";
      K("aenc").textContent = "190 €";
      $$(".q-chg").forEach((e) => e.classList.remove("q-chg"));
      K("enc").textContent = "10";
      K("j").textContent = "379";
      K("o").textContent = "43 %";
      K("step").innerHTML = "<b>01</b> · Ouvrir la partie de 07h40";
      cur.classList.remove("q-on");
      cur.style.transition = "none";
      cur.style.transform = HOME;
    };

    const finalState = () => {
      reset();
      slot4.innerHTML = sophieRow;
      K("j").textContent = "380";
      K("o").textContent = "44 %";
      K("step").innerHTML = "<b>03</b> · Régler : carnet + caisse";
      $(".q-step").classList.add("q-on");
    };

    return runMotion(root, {
      width: 1440,
      // Mobile : la caméra suit le parcours (créneau, partie, proches, paiement, retour au planning).
      mobile: { aspect: 4 / 5, start: { x: 96, y: 150, w: 470 }, overlay: [".q-step", ".q-toast"] },
      canvas: cv,
      outClass: "q-out",
      interactive,
      reset,
      finalState,
      play: ({ at, gate, end, pos, cam }) => {
        const move = (el: Element, dur = 800, dx = 0.5, dy = 0.55) => {
          const [x, y] = pos(el, dx, dy);
          cur.classList.add("q-on");
          cur.style.transition = `transform ${dur}ms cubic-bezier(.45,0,.2,1),opacity .3s`;
          cur.style.transform = `translate(${x}px,${y}px)`;
        };
        const click = (el: HTMLElement | null, cls = "q-press") => {
          el?.classList.add(cls);
          const t = cur.style.transform;
          cur.style.transition = "transform .12s";
          cur.style.transform = t + " scale(.85)";
          at(170, () => {
            el?.classList.remove(cls);
            cur.style.transform = t;
          });
        };
        const count = (el: HTMLElement, a: number, b: number, dur: number, f: (v: number) => string) => {
          const n = Math.max(1, Math.round(dur / 40));
          for (let i = 1; i <= n; i++) at(i * 40, () => (el.textContent = f(Math.round(a + ((b - a) * i) / n))));
          at(n * 40, () => {
            el.classList.remove("q-bump");
            void el.offsetWidth;
            el.classList.add("q-bump");
          });
        };
        const step = (n: number, txt: string) => {
          const el = K("step");
          el.style.opacity = "0";
          at(230, () => {
            el.innerHTML = `<b>0${n}</b> · ${txt}`;
            el.style.opacity = "1";
          });
        };
        const toast = (t: string) => {
          K("toast").textContent = t;
          $(".q-toast").classList.add("q-on");
          at(2200, () => $(".q-toast").classList.remove("q-on"));
        };
        const eur = (v: number) => v + " €";

        at(400, () => $(".q-step").classList.add("q-on"));

        // Caméra mobile
        at(2100, () => cam({ x: 745, y: 90, w: 600 }));
        at(3950, () => cam({ x: 745, y: 140, w: 600 }));
        at(6950, () => cam({ x: 745, y: 90, w: 600 }));
        at(9150, () => cam({ x: 100, y: 150, w: 620 }));
        at(10650, () => cam({ x: 1050, y: 130, w: 390 }));
        at(11250, () => cam({ x: 100, y: 180, w: 620 }));
        at(11750, () => cam({ x: 980, y: 380, w: 460 }, 400));

        // 1 · ouvrir la partie
        at(900, () => move(s740.querySelector(".q-p")!, 900, 0.45, 0.5));
        at(1800, () => s740.classList.add("q-hot"));
        at(2000, () => {
          click(null);
          $(".q-ov").classList.add("q-on");
          $(".q-dr").classList.add("q-on");
        });

        // 2 · ajouter un proche
        at(2900, () => move($(".q-addc"), 800, 0.25, 0.5));
        at(3700, () => {
          click($(".q-addc"));
          step(2, "Ajouter un proche");
        });
        at(3900, () => view("add"));
        $$(".q-pr").forEach((e, i) => at(4200 + i * 90, () => e.classList.add("q-on")));
        at(4800, () => move($("[data-pick] .q-sel"), 800));
        at(5600, () => {
          click(null);
          $("[data-pick]").classList.add("q-pk");
          K("sel").textContent = "Sélectionné";
          K("addbtn").classList.remove("q-dis");
          K("addbtn").textContent = "Ajouter à la partie (1)";
        });
        at(6000, () => move(K("addbtn"), 700));
        at(6700, () => click(K("addbtn")));
        at(6900, () => view("flight"));
        at(7250, () => {
          $("[data-new]").classList.add("q-on");
          count(K("tot"), 242, 337, 400, eur);
          K("due").innerHTML = "<b>2</b> joueurs à régler";
          toast("1 joueur ajouté à la partie");
        });

        // 3 · paiement : carnet du partenaire, reste en caisse
        at(8100, () => move($(".q-psum .q-gob"), 800));
        at(8900, () => {
          click($(".q-psum .q-gob"));
          step(3, "Régler : carnet + caisse");
        });
        at(9100, () => $(".q-pay").classList.add("q-on"));
        at(9500, () => move(K("scsel"), 850, 0.4));
        at(10350, () => {
          click(null);
          const s = K("scsel");
          s.classList.add("q-hl");
          s.textContent = "Carnet de Maxime Chevalier · 1 green-fee";
          K("scp").textContent = "0 €";
          K("scm").textContent = "Carnet de Maxime";
          K("scr").textContent = "réglé";
          K("car").textContent = "4/10";
          ["scr", "car"].forEach((k) => K(k).classList.add("q-chg"));
          count(K("lien"), 190, 95, 350, eur);
          count(K("aenc"), 190, 95, 350, eur);
        });
        at(10900, () => move($$("[data-rd] span")[1], 800));
        at(11700, () => {
          click(null);
          $$("[data-rd] span").forEach((e, i) => e.classList.toggle("q-on", i === 1));
          K("jpm").textContent = "en caisse";
          count(K("lien"), 95, 0, 300, eur);
          count(K("cai"), 0, 95, 300, eur);
          ["lien", "cai"].forEach((k) => K(k).classList.add("q-chg"));
        });

        // Geste clé : enregistrer le paiement
        at(12200, () =>
          gate({
            target: btnSave,
            label: cue,
            then: (byUser) => {
              // Sans clic du visiteur, le curseur vient appuyer sur « Enregistrer le paiement ».
              const t0 = byUser ? 0 : 800;
              if (byUser) {
                cur.style.transition = "transform .9s ease,opacity .6s";
                cur.style.transform = HOME;
                cur.classList.remove("q-on");
                btnSave.classList.add("q-press");
                at(170, () => btnSave.classList.remove("q-press"));
              } else {
                move(btnSave, 800);
                at(t0, () => click(btnSave));
              }
              at(t0 + 200, () => {
                cam({ x: 96, y: 150, w: 470 });
                $(".q-pay").classList.remove("q-on");
                $(".q-dr").classList.remove("q-on");
                $(".q-ov").classList.remove("q-on");
                s740.classList.remove("q-hot");
              });
              at(t0 + 650, () => {
                slot4.innerHTML = sophieRow;
                toast("Paiement enregistré · 95 € à encaisser en caisse");
                count(K("j"), 379, 380, 300, (v) => String(v));
                count(K("o"), 43, 44, 300, (v) => v + " %");
                cur.style.transition = "transform .9s ease,opacity .6s";
                cur.style.transform = HOME;
                cur.classList.remove("q-on");
              });
              end(t0 + 3200);
            },
          }),
        );
      },
    });
  }, [interactive, cue]);

  return (
    <div
      ref={rootRef}
      className={interactive ? `rgcm m-interactive ${inter.variable}` : `rgcm ${inter.variable}`}
      role={interactive ? "group" : "img"}
      aria-label={aria}
      dangerouslySetInnerHTML={{ __html: RGC_MARKUP }}
    />
  );
}
