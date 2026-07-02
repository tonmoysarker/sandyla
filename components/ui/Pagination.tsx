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
    <nav aria-label="Paginação" className="mt-10 flex justify-center gap-3 font-label text-sm">
      {pages.map((page) => (
        <a
          key={page}
          href={`${baseHref}?page=${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`rounded-soft px-3 py-1 transition-colors duration-organic-fast ease-organic ${
            page === currentPage ? "bg-gold text-obsidian" : "text-ink/70 hover:text-gold"
          }`}
        >
          {page}
        </a>
      ))}
    </nav>
  );
}
