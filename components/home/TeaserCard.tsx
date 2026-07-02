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
    <div className="rounded-soft border border-gold-container/30 bg-parchment/5 p-8">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <p className="mt-3 font-body text-ink/80">{description}</p>
      <a
        href={cta.href}
        className="mt-5 inline-block font-label text-sm uppercase tracking-wide text-gold transition-colors duration-organic-fast ease-organic hover:text-emerald"
      >
        {cta.label}
      </a>
    </div>
  );
}
