"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";

export function SearchOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-obsidian/80 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-soft border border-gold-container/40 bg-obsidian-low p-6">
        <SearchBar />
      </div>
    </div>
  );
}
