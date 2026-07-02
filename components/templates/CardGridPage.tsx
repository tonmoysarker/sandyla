"use client";

import { FilterChips } from "@/components/ui/FilterChips";
import { Pagination } from "@/components/ui/Pagination";

type FilterOption = { slug: string; label: string };

export function CardGridPage<T>({
  items,
  renderCard,
  filterOptions,
  activeFilter,
  onFilterChange,
  currentPage,
  totalPages,
  baseHref,
}: {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  filterOptions: FilterOption[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
  currentPage: number;
  totalPages: number;
  baseHref: string;
}) {
  return (
    <div className="px-6 py-12 md:px-16">
      <FilterChips options={filterOptions} activeSlug={activeFilter} onSelect={onFilterChange} />
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => renderCard(item, index))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={baseHref} />
    </div>
  );
}
