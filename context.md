# Context — Versos Poetry Portfolio

## What this is

Static Next.js poetry blog + creative portfolio for a non-developer owner who edits content directly on GitHub. Visual target is the owner's reference mockup image ("VERSOS" — Portuguese, stained-glass/Art Nouveau, gold/obsidian/emerald), **not** the Google Stitch-generated screens, which drifted.

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
- Portuguese only; Giscus comments; no newsletter; no CMS (GitHub web editor)
- Motion CSS-only, respects `prefers-reduced-motion`
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

## Outstanding (owner manual step)

**Giscus comments dead until:** GitHub → `tonmoysarker/sandyla` → Settings → enable Discussions → create category **"Poemas"** → install giscus app (github.com/apps/giscus). Config already in `content/settings.yaml`.
