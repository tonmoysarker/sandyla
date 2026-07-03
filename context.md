# Context — Versos Poetry Portfolio

## What this is

Static Next.js poetry blog + creative portfolio for a non-developer owner who edits content directly on GitHub. Visual source of truth (per owner, 2026-07-03 refinement): the Google Stitch **"Stained Verse Design System"** project (`projects/14183640873297549245`) — its "Nocturne & Filigree" designMd carries the canonical tokens (dark "Obsidian Night": gold `#f2ca50`/`#d4af37` primary, emerald `#95d3ba`/`#0b513d` secondary; light "Aged Parchment": charcoal ink, velvet-crimson accent, bronze filigree). The Stitch *screens* drifted to a teal palette — trust the designMd tokens, not screen colors; screens are still the reference for ornament/layout vocabulary.

## Status: DESIGN REFINEMENT SHIPPED (2026-07-03, second deploy)

- **Production: https://sandy-portfolio-mu.vercel.app** — verified live (commit `28a2afe`)
- Two completed phases, both merged to `main`, feature branches deleted:
  1. Initial build — 27-task plan
  2. Design/UX refinement — 12-task plan (`docs/superpowers/plans/2026-07-03-design-refinement.md`): Giscus removed, semantic two-theme tokens, Utopia fluid type/space, working theme toggle, icon set, stained-glass header, 3-col footer, ornaments/motion/reading experience
- 73 tests passing (Vitest 4 + Testing Library + jsdom), build fully static (○/● only, 21 pages)
- Both themes screenshot-verified (desktop + mobile) via playwright-core + system Chrome before merge

## Key docs

- `docs/superpowers/specs/2026-07-03-poetry-portfolio-design.md` — original design spec
- `docs/superpowers/plans/2026-07-03-poetry-portfolio-implementation.md` — executed 27-task build plan
- `docs/superpowers/plans/2026-07-03-design-refinement.md` — executed 12-task refinement plan
- `docs/decisions.md` — ADR-001..007
- `CONTENT_GUIDE.md` — owner-facing content workflow (Portuguese)
- `README.md` — dev/test/build/deploy + design-system rules

## Decisions locked

- Next.js 14 App Router + TS + Tailwind + MDX, pure SSG, zero DB/API routes
- Portuguese only; **no comments** (Giscus removed 2026-07-03, ADR-006); no newsletter; no CMS (GitHub web editor)
- Motion CSS-only (+ tiny useInView/ReadingProgress hooks), respects `prefers-reduced-motion`
- Design tokens: semantic CSS vars in `app/globals.css` (`:root` = light Aged Parchment / `.dark` = dark Obsidian Night), Tailwind maps them alpha-aware via `rgb(var(--x) / <alpha-value>)`; Utopia fluid type (`text-fluid-xs..3xl`) and space (`*-flow-3xs..3xl`) scales (ADR-007). **Never hardcode palette hexes in components** — semantic classes only (`bg-surface`, `text-ink`, `text-accent`, `text-secondary`, `border-outline-variant`, …)
- Theme: next-themes, `attribute="class"`, `defaultTheme="dark"` (Stitch primary experience), `enableSystem={false}`, persists to localStorage key `theme`
- Shared UI vocabulary: `.btn/.btn-primary/.btn-ghost`, `.link-underline`, `.circle-icon`, `.input-line`, `.stained-glass`, `.glow-soft/.glow-accent`, `.reveal`, `.drop-cap` (globals.css); icons only from `components/ui/icons.tsx` (thin-stroke, rounded terminals)
- Content read ONLY through `lib/content.ts`; zod-validated front matter fails builds loudly
- **No `searchParams` in any page** — opts route into dynamic rendering, violates pure-SSG (ADR-005: `/poemas` renders all poems statically, chips link to `/categorias/[slug]`)

## Deployment gotchas (hard-won, do not rediscover)

- **`vercel.json` pins `"framework": "nextjs"`** — project was created with framework unset ("Other" preset); Vercel then served only `/public` statics and 404'd every page while deploy showed READY. Do not remove this file.
- **Canonical domain is `sandy-portfolio-mu.vercel.app`** — plain `sandy-portfolio.vercel.app` belongs to another Vercel account. Default in `lib/site.ts`; `NEXT_PUBLIC_SITE_URL` env overrides.
- Team-scoped `*-tonmoy-sarkers-projects-*.vercel.app` URLs 302 to Vercel SSO (deployment protection) — test production on the `-mu` domain only.
- Vercel project: `prj_57BPKRd6XFFv4KWmRhezTPOqf9SG`, team `team_NCNro5jeOALqFZn05HnIkznh`, auto-deploys on push to `main`.
- Pushing `main` = production deploy. Verify tests + static build first.

## Code gotchas

- `js-yaml`: use named import `load` — default import undefined under vitest ESM interop
- `tests/setup.ts` stubs IntersectionObserver, matchMedia (next-themes), and fetch (jsdom rejects relative URLs like SearchBar's `/search-index.json`)
- `vi.mock` factories: no top-level vars; async factory importing inside (see `lib/content.test.ts`)
- `prebuild` runs `scripts/build-search-index.mjs` (plain Node, gray-matter directly) — keep output shape in sync with `SearchEntry` in `lib/search-index.ts`
- `public/search-index.json` is generated, gitignored
- Cover images are on-brand SVG placeholders (`public/images/**`) — owner replaces with real art; `content/_templates/*` intentionally reference `.jpg` as examples
- Header search button opens the ⌘K overlay via `window.dispatchEvent(new CustomEvent("versos:open-search"))`; `SearchOverlay` listens for it
- ThemeToggle SSR renders sun icon (dark default) and swaps only after mount — avoids hydration mismatch; tests assert `aria-label` "Ativar tema claro/escuro"
- `settings.footerQuote` renders in the home `QuoteBanner`, NOT in the footer (footer shows `tagline`; test enforces no duplication)
- Scroll reveals (`components/ui/Reveal.tsx`) start `opacity: 0` — headless screenshots need `--virtual-time-budget` (plain chrome) or a wait, or content below the hero looks blank
- No `@tailwindcss/typography` plugin — `prose` classes are dead; long-form styling lives in `DetailPage` + `.drop-cap`

## Visual verification workflow (works, reuse)

`npm run build && npm start -- -p 3311`, then playwright-core (scratchpad-installed) driving `/usr/bin/google-chrome`; seed theme via `addInitScript(t => localStorage.setItem("theme", t))` to screenshot light mode without clicking.

## Outstanding

- None. (Giscus manual setup step is obsolete — comments removed entirely.)
