"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";

type NavItem = { label: string; href: string };

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ nav, siteTitle }: { nav: NavItem[]; siteTitle: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";

  return (
    <header className="stained-glass sticky top-0 z-50 border-b border-outline-variant/60">
      <div className="mx-auto flex max-w-content items-center justify-between px-flow-s py-flow-2xs md:px-flow-l">
        <a
          href="/"
          className="font-display text-fluid-md uppercase tracking-[0.25em] text-accent transition-opacity duration-organic-base ease-organic hover:opacity-80"
        >
          {siteTitle}
        </a>
        <nav className="hidden items-center gap-flow-m font-label text-fluid-xs uppercase tracking-[0.18em] md:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`link-underline transition-colors duration-organic-fast ease-organic ${
                  active ? "text-accent" : "text-ink/70 hover:text-accent"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => window.dispatchEvent(new CustomEvent("versos:open-search"))}
            className="rounded-full border border-transparent p-2 text-ink/70 transition-all duration-organic-base ease-organic hover:border-outline-variant hover:text-accent"
          >
            <SearchIcon />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="rounded-full border border-transparent p-2 text-ink/70 transition-all duration-organic-base ease-organic hover:border-outline-variant hover:text-accent md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <MobileNav nav={nav} open={open} />
    </header>
  );
}
