"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted && !isDark ? "Ativar tema escuro" : "Ativar tema claro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative rounded-full border border-transparent p-2 text-ink/70 transition-all duration-organic-base ease-organic hover:border-outline-variant hover:text-accent"
    >
      {/* SSR renders the sun (dark default); swap only after mount to avoid hydration mismatch */}
      <span className={`block transition-transform duration-organic-base ease-organic group-hover:rotate-[15deg] ${mounted && !isDark ? "hidden" : ""}`}>
        <SunIcon />
      </span>
      <span className={`block transition-transform duration-organic-base ease-organic group-hover:-rotate-[15deg] ${mounted && !isDark ? "" : "hidden"}`}>
        <MoonIcon />
      </span>
    </button>
  );
}
