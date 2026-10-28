"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Image d'étude de cas : un clic l'agrandit en plein écran, un clic ou Échap la ferme.
export default function Figure({
  src,
  caption,
  alt,
  width = 1600,
  height = 1022,
  maxWidth,
}: {
  src: string;
  caption: string;
  alt?: string;
  width?: number;
  height?: number;
  maxWidth?: number; // largeur d'affichage max en px (petites images, écrans mobiles) : l'image est centrée
}) {
  const [open, setOpen] = useState(false);
  const zoom = usePathname().startsWith("/en") ? "Enlarge" : "Agrandir";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <figure className={maxWidth ? "fig fig-narrow" : "fig"} style={maxWidth ? { maxWidth } : undefined}>
      <button type="button" className="frame-img" onClick={() => setOpen(true)} aria-label={`${zoom}: ${caption}`}>
        <Image src={src} alt={alt ?? caption} width={width} height={height} sizes={maxWidth ? `${maxWidth}px` : "(max-width: 960px) 100vw, 900px"} />
      </button>
      <figcaption>{caption}</figcaption>
      {open && (
        <div className="lightbox" role="dialog" aria-label={caption} onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt ?? caption} />
        </div>
      )}
    </figure>
  );
}
