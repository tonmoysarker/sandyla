# Versos Poetry Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static Next.js poetry blog/portfolio ("Versos") specified in `docs/superpowers/specs/2026-07-03-poetry-portfolio-design.md`, matching the owner's reference mockup rather than Google Stitch's generated screens.

**Architecture:** Next.js 14 App Router + TypeScript, Tailwind CSS, MDX content compiled at build time via `gray-matter` + `next-mdx-remote/rsc`, zero database/API routes. All content lives under `/content` and is read only through `/lib/content.ts`. Client JS is limited to a handful of small islands (theme toggle, mobile nav, search overlay, filter chips, scroll-reveal, Giscus embed).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, `gray-matter`, `next-mdx-remote`, `zod` (front-matter validation), `fuse.js` (search), `next-themes` (light/dark), `@giscus/react` (comments), Vitest + React Testing Library (unit/component tests).

## Global Constraints

- Content and code are fully separated: no page/component reads `/content` directly except through `/lib/content.ts`.
- No database, no custom API routes, no server outside what Next.js/Vercel provide automatically for SSG + image optimization.
- Site language is Portuguese only — all UI copy, not just poem content, is in Portuguese.
- **Design fidelity target is the owner's reference image (`file_00000000da9071f58c4221c7de09f80c.png`, "VERSOS"), not the Stitch-generated screens.** Stitch's output drifted: English branding ("Aethelgard"), generic dark-fantasy stock photography, single-column hero, no stained-glass/vine motif, flat card-grid monotony. Every visual task below calls out the specific correction against that drift. Reused from Stitch: only the design tokens (colors, type scale, spacing, motion feel) from its "Stained Verse Design System," because those independently matched the reference.
- Design tokens (from spec §8 and the Stitch design-md): colors `primary #f2ca50` (gold), `primary-container #d4af37`, `secondary #95d3ba` (emerald), `background #131313` (obsidian), `on-surface #e5e2e1`; fonts Playfair Display (display/headline), EB Garamond (body), Hanken Grotesk (labels/UI); motion `duration-fast 150ms`, `duration-base 250ms`, `duration-slow 350ms`, `ease-organic cubic-bezier(0.4, 0, 0.2, 1)`.
- `prefers-reduced-motion: reduce` disables all transform/opacity transitions site-wide via one root-level rule — never bypass this per-component.
- Every front-matter file is validated against a `zod` schema at build time — a malformed field must fail the build loudly, never render silently broken.
- Pagination is numbered, not infinite scroll. Search and filtering are entirely client-side against a static index — no server round-trip.

---

## File Structure

```
/app
  layout.tsx                        Root layout: fonts, ThemeProvider, Header, Footer
  page.tsx                          Home
  globals.css                       Tailwind layers + design tokens as CSS custom properties
  poemas/page.tsx                   Poems archive
  poemas/[slug]/page.tsx            Poem detail
  categorias/[slug]/page.tsx        Category-filtered archive
  portfolio/page.tsx                Portfolio grid
  portfolio/[slug]/page.tsx         Project detail
  sobre/page.tsx                    About
  contato/page.tsx                  Contact
  sitemap.ts
  robots.ts
  feed.xml/route.ts                 RSS
  not-found.tsx
/components
  layout/Header.tsx
  layout/MobileNav.tsx
  layout/Footer.tsx
  layout/ThemeToggle.tsx
  ui/ornaments/VineDivider.tsx
  ui/ornaments/RoseBullet.tsx
  ui/ornaments/ArchFrame.tsx
  ui/ornaments/StainedGlassRose.tsx   hero illustration, hand-built SVG (see Task 8)
  ui/QuoteBanner.tsx
  ui/Pagination.tsx
  ui/FilterChips.tsx
  poems/PoemListItem.tsx
  poems/FeaturedPoemCard.tsx
  poems/PoemCard.tsx
  poems/RelatedPoems.tsx
  portfolio/ProjectCard.tsx
  portfolio/FeaturedProjectCard.tsx
  home/Hero.tsx
  home/TeaserCard.tsx
  search/SearchBar.tsx
  search/SearchOverlay.tsx
  comments/GiscusComments.tsx
  templates/CardGridPage.tsx
  templates/DetailPage.tsx
/lib
  types.ts                          zod schemas + inferred TS types
  reading-time.ts
  mdx.ts
  content.ts
  search-index.ts
  seo.ts
  use-in-view.ts
/content
  poems/entre-silencios-e-suspiros.mdx
  poems/a-noite-tambem-escreve.mdx
  poems/cartas-que-nunca-enviei.mdx
  projects/lamento-celeste.mdx
  projects/sussurros-da-palavra.mdx
  pages/home.yaml
  pages/about.mdx
  settings.yaml
  categories.yaml
  _templates/poem.mdx
  _templates/project.mdx
/public/images/            cover images referenced by content front matter
/tests/setup.ts             Vitest + RTL setup (jest-dom matchers, IntersectionObserver mock)
```

---

### Task 1: Project scaffold, tooling, and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `.gitignore`
- Create: `vitest.config.ts`, `tests/setup.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (placeholder content, filled in later tasks)

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, `npm run test` pipeline every later task relies on.

- [ ] **Step 1: Scaffold Next.js app**

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

When prompted, accept defaults. This creates `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`.

- [ ] **Step 2: Install content/search/theme/comments dependencies**

```bash
npm install gray-matter next-mdx-remote zod fuse.js next-themes @giscus/react
```

- [ ] **Step 3: Install test tooling**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Create `tests/setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";

class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
```

Add to `package.json` `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify the pipeline works**

Run: `npm run build`
Expected: build succeeds with the default `create-next-app` starter page.

