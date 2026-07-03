"use client";

import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import type { SearchEntry } from "@/lib/search-index";

export function SearchBar() {
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then(setIndex);
  }, []);

  const fuse = new Fuse(index, { keys: ["title", "excerpt", "tags"], threshold: 0.35 });
  const results = query.trim() ? fuse.search(query).map((result) => result.item) : [];

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar poemas e projetos..."
        aria-label="Buscar poemas e projetos"
        className="w-full rounded-soft border border-ink/30 bg-surface-low px-4 py-2 font-body text-ink placeholder:text-ink/40 focus:border-accent focus:outline-none"
      />
      {query.trim() ? (
        <ul className="mt-3 space-y-2">
          {results.length === 0 ? (
            <li className="font-body text-fluid-sm text-ink/60">Nenhum resultado encontrado.</li>
          ) : (
            results.map((result) => (
              <li key={result.url}>
                <a href={result.url} className="font-body text-ink hover:text-accent">
                  {result.title}
                </a>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
