"use client";

type NavItem = { label: string; href: string };

export function MobileNav({ nav, open }: { nav: NavItem[]; open: boolean }) {
  return (
    <nav
      data-testid="mobile-nav"
      data-open={open}
      aria-hidden={!open}
      className={`fixed inset-x-0 top-16 z-40 flex flex-col gap-4 bg-surface-low p-6 transition-all duration-organic-base ease-organic md:hidden ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      {nav.map((item) => (
        <a key={item.href} href={item.href} className="font-label uppercase tracking-wide text-ink">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
