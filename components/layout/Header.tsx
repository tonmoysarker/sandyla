"use client";

import { useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

type NavItem = { label: string; href: string };

export function Header({ nav, siteTitle }: { nav: NavItem[]; siteTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gold-container/30 bg-obsidian/90 px-6 py-4 backdrop-blur">
      <a href="/" className="font-display text-xl tracking-widest text-gold">
        {siteTitle}
      </a>
      <nav className="hidden gap-6 font-label text-sm uppercase tracking-wide md:flex">
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="transition-colors duration-organic-fast ease-organic hover:text-gold">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          aria-label="Abrir menu"
          aria-expanded={open}
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>
      <MobileNav nav={nav} open={open} />
    </header>
  );
}
