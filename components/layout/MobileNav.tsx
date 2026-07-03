"use client";

type NavItem = { label: string; href: string };

export function MobileNav({ nav, open }: { nav: NavItem[]; open: boolean }) {
  return (
    <nav
      data-testid="mobile-nav"
      data-open={open}
      aria-hidden={!open}
      className={`stained-glass fixed inset-x-0 top-16 z-40 flex flex-col border-b border-outline-variant/60 px-flow-s py-flow-xs transition-all duration-organic-base ease-organic md:hidden ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      {nav.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
          className={`border-b border-outline-variant/30 py-flow-2xs font-label text-fluid-sm uppercase tracking-[0.18em] text-ink transition-all duration-organic-base ease-organic last:border-b-0 hover:pl-2 hover:text-accent ${
            open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
