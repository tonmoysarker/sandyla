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
    <div className="rounded-soft border border-outline-variant bg-surface-mid p-8">
      <h2 className="font-display text-fluid-lg text-ink">{title}</h2>
      <p className="mt-3 font-body text-ink/80">{description}</p>
      <a
        href={cta.href}
        className="mt-5 inline-block font-label text-fluid-sm uppercase tracking-wide text-accent transition-colors duration-organic-fast ease-organic hover:text-secondary"
      >
        {cta.label}
      </a>
    </div>
  );
}
