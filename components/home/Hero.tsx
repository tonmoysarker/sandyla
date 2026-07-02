import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";
import { StainedGlassRose } from "@/components/ui/ornaments/StainedGlassRose";

type Cta = { label: string; href: string };

export function Hero({
  heroTitleLine1,
  heroTitleLine2,
  heroSubtitle,
  heroPrimaryCta,
  heroSecondaryCta,
}: {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroPrimaryCta: Cta;
  heroSecondaryCta: Cta;
}) {
  return (
    <section data-testid="hero-section" className="grid gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-16">
      <div>
        <h1 className="font-display text-5xl leading-tight text-ink">
          <span className="block">{heroTitleLine1}</span>
          <span className="block text-emerald">{heroTitleLine2}</span>
        </h1>
        <p className="mt-6 max-w-md font-body text-lg text-ink/80">{heroSubtitle}</p>
        <div className="mt-8 flex gap-4">
          <a
            href={heroPrimaryCta.href}
            className="rounded-soft border border-gold bg-gold px-6 py-3 font-label text-sm uppercase tracking-wide text-obsidian transition-all duration-organic-base ease-organic hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(242,202,80,0.35)]"
          >
            {heroPrimaryCta.label}
          </a>
          <a
            href={heroSecondaryCta.href}
            className="rounded-soft border border-ink/40 px-6 py-3 font-label text-sm uppercase tracking-wide text-ink transition-colors duration-organic-base ease-organic hover:border-gold hover:text-gold"
          >
            {heroSecondaryCta.label}
          </a>
        </div>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <ArchFrame>
          <StainedGlassRose />
        </ArchFrame>
      </div>
    </section>
  );
}
