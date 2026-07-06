import Link from "next/link";
import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import { FlourishIcon, HeartIcon, InstagramIcon, PinterestIcon } from "@/components/ui/icons";
import type { SiteSettings } from "@/lib/types";

function SocialIcon({ platform }: { platform: string }) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <InstagramIcon className="h-4 w-4" />;
    case "pinterest":
      return <PinterestIcon className="h-4 w-4" />;
    default:
      return <FlourishIcon className="h-4 w-4" />;
  }
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-flow-2xl border-t border-outline-variant/60 bg-surface-low">
      <div className="mx-auto max-w-content px-flow-s pb-flow-l pt-flow-xl md:px-flow-l">
        <VineDivider />

        <div className="mt-flow-l grid gap-flow-l text-center sm:grid-cols-2 sm:text-left lg:grid-cols-3">
          <div>
            <h2 className="font-display text-fluid-sm uppercase tracking-[0.2em] text-accent">
              {settings.siteTitle}
            </h2>
            <p className="mt-flow-xs font-body italic text-ink/70">{settings.tagline}</p>
          </div>
          <nav aria-label="Rodapé">
            <h2 className="font-display text-fluid-sm uppercase tracking-[0.2em] text-accent">
              Navegação
            </h2>
            <ul className="mt-flow-xs grid grid-cols-2 gap-x-flow-m gap-y-flow-2xs font-label text-fluid-xs uppercase tracking-[0.15em]">
              {settings.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink/70 transition-colors duration-organic-fast ease-organic hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-display text-fluid-sm uppercase tracking-[0.2em] text-accent">
              Redes Sociais
            </h2>
            <ul className="mt-flow-xs flex justify-center gap-flow-xs sm:justify-start">
              {settings.socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    aria-label={social.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-ink/70 transition-all duration-organic-base ease-organic hover:border-accent hover:text-accent hover:glow-accent"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-flow-xl flex flex-col items-center gap-flow-xs border-t border-outline-variant/40 pt-flow-m text-center md:flex-row md:justify-between md:text-left">
          <p className="font-label text-fluid-xs uppercase tracking-[0.15em] text-ink/50">
            &copy; {new Date().getFullYear()} {settings.siteTitle}. Todos os direitos reservados.
          </p>
          <FlourishIcon className="hidden h-6 w-6 text-accent/40 md:block" />
          <p className="flex items-center gap-1.5 font-label text-fluid-xs uppercase tracking-[0.15em] text-ink/50">
            Feito com <HeartIcon className="h-3.5 w-3.5 text-accent/70" /> e poesia
          </p>
        </div>
      </div>
    </footer>
  );
}
