export function Pagination({
  currentPage,
  totalPages,
  baseHref,
}: {
  currentPage: number;
  totalPages: number;
  baseHref: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginação" className="mt-10 flex justify-center gap-3 font-label text-fluid-sm">
      {pages.map((page) => (
        <a
          key={page}
          href={`${baseHref}?page=${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`rounded-soft border px-3 py-1 transition-all duration-organic-base ease-organic ${
            page === currentPage
              ? "border-accent bg-accent text-on-accent"
              : "border-transparent text-ink/70 hover:border-outline-variant hover:text-accent"
          }`}
        >
          {page}
        </a>
      ))}
    </nav>
  );
}
