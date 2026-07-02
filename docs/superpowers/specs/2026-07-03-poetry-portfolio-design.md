# sandy-portfolio — Design Spec

**Date:** 2026-07-03
**Status:** Approved by owner, pending implementation plan

## 1. Summary

A static personal poetry blog + creative portfolio ("Versos"), built and maintained by a single non-developer owner who edits Markdown/MDX content directly on GitHub. Content and code are fully separated. No database, no custom backend, no CMS admin UI — GitHub is the source of truth, Vercel builds and hosts.

Visual direction: dark-fantasy Art Nouveau / Gothic ("stained glass and illuminated manuscript"), Portuguese-language content, warm gold + obsidian + emerald palette, Playfair Display + EB Garamond typography. The owner's reference mockup (`file_00000000da9071f58c4221c7de09f80c.png`, "VERSOS") is the visual source of truth. A Google Stitch project ("Stained Verse Design System") was generated from the same brief but drifted structurally — English copy, generic dark-fantasy stock imagery, single-column hero, no stained-glass/rose motif. Its design tokens (colors, type scale, spacing, motion feel) match the reference closely and are reused as-is; its page layouts are used only as a structural/component reference (what sections exist, what repeats), not copied verbatim.

## 2. Decisions Locked

| Question | Decision |
|---|---|
| Language | Portuguese only (matches reference mockup) |
| Comments on poems | Giscus (GitHub Discussions-backed, no server) |
| Newsletter signup | Omitted for v1 (footer block hidden until a provider is chosen) |
| Content editing UX | Direct Markdown/MDX editing on GitHub — no Decap CMS |
| Skill cleanup archive mode | Hard delete (34 unrelated skills removed from `.claude/skills/`) — unrelated to this spec but recorded for context |

## 3. Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- MDX for poems/projects/about content
- Pure Static Site Generation — zero custom API routes, zero database
- GitHub → Vercel, auto-deploy on push to `main`, PR previews on branches
- No required environment variables/secrets for MVP (Giscus config is public repo/category metadata)

## 4. Folder Structure

```
/app
  layout.tsx, page.tsx                    Home
  poemas/page.tsx                         Poems archive (search+filter+pagination)
  poemas/[slug]/page.tsx                  Poem detail
  categorias/[slug]/page.tsx              Category-filtered archive (reuses archive template)
  portfolio/page.tsx                      Portfolio grid
  portfolio/[slug]/page.tsx               Project detail
  sobre/page.tsx                          About
  contato/page.tsx                        Contact (static form -> mailto or Formspree free tier)
  sitemap.ts / robots.ts / feed.xml/route.ts
  not-found.tsx
/components
  layout/     Header, Footer, MobileNav
  ui/         Button, Tag, Card, SectionHeading, Divider, QuoteBanner
  ui/ornaments/  inline SVG vine/rose/arch motifs, reused across Hero/dividers/card frames
  poems/      PoemCard, PoemListItem, FeaturedPoemCard, RelatedPoems
  portfolio/  ProjectCard, FeaturedProjectCard
  search/     SearchBar, FilterChips, Pagination
  comments/   GiscusComments
/lib
  content.ts       loaders: getAllPoems, getPoemBySlug, getAllProjects, ...
  mdx.ts           MDX compile/render helpers
  seo.ts           metadata builders, JSON-LD
  reading-time.ts
  search-index.ts  static search index built at compile time
  types.ts         front-matter schemas (single source of truth for content shape)
/content
  poems/*.mdx
  projects/*.mdx
  pages/home.yaml, pages/about.mdx
  settings.yaml
  categories.yaml
  _templates/poem.mdx, _templates/project.mdx
/public
  images, self-hosted font files if not using next/font's built-in fetch
/styles
  globals.css — Tailwind layer + design tokens as CSS custom properties
```

## 5. Component Hierarchy

`Header`/`Footer` wrap every route.

