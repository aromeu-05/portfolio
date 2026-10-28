"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LINKEDIN_URL, projects } from "@/content/projects";
import type { Dict } from "@/content/i18n/fr";
import { locales, type Locale } from "@/lib/i18n";
import Icon from "@/components/Icon";

export default function Nav({ lang, t }: { lang: Locale; t: Dict["nav"] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // menu mobile
  const [ddOpen, setDdOpen] = useState(false); // menu Projets
  const burgerRef = useRef<HTMLButtonElement>(null);
  const ddBtnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const home = `/${lang}`;
  const caseHref = (slug: string) => `/${lang}/projets/${slug}`;
  // Même page dans l'autre langue
  const switchTo = (l: Locale) => pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${l}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Échap ferme les menus ; le menu mobile se ferme en repassant en format ordinateur.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) {
        setOpen(false);
        burgerRef.current?.focus();
      }
      if (ddOpen) {
        setDdOpen(false);
        ddBtnRef.current?.focus();
      }
    };
    const closeDd = () => setDdOpen(false);
    const mq = matchMedia("(min-width: 861px)");
    const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", closeDd);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", closeDd);
      mq.removeEventListener("change", onMq);
    };
  }, [open, ddOpen]);

  const hover = () => matchMedia("(hover: hover)").matches;

  const langSwitch = (
    <div className="lang" role="group" aria-label={t.language}>
      {locales.map((l) => (
        <Link key={l} href={switchTo(l)} aria-current={l === lang} hrefLang={l}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="wrap nav-bar">
        <Link href={home} className="brand">
          <span className="avatar" aria-hidden="true">
            <Image src="/images/avatar.jpg" alt="" width={42} height={42} priority />
          </span>
          <span className="id">
            Alexie Romeu<small>{t.role}</small>
          </span>
        </Link>

        <div className="links">
          <div
            className={`dd${ddOpen ? " open" : ""}`}
            onMouseEnter={() => hover() && setDdOpen(true)}
            onMouseLeave={() => hover() && setDdOpen(false)}
          >
            <button
              ref={ddBtnRef}
              className="dd-btn"
              aria-expanded={ddOpen}
              aria-controls="ddMenu"
              onClick={(e) => {
                e.stopPropagation();
                setDdOpen((o) => !o);
              }}
            >
              {t.projects}
              <span aria-hidden="true">
                <Icon name="chevron-down" size={14} />
              </span>
            </button>
            <div className="dd-menu" id="ddMenu" role="menu">
              {projects.map((p) => (
                <Link key={p.slug} role="menuitem" href={caseHref(p.slug)} onClick={() => setDdOpen(false)}>
                  {p.name}
                  <span>{p.num}</span>
                </Link>
              ))}
              <Link role="menuitem" href={`${home}#galerie`} className="dd-more" onClick={() => setDdOpen(false)}>
                {t.gallery}
                <span>
                  <Icon name="arrow-right" />
                </span>
              </Link>
            </div>
          </div>
          <Link href={`${home}#approche`}>{t.approach}</Link>
          <Link href={`${home}#about`}>{t.about}</Link>
          {langSwitch}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="cv">
            LinkedIn <Icon name="arrow-up-right" />
          </a>
        </div>

        <button
          ref={burgerRef}
          className="burger"
          aria-expanded={open}
          aria-controls="mmenu"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        className="mmenu"
        id="mmenu"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <div className="wrap">
          <span className="mono mm-label">{t.projects}</span>
          {projects.map((p) => (
            <Link key={p.slug} href={caseHref(p.slug)}>
              {p.name}
              <span className="mono">{p.num}</span>
            </Link>
          ))}
          <Link href={`${home}#galerie`} className="mm-sub">
            {t.gallerySub}
            <span>
              <Icon name="arrow-right" />
            </span>
          </Link>
          <span className="mono mm-label">{t.navigation}</span>
          <Link href={`${home}#approche`}>{t.approach}</Link>
          <Link href={`${home}#about`}>{t.about}</Link>
          <div className="mm-foot">
            {langSwitch}
            <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="btn">
              LinkedIn
              <span>
                <Icon name="arrow-up-right" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
