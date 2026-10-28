// Moteur commun des motions de couverture (brief, section 4bis).
//
// Chaque motion est un canevas à taille fixe, mis à l'échelle (--s), qui joue une séquence
// en 3 étapes quand il entre dans l'écran, puis fond et boucle.
//
// Mode interactif (accueil) : la séquence s'arrête sur le geste clé de l'étape 3 et laisse
// le visiteur le faire (repère orange « À vous »). Sans clic au bout de quelques secondes,
// le curseur le fait lui-même. Sur la page d'étude de cas, la séquence joue d'une traite.

export type GateOptions = {
  target: HTMLElement; // élément du canevas sur lequel cliquer
  label: string; // texte du repère, ex. « À vous : validez le point »
  then: (byUser: boolean) => void; // suite de la séquence ; byUser = le visiteur a cliqué
};

export type MotionApi = {
  /** Planifie fn dans ms millisecondes (annulé si la motion repart ou se démonte). */
  at: (ms: number, fn: () => void) => void;
  /** Garde un intervalle pour qu'il soit annulé avec les timers. */
  track: (id: ReturnType<typeof setInterval>) => void;
  /** Étape 3 : attend le clic du visiteur en mode interactif, enchaîne directement sinon. */
  gate: (o: GateOptions) => void;
  /** Fin de séquence : fondu après holdMs, puis on rejoue si la motion est encore visible. */
  end: (holdMs: number) => void;
  /** Position (x, y) d'un élément dans le repère du canevas, utile pour déplacer le curseur. */
  pos: (el: Element, dx?: number, dy?: number) => [number, number];
  /** Mobile : déplace la caméra sur une zone du canevas (sans effet sur grand écran). */
  cam: (r: Rect, ms?: number) => void;
};

/** Zone du canevas en px du canevas ; la hauteur découle du format mobile. */
export type Rect = { x: number; y: number; w: number };

export type MotionScript = {
  width: number; // largeur du canevas en px (1200 ou 1440)
  canvas: HTMLElement; // élément mis à l'échelle
  outClass: string; // classe de fondu de sortie (a-out, v-out…)
  interactive: boolean;
  reset: () => void; // état initial
  finalState: () => void; // état final (prefers-reduced-motion)
  play: (api: MotionApi) => void; // planifie la séquence
  // Petit écran : format portrait et « caméra » qui suit l'action (zoom sur la zone utile),
  // au lieu de réduire tout le canevas. overlay : éléments sortis du canevas pour rester lisibles.
  mobile?: { aspect: number; start: Rect; end?: Rect; overlay?: string[] };
};

const AUTO_AFTER = 6000; // sans clic, le curseur prend la main au bout de 6 s
const FADE = 500;
const NARROW = 640; // en dessous de cette largeur de motion : format mobile (caméra)

export function runMotion(root: HTMLElement, s: MotionScript): () => void {
  const m = s.mobile;
  let scale = 1;
  let narrow = false;
  let shot: Rect | null = null;
  const apply = (r: Rect, ms: number) => {
    shot = r;
    if (!narrow) return;
    scale = root.clientWidth / r.w;
    s.canvas.style.transition = ms ? `opacity .45s, transform ${ms}ms cubic-bezier(.45,0,.2,1)` : "opacity .45s";
    s.canvas.style.transform = `translate(${-r.x * scale}px, ${-r.y * scale}px) scale(${scale})`;
    root.style.setProperty("--s", String(scale));
  };
  const fit = () => {
    const n = !!m && root.clientWidth < NARROW;
    if (n !== narrow) {
      narrow = n;
      root.classList.toggle("m-narrow", n);
      root.style.aspectRatio = n && m ? String(m.aspect) : "";
      m?.overlay?.forEach((q) => {
        const e = root.querySelector(q);
        if (e) (n ? root : s.canvas).appendChild(e);
      });
      if (!n) {
        s.canvas.style.transform = "";
        s.canvas.style.transition = "";
      }
    }
    if (narrow && m) apply(shot ?? m.start, 0);
    else {
      scale = root.clientWidth / s.width;
      root.style.setProperty("--s", String(scale));
    }
  };
  const ro = new ResizeObserver(fit);
  ro.observe(root);
  fit();
  const resetAll = () => {
    s.reset();
    if (m) apply(m.start, 0);
  };

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    s.finalState();
    if (m) apply(m.end ?? m.start, 0);
    return () => ro.disconnect();
  }

  let timers: ReturnType<typeof setTimeout>[] = [];
  let visible = false;
  let running = false;
  let disposed = false;
  let unGate: (() => void) | null = null;

  const clear = () => {
    timers.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timers = [];
    unGate?.();
  };
  const at = (ms: number, fn: () => void) => {
    timers.push(setTimeout(fn, ms));
  };

  const pos = (el: Element, dx = 0.6, dy = 0.55): [number, number] => {
    const r = el.getBoundingClientRect(), o = s.canvas.getBoundingClientRect(), k = o.width / s.width;
    return [(r.left - o.left) / k + (r.width / k) * dx, (r.top - o.top) / k + (r.height / k) * dy];
  };

  const gate = ({ target, label, then }: GateOptions) => {
    if (!s.interactive) return then(false);

    // Repère « À vous », hors du canevas pour rester lisible quelle que soit l'échelle.
    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "m-hint";
    hint.textContent = label;
    const rr = root.getBoundingClientRect(), tr = target.getBoundingClientRect();
    const x = tr.left - rr.left + tr.width / 2;
    const below = tr.bottom - rr.top + 52 < rr.height;
    hint.style.top = `${below ? tr.bottom - rr.top + 12 : tr.top - rr.top - 12}px`;
    hint.classList.add(below ? "m-below" : "m-above");
    root.appendChild(hint); // classes posées avant l'ajout : pas de glissement depuis la mauvaise position
    // Garde la bulle entière dans la motion, même sur petit écran.
    const half = hint.offsetWidth / 2 + 8;
    hint.style.left = `${Math.min(Math.max(x, half), rr.width - half)}px`;
    target.classList.add("m-target");
    requestAnimationFrame(() => hint.classList.add("m-on"));

    let done = false;
    const finish = (byUser: boolean) => {
      if (done) return;
      done = true;
      unGate?.();
      then(byUser);
    };
    const onClick = (e: Event) => {
      e.preventDefault();
      finish(true);
    };
    target.addEventListener("click", onClick);
    hint.addEventListener("click", onClick);
    const auto = setTimeout(() => finish(false), AUTO_AFTER);

    unGate = () => {
      clearTimeout(auto);
      target.removeEventListener("click", onClick);
      target.classList.remove("m-target");
      hint.remove();
      unGate = null;
    };
  };

  const play = () => {
    if (disposed) return;
    running = true;
    clear();
    resetAll();
    void s.canvas.offsetWidth;
    s.play(api);
  };

  const end = (holdMs: number) => {
    at(holdMs, () => root.classList.add(s.outClass));
    at(holdMs + FADE, () => {
      running = false;
      if (visible) play();
      else resetAll();
    });
  };

  const api: MotionApi = { at, track: (id) => timers.push(id), gate, end, pos, cam: (r, ms = 900) => apply(r, ms) };

  resetAll();
  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible && !running) play();
    },
    { threshold: 0.35 },
  );
  io.observe(root);

  return () => {
    disposed = true;
    clear();
    io.disconnect();
    ro.disconnect();
  };
}
