# Context — Versos Poetry Portfolio

## What this is

Static Next.js poetry blog + creative portfolio for a non-developer owner who edits content directly on GitHub. Visual source of truth (per owner, 2026-07-03 refinement): the Google Stitch **"Stained Verse Design System"** project (`projects/14183640873297549245`) — its "Nocturne & Filigree" designMd carries the canonical tokens (dark "Obsidian Night": gold `#f2ca50`/`#d4af37` primary, emerald `#95d3ba`/`#0b513d` secondary; light "Aged Parchment": charcoal ink, velvet-crimson accent, bronze filigree). The Stitch *screens* drifted to a teal palette — trust the designMd tokens, not screen colors; screens are still the reference for ornament/layout vocabulary.

## Status: BUILT AND DEPLOYED (2026-07-03)

- **Production: https://sandy-portfolio-mu.vercel.app**
- All 27 plan tasks complete, merged to `main`, feature branch deleted
- 72 tests passing (Vitest 4 + Testing Library + jsdom), build fully static (○/● routes only)
- Lighthouse: ~95-96 perf/a11y/best-practices, 100 SEO (home + poem detail)

## Key docs

- `docs/superpowers/specs/2026-07-03-poetry-portfolio-design.md` — design spec
- `docs/superpowers/plans/2026-07-03-poetry-portfolio-implementation.md` — executed 27-task plan
- `docs/decisions.md` — ADR-001..005
- `CONTENT_GUIDE.md` — owner-facing content workflow (Portuguese)
- `README.md` — dev/test/build/deploy

## Decisions locked

- Next.js 14 App Router + TS + Tailwind + MDX, pure SSG, zero DB/API routes
- Portuguese only; **no comments** (Giscus removed 2026-07-03, ADR-006); no newsletter; no CMS (GitHub web editor)
- Motion CSS-only (+ tiny useInView/ReadingProgress hooks), respects `prefers-reduced-motion`
- Design tokens: semantic CSS vars in `app/globals.css` (`:root` light / `.dark` dark), Tailwind maps them alpha-aware; Utopia fluid type (`text-fluid-*`) and space (`*-flow-*`) scales (ADR-007). Never hardcode palette hexes in components.
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

## Outstanding

- None. (Giscus manual setup step is obsolete — comments removed entirely.)
