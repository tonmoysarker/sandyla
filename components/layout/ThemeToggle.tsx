"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Alternar tema"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-soft p-2 text-ink/70 transition-colors duration-organic-fast ease-organic hover:text-accent"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