- **Home** = Hero + `PoemListItem` x4 ("Últimos Poemas") + `FeaturedPoemCard` ("Destaque") + two-card row (About teaser / Portfolio teaser, shared `TeaserCard`) + `QuoteBanner`.
- **Archive / Category / Portfolio** share one `CardGridPage` template: `SearchBar` + `FilterChips` + card grid (`PoemCard` or `ProjectCard`) + `Pagination`. Same component, different data source and card type.
- **Poem Detail / Project Detail** share one `DetailPage` template: title/meta block + MDX body + `RelatedItems` row + comments section (poems only, via `GiscusComments`).

## 6. Content Architecture

```yaml
# poem front matter (/content/poems/*.mdx)
title: string
slug: string                # defaults to filename if omitted
date: YYYY-MM-DD
excerpt: string
category: string             # must match a slug in categories.yaml
tags: string[]
featured: boolean
published: boolean
coverImage: string            # path under /public/images
readingTime: number?          # auto-computed from word count if omitted
seo:
  title: string?
  description: string?
  ogImage: string?

# project front matter (/content/projects/*.mdx)
title, slug, date, excerpt, category, coverImage,
gallery: string[], featured, published, externalLink?, seo

# /content/categories.yaml
- { slug, label, description }

# /content/settings.yaml
siteTitle, tagline, nav: [{label, href}], socials: [{platform, url}],
footerQuote, giscus: { repo, category }
```

`getAllPoems`/`getAllProjects` in `/lib/content.ts` are the only code that reads `/content` — pages never touch the filesystem directly. `readingTime` and `category` validity are enforced in `/lib/types.ts` so a malformed front-matter field fails the build loudly rather than rendering broken.

## 7. Routing

`/`, `/poemas`, `/poemas/[slug]`, `/categorias/[slug]`, `/portfolio`, `/portfolio/[slug]`, `/sobre`, `/contato`, 404.

No dedicated `/busca` route. Search is a client-side overlay (Cmd/Ctrl+K) plus an inline bar on the archive page, both backed by one static JSON index built at compile time from poem/project titles, excerpts, and tags (Fuse.js, no server).

## 8. Motion & Interaction

Brief: the site should feel organic, calm, alive — "walking through a cathedral garden," not a corporate SaaS UI. Full detail lives in the brainstorming transcript; the technical translation:

- **CSS-first, no animation library.** Framer Motion et al. add JS weight the "minimal JS" performance goal doesn't justify here — everything specified (fades, glides, soft scale, ambient glow, shimmer) is achievable with CSS transitions/keyframes.
- **Motion tokens**, extending the Stitch design-md token set:
  ```
  duration-fast: 150ms
  duration-base: 250ms
  duration-slow: 350ms
  ease-organic: cubic-bezier(0.4, 0, 0.2, 1)
  ```
  Expressed as CSS custom properties (`--ease-organic`, `--duration-base`) in `globals.css`; every transition in the codebase references these instead of ad hoc values.
- **Hover/focus:** transitions limited to `opacity`, `transform`, `box-shadow`, `border-color` (cheap, GPU-friendly). Soft glow via low-opacity gold/emerald `box-shadow`, subtle `scale(1.02)`/`translateY(-2px)`, link underlines as a `background-size` sweep rather than an instant `text-decoration` toggle.
- **Scroll-reveal:** one shared `useInView` hook built on native `IntersectionObserver` (~20 lines, zero dependencies) toggling an `.is-visible` class — not a scroll-animation library.
- **`prefers-reduced-motion: reduce`**: one root-level media query disables all transform/opacity transitions site-wide. Single guard, not per-component opt-outs.
- **Decorative ornaments** (vine dividers, rose bullets, cathedral-arch frames) are static inline SVGs in `/components/ui/ornaments/`, reused across Hero, section dividers, and card frames — matches the reference image's ironwork/vine motifs at near-zero runtime cost.
- **Asymmetry** comes from layout (CSS Grid with intentional column-span offsets, alternating image/text sides between sections), not motion — achieves the "not grid-like" feel without JS.

## 9. Features Triage

