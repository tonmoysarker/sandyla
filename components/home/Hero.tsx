import Image from "next/image";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";
import { CornerFlourish } from "@/components/ui/ornaments/CornerFlourish";
import { FlourishIcon } from "@/components/ui/icons";

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
    <section
      data-testid="hero-section"
      className="relative mx-auto grid max-w-content gap-flow-xl px-flow-s py-flow-2xl md:grid-cols-2 md:items-center md:px-flow-l"
    >
      <div>
        <p className="flex items-center gap-flow-xs font-label text-fluid-xs uppercase tracking-[0.3em] text-ink/60">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          Poesia &amp; Criação
        </p>
        <h1 className="mt-flow-s font-display text-fluid-3xl uppercase leading-[1.05] text-ink [text-shadow:0_0_28px_rgb(var(--glow)/0.18)]">
          <span className="block">{heroTitleLine1}</span>
          <span className="block text-accent">{heroTitleLine2}</span>
        </h1>
        <p className="mt-flow-m max-w-md font-body text-fluid-md italic leading-relaxed text-ink/75">
          {heroSubtitle}
        </p>
        <div className="mt-flow-l flex flex-wrap gap-flow-s">
          <a href={heroPrimaryCta.href} className="btn btn-primary">
            {heroPrimaryCta.label}
            <FlourishIcon className="h-4 w-4" />
          </a>
          <a href={heroSecondaryCta.href} className="btn btn-ghost">
            {heroSecondaryCta.label}
          </a>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-sm">
        <CornerFlourish className="absolute -left-8 -top-8 opacity-40" />
        <ArchFrame>
          <Image
            src="/flower-window-v2.webp"
            alt="Ilustração de uma rosa em vitral dentro de um arco gótico"
            fill
            priority
            sizes="(min-width: 768px) 24rem, 90vw"
            className="object-cover"
          />
        </ArchFrame>
        <CornerFlourish className="absolute -bottom-8 -right-8 rotate-180 opacity-40" />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-40 md:flex"
      >
        <span className="font-label text-[10px] uppercase tracking-[0.4em] text-ink">Rolar</span>
        <span className="block h-10 w-px animate-[drift_1.6s_var(--ease-organic)_infinite_alternate] bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}