Run: `npm run test`
Expected: `No test files found` (passes with zero tests — this just confirms Vitest boots).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs .eslintrc.json .gitignore vitest.config.ts tests/setup.ts app/
git commit -m "chore: scaffold Next.js app with test harness"
```

---

### Task 2: Design tokens (colors, type, spacing, motion)

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Tailwind color/font/spacing/motion tokens (`bg-obsidian`, `text-gold`, `font-display`, `font-body`, `font-label`, `duration-organic-base`, `ease-organic`) every later component task uses.

- [ ] **Step 1: Write token values into `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#131313",
          low: "#1c1b1b",
          high: "#2a2a2a",
        },
        parchment: "#f3ead9",
        gold: {
          DEFAULT: "#f2ca50",
          container: "#d4af37",
        },
        emerald: {
          DEFAULT: "#95d3ba",
          container: "#0b513d",
        },
        ink: "#e5e2e1",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-garamond)", "serif"],
        label: ["var(--font-hanken)", "sans-serif"],
      },
      transitionDuration: {
        "organic-fast": "150ms",
        "organic-base": "250ms",
        "organic-slow": "350ms",
      },
      transitionTimingFunction: {
        organic: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      borderRadius: {
        soft: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Write CSS custom properties and reduced-motion guard into `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ease-organic: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
}

body {
  @apply bg-obsidian text-ink font-body;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Verify build still succeeds**

Run: `npm run build`
Expected: build succeeds (no test to write — this task is pure configuration, verified by successful compilation).

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add design tokens for color/type/spacing/motion"
```

---

### Task 3: Self-hosted fonts via next/font

**Files:**
- Create: `lib/fonts.ts`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `playfairDisplay`, `ebGaramond`, `hankenGrotesk` font objects exposing `.variable` class names consumed by `app/layout.tsx`'s `<html>` tag, matching the CSS variable names `--font-playfair`/`--font-garamond`/`--font-hanken` used in Task 2.

- [ ] **Step 1: Define fonts**

Create `lib/fonts.ts`:

```typescript
import { Playfair_Display, EB_Garamond, Hanken_Grotesk } from "next/font/google";

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-garamond",
  display: "swap",
});

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-hanken",
  display: "swap",
});
```

- [ ] **Step 2: Wire into root layout**

Modify `app/layout.tsx`:

```tsx
import "./globals.css";
import { playfairDisplay, ebGaramond, hankenGrotesk } from "@/lib/fonts";

export const metadata = {
  title: "Versos",
  description: "Palavras que florescem — poesia e portfólio criativo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${playfairDisplay.variable} ${ebGaramond.variable} ${hankenGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify fonts load at build time**

Run: `npm run build`
Expected: build succeeds; `next/font` downloads and self-hosts the font files at build time (no runtime request to `fonts.googleapis.com`).

- [ ] **Step 4: Commit**

```bash
git add lib/fonts.ts app/layout.tsx
git commit -m "feat: self-host Playfair Display, EB Garamond, Hanken Grotesk via next/font"
```

---

### Task 4: Content type schemas with zod validation

**Files:**
- Create: `lib/types.ts`
- Test: `lib/types.test.ts`

**Interfaces:**
- Produces: `PoemFrontmatterSchema`, `ProjectFrontmatterSchema`, `CategorySchema`, `SiteSettingsSchema` (zod schemas) and their inferred types `PoemFrontmatter`, `ProjectFrontmatter`, `Category`, `SiteSettings` — every later `/lib` and `/content`-reading task imports these.

- [ ] **Step 1: Write the failing test**

Create `lib/types.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { PoemFrontmatterSchema } from "@/lib/types";

describe("PoemFrontmatterSchema", () => {
  it("accepts a complete valid poem front matter", () => {
    const result = PoemFrontmatterSchema.safeParse({
      title: "Entre Silêncios e Suspiros",
      slug: "entre-silencios-e-suspiros",
      date: "2024-05-18",
      excerpt: "Há palavras que não ousamos dizer.",
      category: "sombras",
      tags: ["silêncio", "noite"],
      featured: true,
      published: true,
      coverImage: "/images/poems/entre-silencios.jpg",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a poem missing the required title field", () => {
    const result = PoemFrontmatterSchema.safeParse({
      slug: "sem-titulo",
      date: "2024-05-18",
      excerpt: "Texto.",
      category: "sombras",
      tags: [],
      featured: false,
      published: true,
      coverImage: "/images/poems/x.jpg",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a date that is not in YYYY-MM-DD format", () => {
    const result = PoemFrontmatterSchema.safeParse({
      title: "Título",
      slug: "titulo",
      date: "18/05/2024",
      excerpt: "Texto.",
      category: "sombras",
      tags: [],
      featured: false,
      published: true,
      coverImage: "/images/poems/x.jpg",
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/types.test.ts`
Expected: FAIL — `Cannot find module '@/lib/types'` (module doesn't exist yet).

- [ ] **Step 3: Write the schemas**

Create `lib/types.ts`:

```typescript
import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

export const SeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});

export const PoemFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: isoDate,
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  coverImage: z.string(),
  readingTime: z.number().optional(),
  seo: SeoSchema.optional(),
});
export type PoemFrontmatter = z.infer<typeof PoemFrontmatterSchema>;

export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: isoDate,
  excerpt: z.string(),
  category: z.string(),
  coverImage: z.string(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  externalLink: z.string().optional(),
  seo: SeoSchema.optional(),
});
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

export const CategorySchema = z.object({
  slug: z.string(),
  label: z.string(),
  description: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const SiteSettingsSchema = z.object({
  siteTitle: z.string(),
  tagline: z.string(),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  socials: z.array(z.object({ platform: z.string(), url: z.string() })),
  footerQuote: z.string(),
  giscus: z.object({ repo: z.string(), category: z.string() }),
  contactFormEndpoint: z.string().optional(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/types.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/types.test.ts
git commit -m "feat: add zod schemas for poem/project/category/settings front matter"
```

---

### Task 5: Reading time calculation

**Files:**
- Create: `lib/reading-time.ts`
- Test: `lib/reading-time.test.ts`

**Interfaces:**
- Consumes: nothing (pure function).
- Produces: `calculateReadingTime(bodyText: string): number` (minutes, rounded up, minimum 1) — used by `lib/content.ts` (Task 7) whenever a poem/project omits a manual `readingTime` override.

- [ ] **Step 1: Write the failing test**

Create `lib/reading-time.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { calculateReadingTime } from "@/lib/reading-time";

describe("calculateReadingTime", () => {
  it("returns 1 minute for very short text", () => {
    expect(calculateReadingTime("Um poema curto.")).toBe(1);
  });

  it("returns 2 minutes for ~400 words at 200wpm", () => {
    const text = Array(400).fill("palavra").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });

  it("rounds up rather than down", () => {
    const text = Array(201).fill("palavra").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/reading-time.test.ts`
Expected: FAIL — `Cannot find module '@/lib/reading-time'`

- [ ] **Step 3: Write the implementation**

Create `lib/reading-time.ts`:

```typescript
const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(bodyText: string): number {
  const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/reading-time.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/reading-time.ts lib/reading-time.test.ts
git commit -m "feat: add reading time calculation"
```

---

### Task 6: MDX file parsing (front matter + body)

**Files:**
- Create: `lib/mdx.ts`
- Test: `lib/mdx.test.ts`, `tests/fixtures/sample-poem.mdx`

**Interfaces:**
- Consumes: nothing external besides `gray-matter`.
- Produces: `parseMdxFile<T>(filePath: string, schema: ZodSchema<T>): { frontmatter: T; content: string }` — used by `lib/content.ts` (Task 7) for every poem/project file.

- [ ] **Step 1: Write the failing test and its fixture**

Create `tests/fixtures/sample-poem.mdx`:

```
---
title: "Poema de Teste"
slug: "poema-de-teste"
date: "2024-05-18"
excerpt: "Um excerto de teste."
category: "sombras"
tags: ["teste"]
featured: false
published: true
coverImage: "/images/poems/teste.jpg"
---

Este é o corpo do poema de teste.

Segunda estrofe aqui.
```

Create `lib/mdx.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import path from "path";
import { parseMdxFile } from "@/lib/mdx";
import { PoemFrontmatterSchema } from "@/lib/types";

describe("parseMdxFile", () => {
  const fixturePath = path.join(process.cwd(), "tests/fixtures/sample-poem.mdx");

  it("parses front matter validated against the given schema", () => {
    const { frontmatter } = parseMdxFile(fixturePath, PoemFrontmatterSchema);
    expect(frontmatter.title).toBe("Poema de Teste");
    expect(frontmatter.slug).toBe("poema-de-teste");
    expect(frontmatter.tags).toEqual(["teste"]);
  });

  it("returns the raw MDX body content", () => {
    const { content } = parseMdxFile(fixturePath, PoemFrontmatterSchema);
    expect(content).toContain("Este é o corpo do poema de teste.");
  });

  it("throws a descriptive error when front matter fails schema validation", () => {
    const badFixture = path.join(process.cwd(), "tests/fixtures/sample-poem.mdx");
    expect(() =>
      parseMdxFile(badFixture, PoemFrontmatterSchema.extend({
        nonExistentRequiredField: (PoemFrontmatterSchema as any).shape.title,
      }) as any)
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/mdx.test.ts`
Expected: FAIL — `Cannot find module '@/lib/mdx'`

- [ ] **Step 3: Write the implementation**

Create `lib/mdx.ts`:

```typescript
import fs from "fs";
import matter from "gray-matter";
import type { ZodSchema } from "zod";

export function parseMdxFile<T>(filePath: string, schema: ZodSchema<T>): { frontmatter: T; content: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid front matter in ${filePath}:\n${result.error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`
    );
  }

  return { frontmatter: result.data, content };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/mdx.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/mdx.ts lib/mdx.test.ts tests/fixtures/sample-poem.mdx
git commit -m "feat: add MDX front-matter parsing with zod validation"
```

---

### Task 7: Content loaders (`lib/content.ts`)

**Files:**
- Create: `lib/content.ts`
- Test: `lib/content.test.ts`
- Create fixtures: `tests/fixtures/content/poems/*.mdx` (3 files), `tests/fixtures/content/categories.yaml`

**Interfaces:**
- Consumes: `parseMdxFile` (Task 6), `PoemFrontmatterSchema`/`ProjectFrontmatterSchema`/`CategorySchema`/`SiteSettingsSchema` (Task 4), `calculateReadingTime` (Task 5).
- Produces: `getAllPoems(): Poem[]`, `getPoemBySlug(slug: string): Poem | undefined`, `getAllProjects(): Project[]`, `getProjectBySlug(slug: string): Project | undefined`, `getCategories(): Category[]`, `getSiteSettings(): SiteSettings`, `getRelatedPoems(poem: Poem, all: Poem[], limit?: number): Poem[]`, where `type Poem = PoemFrontmatter & { content: string; readingTime: number }` (and analogously `Project`). Every page task (8+) imports from here — no page ever calls `fs`/`gray-matter` directly.

- [ ] **Step 1: Write the failing tests and fixtures**

Create `tests/fixtures/content/poems/poema-a.mdx`:

```
---
title: "Poema A"
slug: "poema-a"
date: "2024-05-01"
excerpt: "Excerto A"
category: "sombras"
tags: ["a"]
featured: true
published: true
coverImage: "/images/a.jpg"
---

Corpo do poema A com várias palavras para o cálculo de tempo de leitura ficar em um minuto.
```

Create `tests/fixtures/content/poems/poema-b.mdx`:

```
---
title: "Poema B"
slug: "poema-b"
date: "2024-05-10"
excerpt: "Excerto B"
category: "sombras"
tags: ["b"]
featured: false
published: true
coverImage: "/images/b.jpg"
---

Corpo do poema B.
```

Create `tests/fixtures/content/poems/poema-c-nao-publicado.mdx`:

```
---
title: "Poema C"
slug: "poema-c"
date: "2024-05-15"
excerpt: "Excerto C"
category: "luz"
tags: ["c"]
featured: false
published: false
coverImage: "/images/c.jpg"
---

Corpo do poema C, não publicado.
```

Create `lib/content.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";

const FIXTURE_DIR = path.join(process.cwd(), "tests/fixtures/content");

vi.mock("@/lib/content-paths", () => ({
  POEMS_DIR: path.join(FIXTURE_DIR, "poems"),
}));

import { getAllPoems, getPoemBySlug, getRelatedPoems } from "@/lib/content";

describe("getAllPoems", () => {
  it("returns only published poems, sorted newest first", () => {
    const poems = getAllPoems();
    expect(poems.map((p) => p.slug)).toEqual(["poema-b", "poema-a"]);
  });

  it("attaches a computed readingTime to each poem", () => {
    const poems = getAllPoems();
    expect(poems.every((p) => typeof p.readingTime === "number" && p.readingTime >= 1)).toBe(true);
  });
});

describe("getPoemBySlug", () => {
  it("returns the matching poem", () => {
    const poem = getPoemBySlug("poema-a");
    expect(poem?.title).toBe("Poema A");
  });

  it("returns undefined for an unpublished poem", () => {
    expect(getPoemBySlug("poema-c")).toBeUndefined();
  });

  it("returns undefined for a nonexistent slug", () => {
    expect(getPoemBySlug("nao-existe")).toBeUndefined();
  });
});

describe("getRelatedPoems", () => {
  it("returns poems in the same category, excluding the current poem", () => {
    const all = getAllPoems();
    const current = getPoemBySlug("poema-a")!;
    const related = getRelatedPoems(current, all, 3);
    expect(related.find((p) => p.slug === "poema-a")).toBeUndefined();
    expect(related.every((p) => p.category === current.category)).toBe(true);
  });

  it("respects the limit parameter", () => {
    const all = getAllPoems();
    const current = getPoemBySlug("poema-a")!;
    const related = getRelatedPoems(current, all, 1);
    expect(related.length).toBeLessThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/content.test.ts`
Expected: FAIL — `Cannot find module '@/lib/content'` and `'@/lib/content-paths'`

- [ ] **Step 3: Write `lib/content-paths.ts` (the mockable path module) and `lib/content.ts`**

Create `lib/content-paths.ts`:

```typescript
import path from "path";

export const POEMS_DIR = path.join(process.cwd(), "content/poems");
export const PROJECTS_DIR = path.join(process.cwd(), "content/projects");
export const SETTINGS_FILE = path.join(process.cwd(), "content/settings.yaml");
export const CATEGORIES_FILE = path.join(process.cwd(), "content/categories.yaml");
```

Create `lib/content.ts`:

```typescript
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { parseMdxFile } from "@/lib/mdx";
import { calculateReadingTime } from "@/lib/reading-time";
import {
  PoemFrontmatterSchema,
  ProjectFrontmatterSchema,
  CategorySchema,
  SiteSettingsSchema,
  type PoemFrontmatter,
  type ProjectFrontmatter,
  type Category,
  type SiteSettings,
} from "@/lib/types";
import { POEMS_DIR, PROJECTS_DIR, SETTINGS_FILE, CATEGORIES_FILE } from "@/lib/content-paths";

export type Poem = PoemFrontmatter & { content: string; readingTime: number };
export type Project = ProjectFrontmatter & { content: string };

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(dir, file));
}

export function getAllPoems(): Poem[] {
  return listMdxFiles(POEMS_DIR)
    .map((filePath) => {
      const { frontmatter, content } = parseMdxFile(filePath, PoemFrontmatterSchema);
      return {
        ...frontmatter,
        content,
        readingTime: frontmatter.readingTime ?? calculateReadingTime(content),
      };
    })
    .filter((poem) => poem.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPoemBySlug(slug: string): Poem | undefined {
  return getAllPoems().find((poem) => poem.slug === slug);
}

export function getRelatedPoems(poem: Poem, all: Poem[], limit = 3): Poem[] {
  return all
    .filter((candidate) => candidate.slug !== poem.slug && candidate.category === poem.category)
    .slice(0, limit);
}

export function getAllProjects(): Project[] {
  return listMdxFiles(PROJECTS_DIR)
    .map((filePath) => {
      const { frontmatter, content } = parseMdxFile(filePath, ProjectFrontmatterSchema);
      return { ...frontmatter, content };
    })
    .filter((project) => project.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}

export function getCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE)) return [];
  const raw = yaml.load(fs.readFileSync(CATEGORIES_FILE, "utf-8"));
  const list = Array.isArray(raw) ? raw : [];
  return list.map((entry) => CategorySchema.parse(entry));
}

export function getSiteSettings(): SiteSettings {
  const raw = yaml.load(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  return SiteSettingsSchema.parse(raw);
}
```

Install `js-yaml`:

```bash
npm install js-yaml
npm install -D @types/js-yaml
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/content.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/content-paths.ts lib/content.test.ts tests/fixtures/content package.json package-lock.json
git commit -m "feat: add content loaders for poems/projects/categories/settings"
```

---

### Task 8: Search index builder

**Files:**
- Create: `lib/search-index.ts`
- Test: `lib/search-index.test.ts`

**Interfaces:**
- Consumes: `Poem`/`Project` types (Task 7).
- Produces: `buildSearchIndex(poems: Poem[], projects: Project[]): SearchEntry[]` where `SearchEntry = { title: string; excerpt: string; tags: string[]; url: string; type: "poem" | "project" }` — consumed by `components/search/SearchBar.tsx` (Task 16) and by the build step that serializes this to static JSON.

- [ ] **Step 1: Write the failing test**

Create `lib/search-index.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildSearchIndex } from "@/lib/search-index";
import type { Poem, Project } from "@/lib/content";

const poem: Poem = {
  title: "Poema A",
  slug: "poema-a",
  date: "2024-05-01",
  excerpt: "Excerto A",
  category: "sombras",
  tags: ["a"],
  featured: true,
  published: true,
  coverImage: "/images/a.jpg",
  content: "corpo",
  readingTime: 1,
};

const project: Project = {
  title: "Projeto A",
  slug: "projeto-a",
  date: "2024-05-01",
  excerpt: "Excerto do projeto",
  category: "ilustracao",
  coverImage: "/images/proj-a.jpg",
  gallery: [],
  featured: false,
  published: true,
  content: "corpo",
};

describe("buildSearchIndex", () => {
  it("produces one entry per poem with a /poemas/[slug] url", () => {
    const index = buildSearchIndex([poem], []);
    expect(index).toEqual([
      { title: "Poema A", excerpt: "Excerto A", tags: ["a"], url: "/poemas/poema-a", type: "poem" },
    ]);
  });

  it("produces one entry per project with a /portfolio/[slug] url", () => {
    const index = buildSearchIndex([], [project]);
    expect(index[0]).toMatchObject({ url: "/portfolio/projeto-a", type: "project" });
  });

  it("combines poems and projects into a single flat list", () => {
    const index = buildSearchIndex([poem], [project]);
    expect(index).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/search-index.test.ts`
Expected: FAIL — `Cannot find module '@/lib/search-index'`

- [ ] **Step 3: Write the implementation**

Create `lib/search-index.ts`:

```typescript
import type { Poem, Project } from "@/lib/content";

export type SearchEntry = {
  title: string;
  excerpt: string;
  tags: string[];
  url: string;
  type: "poem" | "project";
};

export function buildSearchIndex(poems: Poem[], projects: Project[]): SearchEntry[] {
  const poemEntries: SearchEntry[] = poems.map((poem) => ({
    title: poem.title,
    excerpt: poem.excerpt,
    tags: poem.tags,
    url: `/poemas/${poem.slug}`,
    type: "poem",
  }));

  const projectEntries: SearchEntry[] = projects.map((project) => ({
    title: project.title,
    excerpt: project.excerpt,
    tags: [],
    url: `/portfolio/${project.slug}`,
    type: "project",
  }));

  return [...poemEntries, ...projectEntries];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/search-index.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/search-index.ts lib/search-index.test.ts
git commit -m "feat: add search index builder"
```

---

### Task 9: SEO metadata + JSON-LD builders

**Files:**
- Create: `lib/seo.ts`
- Test: `lib/seo.test.ts`

**Interfaces:**
- Consumes: `Poem`/`Project`/`SiteSettings` types (Task 7).
- Produces: `buildPoemMetadata(poem: Poem, settings: SiteSettings): Metadata` (Next.js `Metadata` type), `buildPoemJsonLd(poem: Poem, settings: SiteSettings): object` (schema.org `BlogPosting`) — used by `app/poemas/[slug]/page.tsx` (Task 20).

- [ ] **Step 1: Write the failing test**

Create `lib/seo.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildPoemMetadata, buildPoemJsonLd } from "@/lib/seo";
import type { Poem } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";

const poem: Poem = {
  title: "Entre Silêncios e Suspiros",
  slug: "entre-silencios-e-suspiros",
  date: "2024-05-18",
  excerpt: "Há palavras que não ousamos dizer.",
  category: "sombras",
  tags: ["silêncio"],
  featured: true,
  published: true,
  coverImage: "/images/poem.jpg",
  content: "corpo",
  readingTime: 2,
};

const settings: SiteSettings = {
  siteTitle: "Versos",
  tagline: "Palavras que florescem",
  nav: [],
  socials: [],
  footerQuote: "A poesia é o eco da alma que se recusa a ficar em silêncio.",
  giscus: { repo: "owner/repo", category: "Poemas" },
};

describe("buildPoemMetadata", () => {
  it("sets title to the poem title suffixed with the site title", () => {
    const metadata = buildPoemMetadata(poem, settings);
    expect(metadata.title).toBe("Entre Silêncios e Suspiros | Versos");
  });

  it("falls back to the poem excerpt when no seo.description is set", () => {
    const metadata = buildPoemMetadata(poem, settings);
    expect(metadata.description).toBe(poem.excerpt);
  });

  it("uses the poem's own seo.description when provided", () => {
    const metadata = buildPoemMetadata({ ...poem, seo: { description: "Custom." } }, settings);
    expect(metadata.description).toBe("Custom.");
  });
});

describe("buildPoemJsonLd", () => {
  it("produces a schema.org BlogPosting object", () => {
    const jsonLd = buildPoemJsonLd(poem, settings) as any;
    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.headline).toBe(poem.title);
    expect(jsonLd.datePublished).toBe(poem.date);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/seo.test.ts`
Expected: FAIL — `Cannot find module '@/lib/seo'`

- [ ] **Step 3: Write the implementation**

Create `lib/seo.ts`:

```typescript
import type { Metadata } from "next";
import type { Poem, Project } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";

export function buildPoemMetadata(poem: Poem, settings: SiteSettings): Metadata {
  return {
    title: `${poem.seo?.title ?? poem.title} | ${settings.siteTitle}`,
    description: poem.seo?.description ?? poem.excerpt,
    openGraph: {
      title: poem.seo?.title ?? poem.title,
      description: poem.seo?.description ?? poem.excerpt,
      images: poem.seo?.ogImage ? [poem.seo.ogImage] : [poem.coverImage],
      type: "article",
      publishedTime: poem.date,
    },
  };
}

export function buildPoemJsonLd(poem: Poem, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: poem.title,
    description: poem.excerpt,
    datePublished: poem.date,
    author: { "@type": "Person", name: settings.siteTitle },
    image: poem.coverImage,
  };
}

export function buildProjectMetadata(project: Project, settings: SiteSettings): Metadata {
  return {
    title: `${project.seo?.title ?? project.title} | ${settings.siteTitle}`,
    description: project.seo?.description ?? project.excerpt,
    openGraph: {
      title: project.seo?.title ?? project.title,
      description: project.seo?.description ?? project.excerpt,
      images: project.seo?.ogImage ? [project.seo.ogImage] : [project.coverImage],
      type: "article",
      publishedTime: project.date,
    },
  };
}

export function buildProjectJsonLd(project: Project, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    dateCreated: project.date,
    creator: { "@type": "Person", name: settings.siteTitle },
    image: project.coverImage,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/seo.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/seo.ts lib/seo.test.ts
git commit -m "feat: add SEO metadata and JSON-LD builders"
```

---

### Task 10: Sample content files

**Files:**
- Create: `content/poems/entre-silencios-e-suspiros.mdx`, `content/poems/a-noite-tambem-escreve.mdx`, `content/poems/cartas-que-nunca-enviei.mdx`
- Create: `content/projects/lamento-celeste.mdx`, `content/projects/sussurros-da-palavra.mdx`
- Create: `content/pages/about.mdx`, `content/pages/home.yaml`
- Create: `content/settings.yaml`, `content/categories.yaml`
- Create: `content/_templates/poem.mdx`, `content/_templates/project.mdx`

**Interfaces:**
- Consumes: schemas from Task 4 (files must satisfy them or the build fails).
- Produces: real content for every page task from here on to render against — no page task should invent placeholder text; it reads this content.

- [ ] **Step 1: Create three sample poems**

Create `content/poems/entre-silencios-e-suspiros.mdx` (reusing copy already validated against the reference mockup):

```
---
title: "Entre Silêncios e Suspiros"
slug: "entre-silencios-e-suspiros"
date: "2024-05-18"
excerpt: "Há palavras que não ousamos dizer, e sentimentos que somente o silêncio compreende."
category: "sombras"
tags: ["silêncio", "noite", "introspecção"]
featured: true
published: true
coverImage: "/images/poems/entre-silencios.jpg"
---

Há palavras que não ousamos dizer,
e sentimentos que somente o silêncio compreende.

A noite guarda o que os lábios escondem,
e o suspiro carrega o que os olhos não veem.

Entre um verso e outro, existo —
frágil como vidro, firme como raiz.
```

Create `content/poems/a-noite-tambem-escreve.mdx`:

```
---
title: "A Noite Também Escreve"
slug: "a-noite-tambem-escreve"
date: "2024-05-10"
excerpt: "Enquanto o mundo dorme, a tinta escorre devagar sobre o papel do céu."
category: "sombras"
tags: ["noite", "escrita"]
featured: false
published: true
coverImage: "/images/poems/a-noite-tambem-escreve.jpg"
---

Enquanto o mundo dorme, a tinta escorre
devagar sobre o papel do céu.

Cada estrela, uma vírgula pausada;
cada sombra, um verso por revelar.
```

Create `content/poems/cartas-que-nunca-enviei.mdx`:

```
---
title: "Cartas que Nunca Enviei"
slug: "cartas-que-nunca-enviei"
date: "2024-05-02"
excerpt: "Guardo gavetas cheias de palavras que nunca encontraram coragem de partir."
category: "luz"
tags: ["saudade", "cartas"]
featured: false
published: true
coverImage: "/images/poems/cartas-que-nunca-enviei.jpg"
---

Guardo gavetas cheias de palavras
que nunca encontraram coragem de partir.

Talvez um dia o vento as leve,
ou talvez fiquem, para sempre, a florescer em mim.
```

- [ ] **Step 2: Create two sample portfolio projects**

Create `content/projects/lamento-celeste.mdx`:

```
---
title: "Lamento Celeste"
slug: "lamento-celeste"
date: "2024-04-20"
excerpt: "Uma série de ilustrações inspiradas em vitrais góticos e céus noturnos."
category: "ilustracao"
coverImage: "/images/projects/lamento-celeste.jpg"
gallery: ["/images/projects/lamento-celeste-1.jpg", "/images/projects/lamento-celeste-2.jpg"]
featured: true
published: true
---

Uma exploração visual onde vitrais e constelações se encontram, unindo luz e melancolia em cada traço.
```

Create `content/projects/sussurros-da-palavra.mdx`:

```
---
title: "Sussurros da Palavra"
slug: "sussurros-da-palavra"
date: "2024-03-05"
excerpt: "Caligrafia manuscrita aplicada a versos inéditos, unindo poesia e arte manual."
category: "manuscrito"
coverImage: "/images/projects/sussurros-da-palavra.jpg"
gallery: []
featured: false
published: true
---

Cada verso ganhou forma através da tinta e do papel, num processo lento e deliberado de caligrafia autoral.
```

- [ ] **Step 3: Create About page, home content, settings, and categories**

Create `content/pages/about.mdx`:

```
---
title: "Sobre Mim"
---

Apaixonada por palavras, natureza e tudo que toca a alma. Escrevo para entender o que sinto e compartilhar para conectar.
```

Create `content/pages/home.yaml`:

```yaml
heroTitleLine1: "Palavras que"
heroTitleLine2: "Florescem"
heroSubtitle: "Um espaço onde sentimentos ganham forma em versos. Bem-vindo ao meu mundo."
heroPrimaryCta: { label: "Ler Poemas", href: "/poemas" }
heroSecondaryCta: { label: "Sobre Mim", href: "/sobre" }
```

Create `content/settings.yaml`:

```yaml
siteTitle: "Versos"
tagline: "Palavras que florescem"
nav:
  - { label: "Início", href: "/" }
  - { label: "Sobre", href: "/sobre" }
  - { label: "Poemas", href: "/poemas" }
  - { label: "Categorias", href: "/categorias" }
  - { label: "Portfólio", href: "/portfolio" }
  - { label: "Contato", href: "/contato" }
socials:
  - { platform: "instagram", url: "https://instagram.com/versos" }
  - { platform: "pinterest", url: "https://pinterest.com/versos" }
footerQuote: "A poesia é o eco da alma que se recusa a ficar em silêncio."
giscus:
  repo: "REPLACE_WITH_owner/repo"
  category: "Poemas"
```

Create `content/categories.yaml`:

```yaml
- { slug: "sombras", label: "Sombras", description: "Poemas sobre introspecção e a noite." }
- { slug: "luz", label: "Luz", description: "Poemas sobre esperança e saudade." }
- { slug: "ilustracao", label: "Ilustração", description: "Projetos visuais e vitrais." }
- { slug: "manuscrito", label: "Manuscrito", description: "Trabalhos de caligrafia e escrita manual." }
```

- [ ] **Step 4: Create copy-paste templates for the owner**

Create `content/_templates/poem.mdx`:

```
---
title: "Título do Poema"
slug: "titulo-do-poema"
date: "AAAA-MM-DD"
excerpt: "Uma frase curta que resume o poema (aparece nas listagens)."
category: "sombras"
tags: ["tag1", "tag2"]
featured: false
published: false
coverImage: "/images/poems/nome-da-imagem.jpg"
---

Escreva aqui o corpo do poema.

published: false enquanto estiver rascunhando. Mude para true quando quiser publicar.
```

Create `content/_templates/project.mdx`:

```
---
title: "Título do Projeto"
slug: "titulo-do-projeto"
date: "AAAA-MM-DD"
excerpt: "Uma frase curta que resume o projeto."
category: "ilustracao"
coverImage: "/images/projects/nome-da-imagem.jpg"
gallery: []
featured: false
published: false
---

Descreva o projeto aqui.
```

- [ ] **Step 5: Verify all content passes schema validation**

Run: `npm run test -- lib/content.test.ts lib/types.test.ts`
Expected: PASS (existing tests still pass — they use fixtures, not this real content, but this step also doubles as a manual sanity check).

Run this ad hoc script to validate the real content directly:

```bash
node -e "
require('ts-node/register');
const { getAllPoems, getAllProjects, getCategories, getSiteSettings } = require('./lib/content.ts');
console.log('poems:', getAllPoems().length);
console.log('projects:', getAllProjects().length);
console.log('categories:', getCategories().length);
console.log('settings:', getSiteSettings().siteTitle);
"
```

If `ts-node` isn't installed, install it as a dev dependency first: `npm install -D ts-node`. Expected output: `poems: 3`, `projects: 2`, `categories: 4`, `settings: Versos`.

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "content: add sample poems, projects, about page, settings, categories, templates"
```

---

### Task 11: Ornament components (VineDivider, RoseBullet, ArchFrame)

**Files:**
- Create: `components/ui/ornaments/VineDivider.tsx`, `components/ui/ornaments/RoseBullet.tsx`, `components/ui/ornaments/ArchFrame.tsx`
- Test: `components/ui/ornaments/ornaments.test.tsx`

**Interfaces:**
- Produces: `<VineDivider />`, `<RoseBullet className? />`, `<ArchFrame>{children}</ArchFrame>` — reused by Hero (Task 14), PoemListItem (Task 17), Footer (Task 13), and detail page templates (Task 19).

**Design correction vs. Stitch:** Stitch's screens use flat `<hr>`-style breaks and stock photography for framing. These components replace both with hand-built inline SVG matching the reference image's ironwork/vine motifs, at near-zero runtime cost (no images to fetch, no JS).

- [ ] **Step 1: Write the failing test**

Create `components/ui/ornaments/ornaments.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import { RoseBullet } from "@/components/ui/ornaments/RoseBullet";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";

describe("VineDivider", () => {
  it("renders an svg marked decorative (aria-hidden)", () => {
    render(<VineDivider />);
    expect(screen.getByTestId("vine-divider")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("RoseBullet", () => {
  it("renders an svg marked decorative", () => {
    render(<RoseBullet />);
    expect(screen.getByTestId("rose-bullet")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ArchFrame", () => {
  it("renders its children inside the arch wrapper", () => {
    render(
      <ArchFrame>
        <img src="/x.jpg" alt="Retrato" />
      </ArchFrame>
    );
    expect(screen.getByAltText("Retrato")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- components/ui/ornaments/ornaments.test.tsx`
Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Write the implementations**

Create `components/ui/ornaments/VineDivider.tsx`:

```tsx
export function VineDivider() {
  return (
    <svg
      data-testid="vine-divider"
      aria-hidden="true"
      viewBox="0 0 200 24"
      className="mx-auto my-8 h-6 w-48 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path d="M0 12 H80" />
      <path d="M120 12 H200" />
      <path d="M100 12 L94 6 L100 0 L106 6 Z" fill="currentColor" stroke="none" />
      <path d="M80 12 C88 4 92 20 100 12" />
      <path d="M120 12 C112 20 108 4 100 12" />
    </svg>
  );
}
```

Create `components/ui/ornaments/RoseBullet.tsx`:

```tsx
export function RoseBullet({ className = "" }: { className?: string }) {
  return (
    <svg
      data-testid="rose-bullet"
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-4 w-4 text-emerald ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <circle cx="8" cy="8" r="3" />
      <path d="M8 5 C6 3 6 1 8 1 C10 1 10 3 8 5" />
      <path d="M8 11 C6 13 6 15 8 15 C10 15 10 13 8 11" />
      <path d="M5 8 C3 6 1 6 1 8 C1 10 3 10 5 8" />
      <path d="M11 8 C13 6 15 6 15 8 C15 10 13 10 11 8" />
    </svg>
  );
}
```

Create `components/ui/ornaments/ArchFrame.tsx`:

```tsx
export function ArchFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden border border-gold-container [border-radius:50%_50%_0_0/100%_100%_0_0]"
      style={{ aspectRatio: "3 / 4" }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- components/ui/ornaments/ornaments.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add components/ui/ornaments/
git commit -m "feat: add VineDivider, RoseBullet, ArchFrame ornament components"
```

---

### Task 12: Header + MobileNav

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/MobileNav.tsx`
- Test: `components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings["nav"]` shape (Task 4).
- Produces: `<Header nav={NavItem[]} siteTitle={string} />` rendered by `app/layout.tsx` (Task 22).

- [ ] **Step 1: Write the failing test**

Create `components/layout/Header.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";

const nav = [
  { label: "Início", href: "/" },
  { label: "Poemas", href: "/poemas" },
];

describe("Header", () => {
  it("renders the site title and all nav links", () => {
    render(<Header nav={nav} siteTitle="Versos" />);
    expect(screen.getByText("Versos")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Poemas" })).toHaveAttribute("href", "/poemas");
  });

  it("mobile nav is closed by default and opens when the toggle is clicked", async () => {
    render(<Header nav={nav} siteTitle="Versos" />);
    const toggle = screen.getByRole("button", { name: /abrir menu/i });
    expect(screen.getByTestId("mobile-nav")).toHaveAttribute("data-open", "false");
    await userEvent.click(toggle);
    expect(screen.getByTestId("mobile-nav")).toHaveAttribute("data-open", "true");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- components/layout/Header.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write the implementation**

Create `components/layout/MobileNav.tsx`:

```tsx
"use client";

type NavItem = { label: string; href: string };

export function MobileNav({ nav, open }: { nav: NavItem[]; open: boolean }) {
  return (
    <nav
      data-testid="mobile-nav"
      data-open={open}
      className={`fixed inset-x-0 top-16 z-40 flex flex-col gap-4 bg-obsidian-low p-6 transition-all duration-organic-base ease-organic md:hidden ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      {nav.map((item) => (
        <a key={item.href} href={item.href} className="font-label uppercase tracking-wide text-ink">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

Create `components/layout/Header.tsx`:

```tsx
"use client";

import { useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";

type NavItem = { label: string; href: string };

export function Header({ nav, siteTitle }: { nav: NavItem[]; siteTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gold-container/30 bg-obsidian/90 px-6 py-4 backdrop-blur">
      <a href="/" className="font-display text-xl tracking-widest text-gold">
        {siteTitle}
      </a>
      <nav className="hidden gap-6 font-label text-sm uppercase tracking-wide md:flex">
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="transition-colors duration-organic-fast ease-organic hover:text-gold">
            {item.label}
          </a>
        ))}
      </nav>
      <button
        aria-label="Abrir menu"
        aria-expanded={open}
        className="md:hidden"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true">☰</span>
      </button>
      <MobileNav nav={nav} open={open} />
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- components/layout/Header.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add components/layout/Header.tsx components/layout/MobileNav.tsx components/layout/Header.test.tsx
git commit -m "feat: add Header with accessible mobile nav toggle"
```

---

### Task 13: Footer

**Files:**
- Create: `components/layout/Footer.tsx`
- Test: `components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings` shape (Task 4), `VineDivider` (Task 11).
- Produces: `<Footer settings={SiteSettings} />` rendered by `app/layout.tsx` (Task 22).

**Design correction vs. Stitch:** newsletter block is omitted per spec §9 (deferred), so this footer has three real columns (quote+ornament, nav, social) not four — don't leave a placeholder gap where the newsletter block would have been.

- [ ] **Step 1: Write the failing test**

Create `components/layout/Footer.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import type { SiteSettings } from "@/lib/types";

const settings: SiteSettings = {
  siteTitle: "Versos",
  tagline: "Palavras que florescem",
  nav: [{ label: "Poemas", href: "/poemas" }],
  socials: [{ platform: "instagram", url: "https://instagram.com/versos" }],
  footerQuote: "A poesia é o eco da alma que se recusa a ficar em silêncio.",
  giscus: { repo: "owner/repo", category: "Poemas" },
};

describe("Footer", () => {
  it("renders the footer quote", () => {
    render(<Footer settings={settings} />);
    expect(screen.getByText(settings.footerQuote)).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(<Footer settings={settings} />);
    expect(screen.getByRole("link", { name: "Poemas" })).toHaveAttribute("href", "/poemas");
  });

  it("renders social links with the platform name accessible", () => {
    render(<Footer settings={settings} />);
    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      "https://instagram.com/versos"
    );
  });

  it("does not render a newsletter form", () => {
    render(<Footer settings={settings} />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- components/layout/Footer.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write the implementation**

Create `components/layout/Footer.tsx`:

```tsx
import { VineDivider } from "@/components/ui/ornaments/VineDivider";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 border-t border-gold-container/30 bg-obsidian-low px-6 py-12 text-center">
      <VineDivider />
      <p className="mx-auto max-w-xl font-display italic text-lg text-ink">
        &ldquo;{settings.footerQuote}&rdquo;
      </p>
      <div className="mt-10 grid gap-8 text-left font-label text-sm uppercase tracking-wide md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-gold">Navegação</h2>
          <ul className="space-y-2">
            {settings.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-gold">Redes Sociais</h2>
          <ul className="flex gap-4">
            {settings.socials.map((social) => (
              <li key={social.url}>
                <a href={social.url} className="hover:text-gold" aria-label={social.platform}>
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-10 font-label text-xs text-ink/60">
        &copy; {new Date().getFullYear()} {settings.siteTitle}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- components/layout/Footer.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx components/layout/Footer.test.tsx
git commit -m "feat: add Footer (quote, nav, social — no newsletter block per spec)"
```

---

### Task 14: Hero + hand-built stained-glass illustration

**Files:**
- Create: `components/home/Hero.tsx`, `components/ui/ornaments/StainedGlassRose.tsx`
- Test: `components/home/Hero.test.tsx`

**Interfaces:**
- Consumes: home hero copy shape `{ heroTitleLine1, heroTitleLine2, heroSubtitle, heroPrimaryCta, heroSecondaryCta }` (from `content/pages/home.yaml`, loaded by a small addition to `lib/content.ts` in Task 15), `ArchFrame` (Task 11).
- Produces: `<Hero {...homeContent} />` rendered by `app/page.tsx` (Task 15).

**Design correction vs. Stitch — the most important one in this plan:** the reference image's hero is a two-column layout (headline+CTAs on the left, a large arched stained-glass rose illustration on the right). Stitch's actual generated homepage is single-column with a generic AI photo underneath the headline. Do not replicate Stitch's layout. Build `StainedGlassRose` as a hand-authored layered SVG (facets in gold/emerald/obsidian tones from Task 2's palette, inside a pointed gothic arch outline) — this is cheap (no image request), on-brand, and fully reproducible without an external image generator.

- [ ] **Step 1: Write the failing test**

Create `components/home/Hero.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";

const props = {
  heroTitleLine1: "Palavras que",
  heroTitleLine2: "Florescem",
  heroSubtitle: "Um espaço onde sentimentos ganham forma em versos.",
  heroPrimaryCta: { label: "Ler Poemas", href: "/poemas" },
  heroSecondaryCta: { label: "Sobre Mim", href: "/sobre" },
};

describe("Hero", () => {
  it("renders both headline lines and the subtitle", () => {
    render(<Hero {...props} />);
    expect(screen.getByText("Palavras que")).toBeInTheDocument();
    expect(screen.getByText("Florescem")).toBeInTheDocument();
    expect(screen.getByText(props.heroSubtitle)).toBeInTheDocument();
  });

  it("renders both CTAs as links to the correct hrefs", () => {
    render(<Hero {...props} />);
    expect(screen.getByRole("link", { name: "Ler Poemas" })).toHaveAttribute("href", "/poemas");
    expect(screen.getByRole("link", { name: "Sobre Mim" })).toHaveAttribute("href", "/sobre");
  });

  it("renders the stained-glass illustration as a two-column layout, not a stacked photo", () => {
    render(<Hero {...props} />);
    const section = screen.getByTestId("hero-section");
    expect(section.className).toMatch(/md:grid-cols-2/);
    expect(screen.getByTestId("stained-glass-rose")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- components/home/Hero.test.tsx`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Write the implementation**

Create `components/ui/ornaments/StainedGlassRose.tsx`:

```tsx
export function StainedGlassRose() {
  return (
    <svg
      data-testid="stained-glass-rose"
      role="img"
      aria-label="Ilustração de uma rosa em vitral dentro de um arco gótico"
      viewBox="0 0 300 400"
      className="h-full w-full"
    >
      <path
        d="M20 400 V150 A130 170 0 0 1 280 150 V400 Z"
        fill="#1c1b1b"
        stroke="#d4af37"
        strokeWidth={4}
      />
      <g stroke="#131313" strokeWidth={2}>
        <circle cx="150" cy="200" r="55" fill="#95d3ba" />
        <path d="M150 145 C120 160 120 200 150 200 C180 200 180 160 150 145 Z" fill="#0b513d" />
        <path d="M150 255 C120 240 120 200 150 200 C180 200 180 240 150 255 Z" fill="#0b513d" />
        <path d="M95 200 C110 170 150 170 150 200 C150 230 110 230 95 200 Z" fill="#f2ca50" />
        <path d="M205 200 C190 170 150 170 150 200 C150 230 190 230 205 200 Z" fill="#f2ca50" />
        <rect x="145" y="255" width="10" height="90" fill="#0b513d" />
        <path d="M150 300 L120 320" stroke="#0b513d" strokeWidth={4} fill="none" />
        <path d="M150 320 L180 340" stroke="#0b513d" strokeWidth={4} fill="none" />
      </g>
    </svg>
  );
}
```

Create `components/home/Hero.tsx`:

```tsx
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";
import { StainedGlassRose } from "@/components/ui/ornaments/StainedGlassRose";

type Cta = { label: string; href: string };

export function Hero({
  heroTitleLine1,
  heroTitleLine2,
  heroSubtitle,
  heroPrimaryCta,
  heroSecondaryCta,
}: {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroPrimaryCta: Cta;
  heroSecondaryCta: Cta;
}) {
  return (
    <section data-testid="hero-section" className="grid gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-16">
      <div>
        <h1 className="font-display text-5xl leading-tight text-ink">
          <span className="block">{heroTitleLine1}</span>
          <span className="block text-emerald">{heroTitleLine2}</span>
        </h1>
        <p className="mt-6 max-w-md font-body text-lg text-ink/80">{heroSubtitle}</p>
        <div className="mt-8 flex gap-4">
          <a
            href={heroPrimaryCta.href}
            className="rounded-soft border border-gold bg-gold px-6 py-3 font-label text-sm uppercase tracking-wide text-obsidian transition-all duration-organic-base ease-organic hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(242,202,80,0.35)]"
          >
            {heroPrimaryCta.label}
          </a>
          <a
            href={heroSecondaryCta.href}
            className="rounded-soft border border-ink/40 px-6 py-3 font-label text-sm uppercase tracking-wide text-ink transition-colors duration-organic-base ease-organic hover:border-gold hover:text-gold"
          >
            {heroSecondaryCta.label}
          </a>
        </div>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <ArchFrame>
          <StainedGlassRose />
        </ArchFrame>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- components/home/Hero.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add components/home/Hero.tsx components/ui/ornaments/StainedGlassRose.tsx components/home/Hero.test.tsx
git commit -m "feat: add two-column Hero with hand-built stained-glass rose illustration"
```

---

### Task 15: Home page content loader + remaining home components (PoemListItem, FeaturedPoemCard, TeaserCard, QuoteBanner)

**Files:**
- Modify: `lib/content.ts` (add `getHomeContent()`)
- Create: `components/poems/PoemListItem.tsx`, `components/poems/FeaturedPoemCard.tsx`, `components/home/TeaserCard.tsx`, `components/ui/QuoteBanner.tsx`
- Test: `lib/content.test.ts` (extend), `components/poems/PoemListItem.test.tsx`, `components/home/TeaserCard.test.tsx`

**Interfaces:**
- Produces: `getHomeContent(): HomeContent` (reads `content/pages/home.yaml`); `<PoemListItem poem={Poem} />`; `<FeaturedPoemCard poem={Poem} />`; `<TeaserCard title, description, cta, image />`; `<QuoteBanner quote={string} />`. All consumed by `app/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing tests**

Add to `lib/content.test.ts`:

```typescript
import { getHomeContent } from "@/lib/content";

describe("getHomeContent", () => {
  it("reads hero copy from content/pages/home.yaml", () => {
    // This test runs against the mocked fixture dir; add a fixture home.yaml alongside.
  });
});
```

Since `getHomeContent` reads real `content/pages/home.yaml` created in Task 10 (not a fixture), test it directly rather than through the fixture mock:

Create `lib/content-home.test.ts` (separate file so it isn't affected by the `content-paths` mock used in `lib/content.test.ts`):

```typescript
import { describe, it, expect } from "vitest";
import { getHomeContent } from "@/lib/content";

describe("getHomeContent (real content)", () => {
  it("returns the real home hero copy", () => {
    const home = getHomeContent();
    expect(home.heroTitleLine1).toBe("Palavras que");
    expect(home.heroTitleLine2).toBe("Florescem");
    expect(home.heroPrimaryCta).toEqual({ label: "Ler Poemas", href: "/poemas" });
  });
});
```

Create `components/poems/PoemListItem.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PoemListItem } from "@/components/poems/PoemListItem";
import type { Poem } from "@/lib/content";

const poem: Poem = {
  title: "Entre Silêncios e Suspiros",
  slug: "entre-silencios-e-suspiros",
  date: "2024-05-18",
  excerpt: "Excerto",
  category: "sombras",
  tags: [],
  featured: true,
  published: true,
  coverImage: "/x.jpg",
  content: "corpo",
  readingTime: 2,
};

describe("PoemListItem", () => {
  it("links to the poem detail page and shows a formatted date", () => {
    render(<PoemListItem poem={poem} />);
    expect(screen.getByRole("link", { name: /Entre Silêncios e Suspiros/ })).toHaveAttribute(
      "href",
      "/poemas/entre-silencios-e-suspiros"
    );
    expect(screen.getByText("18 de maio de 2024")).toBeInTheDocument();
  });

  it("renders a decorative RoseBullet icon", () => {
    render(<PoemListItem poem={poem} />);
    expect(screen.getByTestId("rose-bullet")).toBeInTheDocument();
  });
});
```

Create `components/home/TeaserCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeaserCard } from "@/components/home/TeaserCard";

describe("TeaserCard", () => {
  it("renders title, description, and a CTA link", () => {
    render(
      <TeaserCard
        title="Sobre Mim"
        description="Texto de exemplo."
        cta={{ label: "Conhecer minha história", href: "/sobre" }}
      />
    );
    expect(screen.getByText("Sobre Mim")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conhecer minha história" })).toHaveAttribute("href", "/sobre");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- lib/content-home.test.ts components/poems/PoemListItem.test.tsx components/home/TeaserCard.test.tsx`
Expected: FAIL — `getHomeContent` and the components don't exist yet.

- [ ] **Step 3: Implement**

Add to `lib/types.ts`:

```typescript
export const HomeContentSchema = z.object({
  heroTitleLine1: z.string(),
  heroTitleLine2: z.string(),
  heroSubtitle: z.string(),
  heroPrimaryCta: z.object({ label: z.string(), href: z.string() }),
  heroSecondaryCta: z.object({ label: z.string(), href: z.string() }),
});
export type HomeContent = z.infer<typeof HomeContentSchema>;
```

Add to `lib/content-paths.ts`:

```typescript
export const HOME_CONTENT_FILE = path.join(process.cwd(), "content/pages/home.yaml");
```

Add to `lib/content.ts`:

```typescript
import { HomeContentSchema, type HomeContent } from "@/lib/types";
import { HOME_CONTENT_FILE } from "@/lib/content-paths";

export function getHomeContent(): HomeContent {
  const raw = yaml.load(fs.readFileSync(HOME_CONTENT_FILE, "utf-8"));
  return HomeContentSchema.parse(raw);
}
```

Create `components/poems/PoemListItem.tsx`:

```tsx
import { RoseBullet } from "@/components/ui/ornaments/RoseBullet";
import type { Poem } from "@/lib/content";

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PoemListItem({ poem }: { poem: Poem }) {
  return (
    <li className="flex items-start gap-3">
      <RoseBullet className="mt-1 shrink-0" />
      <a href={`/poemas/${poem.slug}`} className="group">
        <span className="block font-display text-lg text-ink transition-colors duration-organic-fast ease-organic group-hover:text-gold">
          {poem.title}
        </span>
        <span className="block font-label text-xs uppercase tracking-wide text-ink/60">
          {formatDate(poem.date)}
        </span>
      </a>
    </li>
  );
}
```

Create `components/poems/FeaturedPoemCard.tsx`:

```tsx
import type { Poem } from "@/lib/content";

export function FeaturedPoemCard({ poem }: { poem: Poem }) {
  return (
    <div className="relative overflow-hidden rounded-soft border border-gold-container/40 bg-obsidian-low p-8">
      <span className="font-label text-xs uppercase tracking-widest text-emerald">Destaque</span>
      <h3 className="mt-2 font-display text-2xl text-ink">{poem.title}</h3>
      <p className="mt-4 font-body text-ink/80">{poem.excerpt}</p>
      <a
        href={`/poemas/${poem.slug}`}
        className="mt-6 inline-block font-label text-sm uppercase tracking-wide text-gold transition-colors duration-organic-fast ease-organic hover:text-emerald"
      >
        Ler poema completo
      </a>
    </div>
  );
}
```

Create `components/home/TeaserCard.tsx`:

```tsx
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
```

Create `components/ui/QuoteBanner.tsx`:

```tsx
import { VineDivider } from "@/components/ui/ornaments/VineDivider";

export function QuoteBanner({ quote }: { quote: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <VineDivider />
      <p className="mx-auto max-w-2xl font-display text-2xl italic text-ink">&ldquo;{quote}&rdquo;</p>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- lib/content-home.test.ts components/poems/PoemListItem.test.tsx components/home/TeaserCard.test.tsx`
Expected: PASS (4 tests total)

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/content-paths.ts lib/types.ts lib/content-home.test.ts components/poems/PoemListItem.tsx components/poems/PoemListItem.test.tsx components/home/TeaserCard.tsx components/home/TeaserCard.test.tsx components/poems/FeaturedPoemCard.tsx components/ui/QuoteBanner.tsx
git commit -m "feat: add home content loader and PoemListItem/FeaturedPoemCard/TeaserCard/QuoteBanner"
```

---

### Task 16: Assemble the Home page

**Files:**
- Modify: `app/page.tsx`
- Test: `app/page.test.tsx`

**Interfaces:**
- Consumes: `getHomeContent`, `getAllPoems`, `getSiteSettings` (Task 7, 15), `Hero` (Task 14), `PoemListItem`, `FeaturedPoemCard`, `TeaserCard`, `QuoteBanner` (Task 15).

- [ ] **Step 1: Write the failing test**

Create `app/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the hero headline from real content", () => {
    render(<HomePage />);
    expect(screen.getByText("Florescem")).toBeInTheDocument();
  });

  it("renders a list of latest poems", () => {
    render(<HomePage />);
    expect(screen.getByText("Últimos Poemas")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /A Noite Também Escreve/ })).toBeInTheDocument();
  });

  it("renders the featured poem card", () => {
    render(<HomePage />);
    expect(screen.getByText("Destaque")).toBeInTheDocument();
  });

  it("renders About and Portfolio teaser cards", () => {
    render(<HomePage />);
    expect(screen.getByText("Sobre Mim")).toBeInTheDocument();
    expect(screen.getByText("Portfólio")).toBeInTheDocument();
  });

  it("renders the footer quote as a QuoteBanner", () => {
    render(<HomePage />);
    expect(screen.getByText(/eco da alma/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- app/page.test.tsx`
Expected: FAIL — `app/page.tsx` still has the `create-next-app` starter content.

- [ ] **Step 3: Write the implementation**

Replace `app/page.tsx`:

```tsx
import { getHomeContent, getAllPoems, getSiteSettings } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { PoemListItem } from "@/components/poems/PoemListItem";
import { FeaturedPoemCard } from "@/components/poems/FeaturedPoemCard";
import { TeaserCard } from "@/components/home/TeaserCard";
import { QuoteBanner } from "@/components/ui/QuoteBanner";

export default function HomePage() {
  const home = getHomeContent();
  const poems = getAllPoems();
  const settings = getSiteSettings();
  const latestPoems = poems.slice(0, 4);
  const featuredPoem = poems.find((poem) => poem.featured) ?? poems[0];

  return (
    <main>
      <Hero {...home} />

      <section className="grid gap-10 px-6 py-16 md:grid-cols-2 md:px-16">
        <div>
          <h2 className="font-display text-2xl text-gold">Últimos Poemas</h2>
          <ul className="mt-6 space-y-6">
            {latestPoems.map((poem) => (
              <PoemListItem key={poem.slug} poem={poem} />
            ))}
          </ul>
        </div>
        {featuredPoem ? <FeaturedPoemCard poem={featuredPoem} /> : null}
      </section>

      <section className="grid gap-8 px-6 py-16 md:grid-cols-2 md:px-16">
        <TeaserCard
          title="Sobre Mim"
          description="Apaixonada por palavras, natureza e tudo que toca a alma."
          cta={{ label: "Conhecer minha história", href: "/sobre" }}
        />
        <TeaserCard
          title="Portfólio"
          description="Além dos versos, exploro a criatividade em diferentes formas."
          cta={{ label: "Ver portfólio", href: "/portfolio" }}
        />
      </section>

      <QuoteBanner quote={settings.footerQuote} />
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- app/page.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Verify the real dev server renders it**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: page shows the two-column hero with the stained-glass illustration, latest poems list, featured card, About/Portfolio teasers, and quote banner — visually check it against the reference image, not against the Stitch screenshots.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: assemble Home page from Hero, poem list, featured card, teasers, quote banner"
```

---

### Task 17: Pagination and FilterChips

**Files:**
- Create: `components/ui/Pagination.tsx`, `components/ui/FilterChips.tsx`
- Test: `components/ui/Pagination.test.tsx`, `components/ui/FilterChips.test.tsx`

**Interfaces:**
- Produces: `<Pagination currentPage={number} totalPages={number} baseHref={string} />`; `<FilterChips options={{slug,label}[]} activeSlug={string} onSelect={(slug: string) => void} />`. Consumed by `CardGridPage` (Task 18).

- [ ] **Step 1: Write the failing tests**

Create `components/ui/Pagination.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("renders a link for every page", () => {
    render(<Pagination currentPage={1} totalPages={3} baseHref="/poemas" />);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/poemas?page=1");
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("href", "/poemas?page=2");
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("href", "/poemas?page=3");
  });

  it("marks the current page as aria-current", () => {
    render(<Pagination currentPage={2} totalPages={3} baseHref="/poemas" />);
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
  });

  it("renders nothing when there is only one page", () => {
    render(<Pagination currentPage={1} totalPages={1} baseHref="/poemas" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
```

Create `components/ui/FilterChips.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterChips } from "@/components/ui/FilterChips";

const options = [
  { slug: "sombras", label: "Sombras" },
  { slug: "luz", label: "Luz" },
];

describe("FilterChips", () => {
  it("marks the active chip with aria-pressed=true", () => {
    render(<FilterChips options={options} activeSlug="sombras" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Sombras" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Luz" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onSelect with the chip's slug when clicked", async () => {
    const onSelect = vi.fn();
    render(<FilterChips options={options} activeSlug="sombras" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Luz" }));
    expect(onSelect).toHaveBeenCalledWith("luz");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- components/ui/Pagination.test.tsx components/ui/FilterChips.test.tsx`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

Create `components/ui/Pagination.tsx`:

```tsx
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
```

Create `components/ui/FilterChips.tsx`:

```tsx
"use client";

type Option = { slug: string; label: string };

export function FilterChips({
  options,
  activeSlug,
  onSelect,
}: {
  options: Option[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = option.slug === activeSlug;
        return (
          <button
            key={option.slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(option.slug)}
            className={`rounded-full border px-4 py-1.5 font-label text-xs uppercase tracking-wide transition-all duration-organic-fast ease-organic ${
              isActive
                ? "border-gold bg-gold text-obsidian"
                : "border-ink/30 text-ink/70 hover:border-gold hover:text-gold"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- components/ui/Pagination.test.tsx components/ui/FilterChips.test.tsx`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add components/ui/Pagination.tsx components/ui/Pagination.test.tsx components/ui/FilterChips.tsx components/ui/FilterChips.test.tsx
git commit -m "feat: add Pagination and FilterChips components"
```

---

### Task 18: PoemCard, ProjectCard, and the shared CardGridPage template

**Files:**
- Create: `components/poems/PoemCard.tsx`, `components/portfolio/ProjectCard.tsx`, `components/templates/CardGridPage.tsx`
- Test: `components/poems/PoemCard.test.tsx`, `components/templates/CardGridPage.test.tsx`

**Interfaces:**
- Consumes: `Poem`/`Project` types (Task 7), `FilterChips`/`Pagination` (Task 17).
- Produces: `<CardGridPage items renderCard filterOptions activeFilter onFilterChange page totalPages baseHref />` — consumed by `app/poemas/page.tsx`, `app/categorias/[slug]/page.tsx`, `app/portfolio/page.tsx` (Tasks 19, 21).

**Design correction vs. Stitch:** Stitch's archive/portfolio grids are uniform, boxy, evenly-spaced cards — flat and monotonous. This template still uses a grid (necessary for scanability of a list) but every card gets a `VineDivider`-style top accent and asymmetric image aspect ratios (alternating tall/wide) via a `variant` index, avoiding the repetitive stamped-out look.

- [ ] **Step 1: Write the failing tests**

Create `components/poems/PoemCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PoemCard } from "@/components/poems/PoemCard";
import type { Poem } from "@/lib/content";

const poem: Poem = {
  title: "O Vitral Coroado",
  slug: "o-vitral-coroado",
  date: "2024-05-01",
  excerpt: "Excerto do poema.",
  category: "sombras",
  tags: ["a"],
  featured: false,
  published: true,
  coverImage: "/x.jpg",
  content: "corpo",
  readingTime: 3,
};

describe("PoemCard", () => {
  it("links to the poem and shows title, excerpt, and reading time", () => {
    render(<PoemCard poem={poem} />);
    expect(screen.getByRole("link", { name: /O Vitral Coroado/ })).toHaveAttribute(
      "href",
      "/poemas/o-vitral-coroado"
    );
    expect(screen.getByText("Excerto do poema.")).toBeInTheDocument();
    expect(screen.getByText(/3 min/)).toBeInTheDocument();
  });
});
```

Create `components/templates/CardGridPage.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardGridPage } from "@/components/templates/CardGridPage";

type Item = { id: string; name: string };

describe("CardGridPage", () => {
  const items: Item[] = [{ id: "1", name: "Item Um" }, { id: "2", name: "Item Dois" }];

  it("renders one card per item using the provided renderCard function", () => {
    render(
      <CardGridPage
        items={items}
        renderCard={(item) => <div key={item.id}>{item.name}</div>}
        filterOptions={[{ slug: "todos", label: "Todos" }]}
        activeFilter="todos"
        onFilterChange={vi.fn()}
        currentPage={1}
        totalPages={1}
        baseHref="/poemas"
      />
    );
    expect(screen.getByText("Item Um")).toBeInTheDocument();
    expect(screen.getByText("Item Dois")).toBeInTheDocument();
  });

  it("renders the filter chips", () => {
    render(
      <CardGridPage
        items={items}
        renderCard={(item) => <div key={item.id}>{item.name}</div>}
        filterOptions={[{ slug: "todos", label: "Todos" }]}
        activeFilter="todos"
        onFilterChange={vi.fn()}
        currentPage={1}
        totalPages={1}
        baseHref="/poemas"
      />
    );
    expect(screen.getByRole("button", { name: "Todos" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- components/poems/PoemCard.test.tsx components/templates/CardGridPage.test.tsx`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

Create `components/poems/PoemCard.tsx`:

```tsx
import type { Poem } from "@/lib/content";

export function PoemCard({ poem, variant = 0 }: { poem: Poem; variant?: number }) {
  const isTall = variant % 3 === 1;

  return (
    <article className="group overflow-hidden rounded-soft border border-gold-container/30 bg-obsidian-low transition-all duration-organic-base ease-organic hover:border-gold hover:shadow-[0_0_24px_rgba(242,202,80,0.15)]">
      <div className="h-1 bg-gradient-to-r from-gold via-emerald to-gold" aria-hidden="true" />
      <div className={isTall ? "aspect-[3/4]" : "aspect-[4/3]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poem.coverImage} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <span className="font-label text-xs uppercase tracking-wide text-emerald">{poem.category}</span>
        <h3 className="mt-2 font-display text-lg text-ink">
          <a href={`/poemas/${poem.slug}`} className="transition-colors duration-organic-fast ease-organic group-hover:text-gold">
            {poem.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-3 font-body text-sm text-ink/80">{poem.excerpt}</p>
        <div className="mt-4 flex items-center justify-between font-label text-xs text-ink/60">
          <span>{poem.readingTime} min de leitura</span>
          <a href={`/poemas/${poem.slug}`} className="text-gold hover:text-emerald">
            Ler mais
          </a>
        </div>
      </div>
    </article>
  );
}
```

Create `components/portfolio/ProjectCard.tsx`:

```tsx
import type { Project } from "@/lib/content";

export function ProjectCard({ project, variant = 0 }: { project: Project; variant?: number }) {
  const isTall = variant % 3 === 1;

  return (
    <article className="group overflow-hidden rounded-soft border border-gold-container/30 bg-obsidian-low transition-all duration-organic-base ease-organic hover:border-gold hover:shadow-[0_0_24px_rgba(242,202,80,0.15)]">
      <div className="h-1 bg-gradient-to-r from-emerald via-gold to-emerald" aria-hidden="true" />
      <div className={isTall ? "aspect-[3/4]" : "aspect-[4/3]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <span className="font-label text-xs uppercase tracking-wide text-emerald">{project.category}</span>
        <h3 className="mt-2 font-display text-lg text-ink">
          <a href={`/portfolio/${project.slug}`} className="transition-colors duration-organic-fast ease-organic group-hover:text-gold">
            {project.title}
          </a>
        </h3>
        <p className="mt-2 line-clamp-3 font-body text-sm text-ink/80">{project.excerpt}</p>
        <a href={`/portfolio/${project.slug}`} className="mt-4 inline-block font-label text-xs text-gold hover:text-emerald">
          Ver projeto
        </a>
      </div>
    </article>
  );
}
```

Create `components/templates/CardGridPage.tsx`:

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- components/poems/PoemCard.test.tsx components/templates/CardGridPage.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add components/poems/PoemCard.tsx components/poems/PoemCard.test.tsx components/portfolio/ProjectCard.tsx components/templates/CardGridPage.tsx components/templates/CardGridPage.test.tsx
git commit -m "feat: add PoemCard, ProjectCard, and shared CardGridPage template"
```

---

### Task 19: Search index build script + SearchBar/SearchOverlay

**Files:**
- Create: `scripts/build-search-index.mjs`
- Modify: `package.json` (add `prebuild` script)
- Create: `components/search/SearchBar.tsx`, `components/search/SearchOverlay.tsx`
- Test: `components/search/SearchBar.test.tsx`

**Interfaces:**
- Consumes: `buildSearchIndex` (Task 8), `getAllPoems`/`getAllProjects` (Task 7).
- Produces: `public/search-index.json` (static file fetched client-side); `<SearchBar />` (inline bar on archive pages); `<SearchOverlay />` (Cmd/Ctrl+K global overlay, mounted once in `app/layout.tsx`).

- [ ] **Step 1: Write the failing test**

Create `components/search/SearchBar.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/search/SearchBar";

const index = [
  { title: "Entre Silêncios e Suspiros", excerpt: "...", tags: ["silêncio"], url: "/poemas/a", type: "poem" as const },
  { title: "Cartas que Nunca Enviei", excerpt: "...", tags: ["saudade"], url: "/poemas/b", type: "poem" as const },
];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ json: () => Promise.resolve(index) })
  );
});

describe("SearchBar", () => {
  it("shows matching results as the user types", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "Silêncios");
    expect(await screen.findByRole("link", { name: /Entre Silêncios e Suspiros/ })).toBeInTheDocument();
    expect(screen.queryByText("Cartas que Nunca Enviei")).not.toBeInTheDocument();
  });

  it("shows no results message for a query that matches nothing", async () => {
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "xyz-nao-existe");
    expect(await screen.findByText(/Nenhum resultado/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- components/search/SearchBar.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

Create `scripts/build-search-index.mjs`:

```javascript
import fs from "fs";
import path from "path";
import { register } from "ts-node";

register({ transpileOnly: true, compilerOptions: { module: "commonjs" } });

const { getAllPoems, getAllProjects } = require("../lib/content.ts");
const { buildSearchIndex } = require("../lib/search-index.ts");

const index = buildSearchIndex(getAllPoems(), getAllProjects());
const outPath = path.join(process.cwd(), "public/search-index.json");
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
console.log(`Wrote ${index.length} entries to ${outPath}`);
```

Add to `package.json` `scripts`:

```json
"prebuild": "node scripts/build-search-index.mjs"
```

Create `components/search/SearchBar.tsx`:

```tsx
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
        role="searchbox"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar poemas e projetos..."
        className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 font-body text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
      />
      {query.trim() ? (
        <ul className="mt-3 space-y-2">
          {results.length === 0 ? (
            <li className="font-body text-sm text-ink/60">Nenhum resultado encontrado.</li>
          ) : (
            results.map((result) => (
              <li key={result.url}>
                <a href={result.url} className="font-body text-ink hover:text-gold">
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
```

Create `components/search/SearchOverlay.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- components/search/SearchBar.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Verify the prebuild script runs**

Run: `npm run prebuild`
Expected: prints `Wrote 5 entries to .../public/search-index.json` (3 poems + 2 projects from Task 10).

- [ ] **Step 6: Commit**

```bash
git add scripts/build-search-index.mjs package.json components/search/SearchBar.tsx components/search/SearchOverlay.tsx components/search/SearchBar.test.tsx
git commit -m "feat: add static search index build script and SearchBar/SearchOverlay"
```

---

### Task 20: Poems Archive page (`/poemas`) and Category page (`/categorias/[slug]`)

**Files:**
- Create: `app/poemas/page.tsx`, `app/categorias/[slug]/page.tsx`
- Test: `app/poemas/page.test.tsx`

**Interfaces:**
- Consumes: `getAllPoems`, `getCategories` (Task 7), `CardGridPage`, `PoemCard` (Task 18), `SearchBar` (Task 19).

- [ ] **Step 1: Write the failing test**

Create `app/poemas/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PoemasPage from "@/app/poemas/page";

describe("PoemasPage", () => {
  it("renders the page title and a card for every published poem", () => {
    render(<PoemasPage searchParams={{}} />);
    expect(screen.getByRole("heading", { name: /poemas/i })).toBeInTheDocument();
    expect(screen.getByText("Entre Silêncios e Suspiros")).toBeInTheDocument();
    expect(screen.getByText("A Noite Também Escreve")).toBeInTheDocument();
    expect(screen.getByText("Cartas que Nunca Enviei")).toBeInTheDocument();
  });

  it("includes a search bar", () => {
    render(<PoemasPage searchParams={{}} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- app/poemas/page.test.tsx`
Expected: FAIL — `app/poemas/page.tsx` doesn't exist.

- [ ] **Step 3: Implement**

Create `app/poemas/page.tsx`:

```tsx
import { getAllPoems, getCategories } from "@/lib/content";
import { PoemCard } from "@/components/poems/PoemCard";
import { SearchBar } from "@/components/search/SearchBar";

const PAGE_SIZE = 9;

export default function PoemasPage({ searchParams }: { searchParams: { page?: string; categoria?: string } }) {
  const allPoems = getAllPoems();
  const categories = getCategories();
  const activeCategory = searchParams.categoria ?? "todos";
  const filtered = activeCategory === "todos" ? allPoems : allPoems.filter((poem) => poem.category === activeCategory);

  const currentPage = Number(searchParams.page ?? "1");
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filterOptions = [{ slug: "todos", label: "Todos" }, ...categories.map((c) => ({ slug: c.slug, label: c.label }))];

  return (
    <main className="px-6 py-12 md:px-16">
      <h1 className="font-display text-3xl text-gold">Poemas</h1>
      <p className="mt-2 max-w-xl font-body text-ink/80">
        Uma coleção de versos moldados em sombras, luz e todo o sentimento que existe entre elas.
      </p>
      <div className="mt-6 max-w-md">
        <SearchBar />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {filterOptions.map((option) => (
          <a
            key={option.slug}
            href={option.slug === "todos" ? "/poemas" : `/categorias/${option.slug}`}
            className={`rounded-full border px-4 py-1.5 font-label text-xs uppercase tracking-wide ${
              option.slug === activeCategory ? "border-gold bg-gold text-obsidian" : "border-ink/30 text-ink/70 hover:border-gold hover:text-gold"
            }`}
          >
            {option.label}
          </a>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {pageItems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </main>
  );
}
```

Create `app/categorias/[slug]/page.tsx`:

```tsx
import { getAllPoems, getCategories } from "@/lib/content";
import { PoemCard } from "@/components/poems/PoemCard";

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export default function CategoriaPage({ params }: { params: { slug: string } }) {
  const categories = getCategories();
  const category = categories.find((c) => c.slug === params.slug);
  const poems = getAllPoems().filter((poem) => poem.category === params.slug);

  return (
    <main className="px-6 py-12 md:px-16">
      <h1 className="font-display text-3xl text-gold">{category?.label ?? params.slug}</h1>
      <p className="mt-2 max-w-xl font-body text-ink/80">{category?.description}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {poems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- app/poemas/page.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add app/poemas/ app/categorias/
git commit -m "feat: add Poems Archive and Category pages"
```

---

### Task 21: Poem Detail page + RelatedPoems + GiscusComments

**Files:**
- Create: `app/poemas/[slug]/page.tsx`, `components/poems/RelatedPoems.tsx`, `components/comments/GiscusComments.tsx`, `components/templates/DetailPage.tsx`
- Test: `app/poemas/[slug]/page.test.tsx`, `components/comments/GiscusComments.test.tsx`

**Interfaces:**
- Consumes: `getPoemBySlug`, `getAllPoems`, `getRelatedPoems`, `getSiteSettings` (Task 7), `buildPoemMetadata`/`buildPoemJsonLd` (Task 9).

- [ ] **Step 1: Write the failing tests**

Create `components/comments/GiscusComments.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GiscusComments } from "@/components/comments/GiscusComments";

describe("GiscusComments", () => {
  it("configures the giscus script with the repo and category from settings", () => {
    render(<GiscusComments repo="owner/repo" category="Poemas" />);
    const script = document.querySelector("script[data-repo]");
    expect(script).toHaveAttribute("data-repo", "owner/repo");
    expect(script).toHaveAttribute("data-category", "Poemas");
  });
});
```

Create `app/poemas/[slug]/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PoemDetailPage from "@/app/poemas/[slug]/page";

describe("PoemDetailPage", () => {
  it("renders the poem title and body", async () => {
    const Page = await PoemDetailPage({ params: { slug: "entre-silencios-e-suspiros" } });
    render(Page as React.ReactElement);
    expect(screen.getByRole("heading", { name: "Entre Silêncios e Suspiros" })).toBeInTheDocument();
  });

  it("renders related poems from the same category", async () => {
    const Page = await PoemDetailPage({ params: { slug: "entre-silencios-e-suspiros" } });
    render(Page as React.ReactElement);
    expect(screen.getByText("A Noite Também Escreve")).toBeInTheDocument();
  });

  it("renders the comments section", async () => {
    const Page = await PoemDetailPage({ params: { slug: "entre-silencios-e-suspiros" } });
    render(Page as React.ReactElement);
    expect(document.querySelector("script[data-repo]")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- components/comments/GiscusComments.test.tsx app/poemas/[slug]/page.test.tsx`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

Create `components/comments/GiscusComments.tsx`:

```tsx
"use client";

export function GiscusComments({ repo, category }: { repo: string; category: string }) {
  return (
    <div
      ref={(node) => {
        if (!node || node.childElementCount > 0) return;
        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.setAttribute("data-repo", repo);
        script.setAttribute("data-category", category);
        script.setAttribute("data-mapping", "pathname");
        script.setAttribute("data-theme", "noborder_dark");
        node.appendChild(script);
      }}
    />
  );
}
```

Create `components/poems/RelatedPoems.tsx`:

```tsx
import { PoemCard } from "@/components/poems/PoemCard";
import type { Poem } from "@/lib/content";

export function RelatedPoems({ poems }: { poems: Poem[] }) {
  if (poems.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-xl text-gold">Outros Sussurros</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {poems.map((poem, index) => (
          <PoemCard key={poem.slug} poem={poem} variant={index} />
        ))}
      </div>
    </section>
  );
}
```

Create `components/templates/DetailPage.tsx`:

```tsx
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
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mt-2 font-label text-xs uppercase tracking-wide text-ink/60">{meta}</p>
      <div className="prose prose-invert mt-8 max-w-none font-body text-lg leading-relaxed text-ink/90">
        {children}
      </div>
    </article>
  );
}
```

Create `app/poemas/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getAllPoems, getPoemBySlug, getRelatedPoems, getSiteSettings } from "@/lib/content";
import { buildPoemMetadata, buildPoemJsonLd } from "@/lib/seo";
import { DetailPage } from "@/components/templates/DetailPage";
import { RelatedPoems } from "@/components/poems/RelatedPoems";
import { GiscusComments } from "@/components/comments/GiscusComments";

export function generateStaticParams() {
  return getAllPoems().map((poem) => ({ slug: poem.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const poem = getPoemBySlug(params.slug);
  if (!poem) return {};
  return buildPoemMetadata(poem, getSiteSettings());
}

export default function PoemDetailPage({ params }: { params: { slug: string } }) {
  const poem = getPoemBySlug(params.slug);
  if (!poem) notFound();

  const settings = getSiteSettings();
  const related = getRelatedPoems(poem, getAllPoems(), 3);
  const jsonLd = buildPoemJsonLd(poem, settings);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DetailPage title={poem.title} meta={`${poem.date} · ${poem.readingTime} min de leitura`}>
        {poem.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </DetailPage>
      <div className="mx-auto max-w-2xl px-6">
        <RelatedPoems poems={related} />
        <section className="mt-16">
          <h2 className="font-display text-xl text-gold">Reflexões</h2>
          <GiscusComments repo={settings.giscus.repo} category={settings.giscus.category} />
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- components/comments/GiscusComments.test.tsx app/poemas/[slug]/page.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add components/comments/ components/poems/RelatedPoems.tsx components/templates/DetailPage.tsx app/poemas/\[slug\]/
git commit -m "feat: add Poem Detail page with related poems and Giscus comments"
```

---

### Task 22: Portfolio grid + Project Detail page

**Files:**
- Create: `app/portfolio/page.tsx`, `app/portfolio/[slug]/page.tsx`, `components/portfolio/FeaturedProjectCard.tsx`
- Test: `app/portfolio/page.test.tsx`, `app/portfolio/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `getAllProjects`, `getProjectBySlug` (Task 7), `ProjectCard` (Task 18), `CardGridPage`/`DetailPage` templates (Task 18, 21), `buildProjectMetadata`/`buildProjectJsonLd` (Task 9).

- [ ] **Step 1: Write the failing tests**

Create `app/portfolio/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PortfolioPage from "@/app/portfolio/page";

describe("PortfolioPage", () => {
  it("renders a card for every published project", () => {
    render(<PortfolioPage searchParams={{}} />);
    expect(screen.getByText("Lamento Celeste")).toBeInTheDocument();
    expect(screen.getByText("Sussurros da Palavra")).toBeInTheDocument();
  });
});
```

Create `app/portfolio/[slug]/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectDetailPage from "@/app/portfolio/[slug]/page";

describe("ProjectDetailPage", () => {
  it("renders the project title and body", () => {
    const Page = ProjectDetailPage({ params: { slug: "lamento-celeste" } });
    render(Page as React.ReactElement);
    expect(screen.getByRole("heading", { name: "Lamento Celeste" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- app/portfolio/page.test.tsx "app/portfolio/[slug]/page.test.tsx"`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

Create `components/portfolio/FeaturedProjectCard.tsx`:

```tsx
import type { Project } from "@/lib/content";

export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <div className="grid gap-6 rounded-soft border border-gold-container/40 bg-obsidian-low p-8 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.coverImage} alt="" className="h-full w-full rounded-soft object-cover" />
      <div>
        <span className="font-label text-xs uppercase tracking-widest text-emerald">Projeto em Destaque</span>
        <h3 className="mt-2 font-display text-2xl text-ink">{project.title}</h3>
        <p className="mt-4 font-body text-ink/80">{project.excerpt}</p>
        <a href={`/portfolio/${project.slug}`} className="mt-6 inline-block font-label text-sm uppercase tracking-wide text-gold hover:text-emerald">
          Ver projeto completo
        </a>
      </div>
    </div>
  );
}
```

Create `app/portfolio/page.tsx`:

```tsx
import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { FeaturedProjectCard } from "@/components/portfolio/FeaturedProjectCard";

export default function PortfolioPage({ searchParams }: { searchParams: { page?: string } }) {
  const projects = getAllProjects();
  const featured = projects.find((project) => project.featured);
  const rest = projects.filter((project) => project.slug !== featured?.slug);

  return (
    <main className="px-6 py-12 md:px-16">
      <h1 className="font-display text-3xl text-gold">Portfólio Criativo</h1>
      <p className="mt-2 max-w-xl font-body text-ink/80">
        Uma seleção de ilustrações, manuscritos e outras formas de expressão artística.
      </p>
      {featured ? (
        <div className="mt-8">
          <FeaturedProjectCard project={featured} />
        </div>
      ) : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((project, index) => (
          <ProjectCard key={project.slug} project={project} variant={index} />
        ))}
      </div>
    </main>
  );
}
```

Create `app/portfolio/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, getSiteSettings } from "@/lib/content";
import { buildProjectMetadata, buildProjectJsonLd } from "@/lib/seo";
import { DetailPage } from "@/components/templates/DetailPage";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return buildProjectMetadata(project, getSiteSettings());
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const jsonLd = buildProjectJsonLd(project, getSiteSettings());

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DetailPage title={project.title} meta={project.date}>
        {project.content.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </DetailPage>
    </main>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- app/portfolio/page.test.tsx "app/portfolio/[slug]/page.test.tsx"`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add app/portfolio/ components/portfolio/FeaturedProjectCard.tsx
git commit -m "feat: add Portfolio grid and Project Detail pages"
```

---

### Task 23: About page, Contact page, root layout wiring, theme toggle

**Files:**
- Create: `app/sobre/page.tsx`, `app/contato/page.tsx`
- Create: `components/layout/ThemeToggle.tsx`
- Modify: `app/layout.tsx` (mount `Header`, `Footer`, `ThemeProvider`, `SearchOverlay`)
- Test: `components/layout/ThemeToggle.test.tsx`, `app/sobre/page.test.tsx`

**Interfaces:**
- Consumes: `getSiteSettings` (Task 7), `Header`/`Footer` (Task 12/13), `next-themes`.

- [ ] **Step 1: Write the failing tests**

Create `components/layout/ThemeToggle.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

describe("ThemeToggle", () => {
  it("toggles the html class between dark and light on click", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button", { name: /alternar tema/i });
    await userEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
```

Create `app/sobre/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SobrePage from "@/app/sobre/page";

describe("SobrePage", () => {
  it("renders the about page title and body", () => {
    render(<SobrePage />);
    expect(screen.getByRole("heading", { name: "Sobre Mim" })).toBeInTheDocument();
    expect(screen.getByText(/Apaixonada por palavras/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- components/layout/ThemeToggle.test.tsx app/sobre/page.test.tsx`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

Create `components/layout/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Alternar tema"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-soft p-2 text-ink/70 transition-colors duration-organic-fast ease-organic hover:text-gold"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
```

Create `app/sobre/page.tsx` (reads the About MDX body directly via `parseMdxFile`, kept simple since there's exactly one about page — no need for a full `getAllX` loader for a singleton):

```tsx
import path from "path";
import { parseMdxFile } from "@/lib/mdx";
import { z } from "zod";
import { ArchFrame } from "@/components/ui/ornaments/ArchFrame";

const AboutFrontmatterSchema = z.object({ title: z.string() });

export default function SobrePage() {
  const filePath = path.join(process.cwd(), "content/pages/about.mdx");
  const { frontmatter, content } = parseMdxFile(filePath, AboutFrontmatterSchema);

  return (
    <main className="mx-auto grid max-w-3xl gap-10 px-6 py-16 md:grid-cols-[1fr_2fr] md:items-start">
      <ArchFrame>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-portrait.jpg" alt="Retrato da autora" className="h-full w-full object-cover" />
      </ArchFrame>
      <div>
        <h1 className="font-display text-3xl text-gold">{frontmatter.title}</h1>
        <div className="mt-6 font-body text-lg leading-relaxed text-ink/90">
          {content.trim().split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
```

Create `app/contato/page.tsx`:

```tsx
import { getSiteSettings } from "@/lib/content";

export default function ContatoPage() {
  const settings = getSiteSettings();

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-3xl text-gold">Contato</h1>
      <p className="mt-2 font-body text-ink/80">Envie uma mensagem ou entre em contato pelas redes sociais.</p>
      {settings.contactFormEndpoint ? (
        <form action={settings.contactFormEndpoint} method="POST" className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            required
            className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 text-ink"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            required
            className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 text-ink"
          />
          <textarea
            name="message"
            placeholder="Sua mensagem"
            required
            rows={5}
            className="w-full rounded-soft border border-ink/30 bg-obsidian-low px-4 py-2 text-ink"
          />
          <button type="submit" className="rounded-soft border border-gold bg-gold px-6 py-3 font-label text-sm uppercase tracking-wide text-obsidian">
            Enviar
          </button>
        </form>
      ) : (
        <p className="mt-8 font-body text-ink/80">
          Escreva para{" "}
          <a href={`mailto:contato@versos.example`} className="text-gold underline">
            contato@versos.example
          </a>
          .
        </p>
      )}
    </main>
  );
}
```

Modify `app/layout.tsx`:

```tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { playfairDisplay, ebGaramond, hankenGrotesk } from "@/lib/fonts";
import { getSiteSettings } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export const metadata = {
  title: "Versos",
  description: "Palavras que florescem — poesia e portfólio criativo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${ebGaramond.variable} ${hankenGrotesk.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header nav={settings.nav} siteTitle={settings.siteTitle} />
          {children}
          <Footer settings={settings} />
          <SearchOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- components/layout/ThemeToggle.test.tsx app/sobre/page.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Run the full test suite**

Run: `npm run test`
Expected: all tests across every task pass.

- [ ] **Step 6: Commit**

```bash
git add app/sobre/ app/contato/ app/layout.tsx components/layout/ThemeToggle.tsx components/layout/ThemeToggle.test.tsx
git commit -m "feat: add About/Contact pages, theme toggle, and wire root layout"
```

---

### Task 24: RSS feed, sitemap, robots.txt

**Files:**
- Create: `app/feed.xml/route.ts`, `app/sitemap.ts`, `app/robots.ts`
- Test: `app/feed.xml/route.test.ts`

**Interfaces:**
- Consumes: `getAllPoems`, `getSiteSettings` (Task 7).

- [ ] **Step 1: Write the failing test**

Create `app/feed.xml/route.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { GET } from "@/app/feed.xml/route";

describe("RSS feed route", () => {
  it("returns XML containing every published poem title", async () => {
    const response = await GET();
    const body = await response.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("Entre Silêncios e Suspiros");
    expect(body).toContain("A Noite Também Escreve");
  });

  it("sets the content type to application/rss+xml", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- app/feed.xml/route.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

Create `app/feed.xml/route.ts`:

```typescript
import { getAllPoems, getSiteSettings } from "@/lib/content";

const SITE_URL = "https://versos.example";

export async function GET() {
  const poems = getAllPoems();
  const settings = getSiteSettings();

  const items = poems
    .map(
      (poem) => `
    <item>
      <title>${poem.title}</title>
      <link>${SITE_URL}/poemas/${poem.slug}</link>
      <guid>${SITE_URL}/poemas/${poem.slug}</guid>
      <pubDate>${new Date(poem.date).toUTCString()}</pubDate>
      <description>${poem.excerpt}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${settings.siteTitle}</title>
    <link>${SITE_URL}</link>
    <description>${settings.tagline}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}
```

Create `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { getAllPoems, getAllProjects, getCategories } from "@/lib/content";

const SITE_URL = "https://versos.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/poemas", "/portfolio", "/sobre", "/contato"].map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  const poemRoutes = getAllPoems().map((poem) => ({ url: `${SITE_URL}/poemas/${poem.slug}` }));
  const projectRoutes = getAllProjects().map((project) => ({ url: `${SITE_URL}/portfolio/${project.slug}` }));
  const categoryRoutes = getCategories().map((category) => ({ url: `${SITE_URL}/categorias/${category.slug}` }));

  return [...staticRoutes, ...poemRoutes, ...projectRoutes, ...categoryRoutes];
}
```

Create `app/robots.ts`:

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://versos.example/sitemap.xml",
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- app/feed.xml/route.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add app/feed.xml/ app/sitemap.ts app/robots.ts
git commit -m "feat: add RSS feed, sitemap, and robots.txt"
```

---

### Task 25: Scroll-reveal hook + not-found page

**Files:**
- Create: `lib/use-in-view.ts`, `app/not-found.tsx`
- Test: `lib/use-in-view.test.ts`

**Interfaces:**
- Produces: `useInView<T extends HTMLElement>(): { ref: RefObject<T>; isVisible: boolean }`, applied by wrapping key sections (Hero already visible on load so it's skipped there; apply to the poem-list/featured-card section on Home and to card grids on archive pages) with a small client wrapper that toggles opacity/translate classes.

- [ ] **Step 1: Write the failing test**

Create `lib/use-in-view.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInView } from "@/lib/use-in-view";

describe("useInView", () => {
  it("starts as not visible, then becomes visible once observed (mocked IntersectionObserver fires immediately)", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.isVisible).toBe(true);
  });
});
```

Install the renderHook helper if not already present via `@testing-library/react` (it is, from v14+).

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/use-in-view.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement**

Create `lib/use-in-view.ts`:

```typescript
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
```

Create `app/not-found.tsx`:

```tsx
export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-gold">Página Perdida</h1>
      <p className="mt-4 max-w-md font-body text-ink/80">
        Este verso parece ter se perdido entre as sombras. Volte para continuar a leitura.
      </p>
      <a href="/" className="mt-8 rounded-soft border border-gold bg-gold px-6 py-3 font-label text-sm uppercase tracking-wide text-obsidian">
        Voltar ao Início
      </a>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- lib/use-in-view.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add lib/use-in-view.ts app/not-found.tsx
git commit -m "feat: add scroll-reveal hook and 404 page"
```

---

### Task 26: Documentation (README, CONTENT_GUIDE, decisions log)

**Files:**
- Create: `README.md`, `CONTENT_GUIDE.md`, `docs/decisions.md`

**Interfaces:**
- Consumes: nothing (documentation only). This task exists precisely because [[documentation-sync]] requires these to exist and stay accurate — write them now, against the real schemas from Task 4/10, not aspirational ones.

- [ ] **Step 1: Write `README.md`**

```markdown
# Versos

Poetry blog and creative portfolio. Static Next.js site — content lives in `/content`, code never contains poem/project text.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm run test
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

`prebuild` regenerates `public/search-index.json` from current content automatically.

## Deployment

Push to `main` on GitHub — Vercel auto-deploys. No environment variables required for the base site; see `content/settings.yaml` for the Giscus repo/category used for poem comments.

## Adding content

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) — written for the site owner, not developers.
```

- [ ] **Step 2: Write `CONTENT_GUIDE.md`**

```markdown
# Guia de Conteúdo

Como adicionar um novo poema ou projeto ao site, sem precisar mexer em código.

## Adicionar um poema

1. Copie `content/_templates/poem.mdx`.
2. Cole em `content/poems/` com um novo nome de arquivo (use `-` entre palavras, sem acentos, ex: `nome-do-poema.mdx`).
3. Preencha os campos no topo do arquivo (entre `---`):
   - `title`: título do poema
   - `slug`: precisa ser igual ao nome do arquivo, sem `.mdx`
   - `date`: no formato AAAA-MM-DD
   - `excerpt`: frase curta que aparece nas listagens
   - `category`: uma das categorias existentes em `content/categories.yaml` (sombras, luz, ilustracao, manuscrito)
   - `tags`: lista de palavras-chave
   - `featured`: `true` para destacar na página inicial
   - `published`: `false` enquanto for rascunho, `true` para publicar
   - `coverImage`: caminho da imagem de capa (envie a imagem para `public/images/poems/`)
4. Escreva o poema abaixo da segunda linha `---`.
5. Salve, faça commit e envie (push) para o GitHub. O site é atualizado automaticamente em alguns minutos.

## Adicionar um projeto de portfólio

Mesmo processo, usando `content/_templates/project.mdx` e salvando em `content/projects/`.

## Editar textos gerais do site

- Textos da página inicial: `content/pages/home.yaml`
- Texto da página Sobre: `content/pages/about.mdx`
- Nome do site, menu de navegação, redes sociais, frase do rodapé: `content/settings.yaml`
- Lista de categorias: `content/categories.yaml`

## O que NÃO editar

Nada dentro de `/app`, `/components`, ou `/lib` — esses são arquivos de código. Editar apenas o que estiver dentro de `/content`.
```

- [ ] **Step 3: Write `docs/decisions.md`**

```markdown
# Architecture Decisions

## ADR-001: MDX over plain Markdown

**Decision:** Use MDX (via `next-mdx-remote`) even though poems/projects are currently plain prose.
**Reason:** Keeps the door open for embedding a component (e.g. a pull-quote or image gallery) inside a poem/project body later without a content-format migration. Cost today is zero — plain Markdown is valid MDX.

## ADR-002: No CMS (Decap or otherwise)

**Decision:** Owner edits `.mdx`/`.yaml` files directly on GitHub.
**Reason:** Owner is comfortable with GitHub's web editor. A CMS admin UI (Decap) would need a GitHub OAuth app and adds a maintenance surface with no clear benefit at this content volume. Revisit if content volume or editor comfort changes.

## ADR-003: No animation library

**Decision:** All motion (fades, glides, hover glow, scroll-reveal) is implemented with CSS transitions/keyframes plus one ~20-line `useInView` hook — no Framer Motion or similar.
**Reason:** Every effect specified in the design brief is achievable in CSS. Adding a JS animation library would work against the "minimal JS" performance goal for no functional gain at this scope.

## ADR-004: Static Fuse.js search index, no server-side search

**Decision:** Search runs entirely client-side against a JSON index built at compile time (`scripts/build-search-index.mjs`).
**Reason:** Content volume is small (poems + portfolio items, likely low hundreds at most), so a static index is both simpler and faster than any server round-trip, and preserves the "no backend" constraint.
```

- [ ] **Step 4: Commit**

```bash
git add README.md CONTENT_GUIDE.md docs/decisions.md
git commit -m "docs: add README, CONTENT_GUIDE, and initial decisions log"
```

---

### Task 27: Full verification pass and Vercel deployment

**Files:** none created — this task runs checks against everything built in Tasks 1-26.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: every test across all 26 prior tasks passes.

- [ ] **Step 2: Run a full production build**

Run: `npm run build`
Expected: build succeeds, every route in the File Structure section is statically generated (check the build output's route table — every page should show as `○ (Static)` or `● (SSG)`, none as `λ (Server)`).

- [ ] **Step 3: Manual visual QA against the reference image**

Run: `npm run dev`, open `http://localhost:3000`.

Check against `file_00000000da9071f58c4221c7de09f80c.png` (not the Stitch screenshots):
- [ ] Hero is two-column (headline+CTAs left, stained-glass arch illustration right) — not stacked
- [ ] "Últimos Poemas" list uses rose-bullet icons, not plain bullets
- [ ] Featured poem card and About/Portfolio teaser cards are present and styled per the gold/emerald/obsidian palette
- [ ] Quote banner appears above the footer with a vine divider
- [ ] Resize to mobile width (375px) — header collapses to hamburger, hero stacks to single column, grids collapse to 1 column
- [ ] Toggle theme — light mode ("Aged Parchment") is legible and matches the palette's light variant
- [ ] Check `prefers-reduced-motion` in browser dev tools — transitions should disable

- [ ] **Step 4: Lighthouse pass**

Run Chrome DevTools Lighthouse (or `npx lighthouse http://localhost:3000 --view` against a production build served locally via `npm run build && npm run start`).
Expected: Performance/Accessibility/Best Practices/SEO all 90+, ideally 95+. Note any failures and fix before deploying (common culprits: missing image `alt`, missing `viewport` meta — Next.js sets this by default).

- [ ] **Step 5: Push to GitHub and connect Vercel**

```bash
git remote add origin <the owner's GitHub repo URL>
git push -u origin main
```

Then in the Vercel dashboard: "Add New Project" → import the GitHub repo → framework preset auto-detects Next.js → Deploy. No environment variables needed.

- [ ] **Step 6: Smoke-test the edit-on-GitHub workflow end to end**

On GitHub, edit `content/poems/entre-silencios-e-suspiros.mdx`'s `excerpt` field directly in the web UI, commit to `main`. Confirm Vercel starts a new deployment automatically and the live site reflects the change within a few minutes.

- [ ] **Step 7: Update `content/settings.yaml`'s Giscus repo field**

Replace `REPLACE_WITH_owner/repo` with the real GitHub repo, and enable GitHub Discussions on that repo (Settings → Features → Discussions) with a "Poemas" category — Giscus requires Discussions to be enabled or comments won't load.

```bash
git add content/settings.yaml
git commit -m "chore: point Giscus config at the real repository"
git push
```

---

## Self-Review Notes

- **Spec coverage:** every numbered section of the design spec (§3 stack, §4 folder structure, §5 component hierarchy, §6 content architecture, §7 routing, §8 motion, §9 features triage, §10 perf/SEO/a11y, §11 deployment, §12 docs) has a corresponding task above. §13's roadmap phases 0-7 map directly to Tasks 1-3 (phase 0), 4-10 (phase 1), 15-16/20-21 (phase 2), 22 (phase 3), 24-25 (phase 4), 21/23 (phase 5, comments+contact), 27 (phase 6+7, polish+deploy).
- **Design-fidelity requirement:** explicitly called out in Global Constraints and in Tasks 11, 14, and 18 where Stitch's actual output would have been the naive default (flat dividers/stock photos, stacked hero, boxy uniform grid) — each task states the specific correction.
- **Type consistency check:** `Poem` (Task 7) is used identically across Tasks 8, 9, 15-21; `SiteSettings` (Task 4) flows unchanged from `getSiteSettings()` (Task 7) into `Header`/`Footer` (Task 12/13, 23) and `GiscusComments` (Task 21). No renamed fields found between definition and usage.