| Feature | v1? | Notes |
|---|---|---|
| Search | v1 | Client-side static Fuse.js index (poems + projects) |
| Categories / Tags | v1 | Driven by `categories.yaml` + front matter |
| Featured poems | v1 | `featured: true` surfaces on home |
| Related poems | v1 | Same category, latest 3, excludes current |
| Reading time | v1 | Auto word-count/200wpm at build, override-able |
| RSS feed | v1 | High value for a poetry blog, cheap to build |
| Sitemap / robots.txt | v1 | Next.js built-ins (`sitemap.ts`/`robots.ts`) |
| OG metadata | v1 (static images) | Dynamic per-poem OG image generation deferred |
| Theme toggle (light/dark) | v1 | Both palettes ("Obsidian Night" / "Aged Parchment") already specced |
| Image optimization | v1 | `next/image`, local assets |
| Responsive nav | v1 | Hamburger on mobile, matches Stitch mobile screens |
| Pagination | v1 | Numbered pagination, not infinite scroll (SEO + matches Stitch mock) |
| Comments | v1 | Giscus |
| Newsletter | Deferred | No provider chosen yet |
| Decap CMS | Not included | Direct Markdown editing instead |

## 10. Performance / SEO / Accessibility

- Full SSG via `generateStaticParams`; no runtime data fetching; no API routes.
- Fonts (Playfair Display, EB Garamond, Hanken Grotesk) self-hosted via `next/font` — avoids external Google Fonts request and render blocking.
- Per-route Metadata API (title/description/OG/canonical) + JSON-LD: `BlogPosting` for poems, `CreativeWork` for projects, `Person` for about.
- WCAG AA target; 7:1 contrast for body text (already required by the Stitch design system) carried through literally; visible gold-accented focus rings (never suppressed); skip-to-content link; accessible mobile nav (`aria-expanded`, focus trap).
- Target Lighthouse 95+ across the board. Client JS limited to: theme toggle, mobile nav, search overlay, filter chips, scroll-reveal hook, lazy-loaded Giscus iframe.

## 11. Deployment

GitHub repo → Vercel project → auto-deploy on push to `main`, PR previews per branch. No database, no custom serverless functions beyond what Next/Vercel provide automatically (image optimization). Custom domain addable later via the Vercel dashboard with no code changes.

## 12. Documentation

- `README.md` — setup, dev, deploy
- `CONTENT_GUIDE.md` — front-matter reference and "how to add a poem/project," written for a non-developer
- `docs/decisions.md` — append-only ADR log
- `/content/_templates/poem.mdx`, `/content/_templates/project.mdx` — copy-paste starters with inline guidance
- No `CONTRIBUTING.md` (single owner, not needed)

Two project skills already updated to support this: `documentation-sync` (keeps the above in sync after changes) and `project-health` (periodic audit of content/code separation, build health, docs accuracy).

## 13. Implementation Roadmap

0. **Scaffold** — Next.js+TS+Tailwind init, design tokens (color/type/spacing/motion) into `tailwind.config`+`globals.css`, fonts via `next/font`, base `Header`/`Footer`, ornament SVG set.
1. **Content layer** — schemas, `/lib/content.ts` loaders, MDX pipeline, sample content (3 poems, 2 projects, about, settings).
2. **Core pages** — Home, Poems Archive (search+filter+pagination), Poem Detail (+related poems), Category pages.
3. **Portfolio pages** — grid + detail, reusing `CardGridPage`/`DetailPage` templates.
4. **Cross-cutting** — RSS, sitemap, robots, OG metadata, JSON-LD, theme toggle, scroll-reveal + motion tokens wired in.
5. **Comments + Contact** — Giscus, static contact form.
6. **Polish** — accessibility audit, Lighthouse pass, responsive QA against Stitch mobile screens and the reference image, docs written.
7. **Deploy** — Vercel + GitHub connected, full edit-on-GitHub -> auto-rebuild workflow smoke-tested end to end.

## 14. Future Improvements (explicitly deferred)

- Dynamic per-poem OG image generation (`next/og`)
- Newsletter integration once a provider is chosen
- Decap CMS admin UI, if the owner later wants a form-based editor
- Full bilingual (PT/EN) support, if ever needed
- "Reading progress" indicator on poem detail
- Category landing pages with custom cover art
