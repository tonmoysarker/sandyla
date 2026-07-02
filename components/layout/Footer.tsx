import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-gold-container/30 bg-obsidian-low px-6 py-12 text-center">
      <VineDivider />
      <p className="mx-auto max-w-xl font-display italic text-lg text-ink">
        &ldquo;{settings.footerQuote}&rdquo;
      </p>
      <div className="mt-10 grid gap-8 text-left font-label text-sm uppercase tracking-wide md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-gold">Navegação</h2>
          <ul className="space-y-2">
            {settings.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-gold">Redes Sociais</h2>
          <ul className="flex gap-4">
            {settings.socials.map((social) => (
              <li key={social.url}>
                <a href={social.url} className="hover:text-gold" aria-label={social.platform}>
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-10 font-label text-xs text-ink/60">
        &copy; {new Date().getFullYear()} {settings.siteTitle}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
