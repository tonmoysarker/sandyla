export function DetailPage({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-fluid-2xl text-ink">{title}</h1>
      <p className="mt-2 font-label text-fluid-xs uppercase tracking-wide text-ink/60">{meta}</p>
      <div className="prose prose-invert mt-8 max-w-none font-body text-fluid-md leading-relaxed text-ink/90">
        {children}
      </div>
    </article>
  );
}
