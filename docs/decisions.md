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

## ADR-005: No query-param pagination on the poems archive

**Decision:** `/poemas` renders every published poem statically; there is no `?page=N` pagination, and category filtering links to the static `/categorias/[slug]` pages.
**Reason:** Reading `searchParams` in a Next.js App Router page opts it into server-side dynamic rendering, which violates the pure-SSG constraint (every route must prerender). At the current content volume a single page is fine. If the archive grows past ~30 poems, add statically generated `/poemas/pagina/[n]` routes (the `Pagination` component already exists for this).

## ADR-006: No commenting system

**Decision:** The Giscus comments integration (ADR-era assumption from the original spec) is removed entirely — no comments UI on poems, no `giscus` block in `content/settings.yaml`, no `@giscus/react` dependency.
**Reason:** The site owner decided the site does not need comments. Giscus also required a manual GitHub setup step (enable Discussions, install the app) that was never completed, so the widget was dead weight on every poem page. Supersedes the comments row in the 2026-07-03 design spec.

## ADR-007: Semantic CSS-variable design tokens with Utopia fluid scales

**Decision:** All color comes from semantic CSS custom properties (`--surface`, `--ink`, `--accent`, `--secondary`, `--outline`, …) defined twice: on `:root` for the light "Aged Parchment" palette and on `.dark` for the "Obsidian Night" palette from the Stitch "Nocturne & Filigree" design system. Tailwind consumes them alpha-aware via `rgb(var(--x) / <alpha-value>)`. Type and spacing use Utopia (utopia.fyi) `clamp()` scales exposed as `--step-*` / `--space-*` and mapped to `text-fluid-*` / `*-flow-*` utilities.
**Reason:** The first implementation hardcoded dark-palette hex values into Tailwind classes (`bg-obsidian`, `text-ink` fixed to `#e5e2e1`), so the `next-themes` class flip changed nothing — light mode rendered dark colors. Semantic variables make theming automatic for every component, and fluid scales replace fixed px sizes so typography/spacing adapt continuously across viewports instead of jumping at breakpoints. Components must use semantic classes (`bg-surface`, `text-accent`); raw palette classes no longer exist.
