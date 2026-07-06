import Link from "next/link";

export function TeaserCard({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="group rounded-soft border border-outline-variant bg-surface-mid p-flow-l transition-all duration-organic-base ease-organic hover:-translate-y-1 hover:border-accent/60 hover:glow-soft">
      <h2 className="font-display text-fluid-lg uppercase tracking-[0.1em] text-accent">{title}</h2>
      <div className="mt-flow-2xs h-px w-8 bg-accent/40 transition-all duration-organic-slow ease-organic group-hover:w-16" aria-hidden="true" />
      <p className="mt-flow-s font-body text-ink/80">{description}</p>
      <Link href={cta.href} className="btn btn-ghost mt-flow-m">
        {cta.label}
      </Link>
    </div>
  );
}
