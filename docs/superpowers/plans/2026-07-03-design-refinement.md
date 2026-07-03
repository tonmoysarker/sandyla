# Design & UX Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Versos site up to (and beyond) the Stitch "Stained Verse Design System" — correct two-theme token system, Utopia fluid type/space, working theme toggle, refined footer, organic motion, book-like reading experience, no comments.

**Architecture:** All color moves into semantic CSS custom properties on `:root` (light / Aged Parchment) and `.dark` (Obsidian Night), consumed by Tailwind via `rgb(var(--x) / <alpha-value>)`. Utopia clamp() scales become `--step-*` / `--space-*` vars mapped to Tailwind `fontSize`/`spacing`. Components migrate from palette classes (`bg-obsidian`, `text-ink`) to semantic classes (`bg-surface`, `text-ink`) that theme automatically. Motion is CSS-first, gated by the existing `prefers-reduced-motion` rule.

**Tech Stack:** Next.js 14 App Router, Tailwind 3, next-themes, Vitest 4 + Testing Library.

## Global Constraints

- Pure SSG — no `searchParams`, no dynamic rendering (ADR-005).
- Content read only through `lib/content.ts`; zod schemas in `lib/types.ts`.
- Motion CSS-only where possible; must respect `prefers-reduced-motion` (rule already in globals.css).
- Body text contrast ≥ 7:1 in both themes (Stitch designMd requirement).
- Portuguese UI copy.
- 72 existing tests must stay green (updated where behavior intentionally changes).

## Source-of-truth tokens (Stitch designMd "Nocturne & Filigree")

**Dark — Obsidian Night** (exact hex from Stitch):
surface `#131313`, surface-low `#1c1b1b`, surface-mid `#201f1f`, surface-high `#2a2a2a`,
ink `#e5e2e1`, ink-muted `#d0c5af`, outline `#99907c`, outline-variant `#4d4635`,
accent (primary/gold) `#f2ca50`, accent-strong `#d4af37`, on-accent `#3c2f00`,
secondary (emerald) `#95d3ba`, secondary-container `#0b513d`, tertiary `#dbc6f4`.

**Light — Aged Parchment** (derived per designMd prose: parchment surface, charcoal text, muted velvet crimson accent, bronze filigree):
surface `#f4ecdc`, surface-low `#ede2cc`, surface-mid `#e9ddc4`, surface-high `#e2d3b4`,
ink `#2b2622` (≥7:1 on parchment), ink-muted `#5c5240`, outline `#8a7a58`, outline-variant `#cbbc98`,
accent (crimson) `#8c2f39`, accent-strong `#6f2129`, on-accent `#f7efdf`,
secondary (bronze) `#7a5f2e`, secondary-container `#e5d5ae`, tertiary `#4e3e63`.

**Utopia fluid type** (320→1240px, 1.2→1.25 ratio, base 18→20px):
```
--step--2: clamp(0.7813rem, 0.7747rem + 0.0326vw, 0.8rem);
--step--1: clamp(0.9375rem, 0.9158rem + 0.1087vw, 1rem);
--step-0:  clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
--step-1:  clamp(1.35rem, 1.2761rem + 0.3696vw, 1.5625rem);
--step-2:  clamp(1.62rem, 1.5041rem + 0.5793vw, 1.9531rem);
--step-3:  clamp(1.944rem, 1.771rem + 0.8651vw, 2.4414rem);
--step-4:  clamp(2.3328rem, 2.0827rem + 1.2504vw, 3.0518rem);
--step-5:  clamp(2.7994rem, 2.4462rem + 1.7658vw, 3.8147rem);
```

**Utopia fluid space** (base 18→20px, t-shirt multiples 0.25/0.5/0.75/1/1.5/2/3/4/6):
```
--space-3xs: 0.3125rem;
--space-2xs: clamp(0.5625rem, 0.5408rem + 0.1087vw, 0.625rem);
--space-xs:  clamp(0.875rem, 0.8533rem + 0.1087vw, 0.9375rem);
--space-s:   clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
--space-m:   clamp(1.6875rem, 1.6223rem + 0.3261vw, 1.875rem);
--space-l:   clamp(2.25rem, 2.163rem + 0.4348vw, 2.5rem);
--space-xl:  clamp(3.375rem, 3.2446rem + 0.6522vw, 3.75rem);
--space-2xl: clamp(4.5rem, 4.3261rem + 0.8696vw, 5rem);
--space-3xl: clamp(6.75rem, 6.4891rem + 1.3043vw, 7.5rem);
```

---

### Task 1: Remove Giscus entirely

**Files:**
- Delete: `components/comments/` (GiscusComments.tsx + test)
- Modify: `app/poemas/[slug]/page.tsx` (drop Reflexões section + import)
- Modify: `lib/types.ts` (drop `giscus` from SiteSettingsSchema)
- Modify: `content/settings.yaml` (drop giscus block)
- Modify: `package.json` (remove `@giscus/react`)
- Check/update: any tests referencing giscus/settings shape (`lib/content.test.ts`, page tests)

- [ ] Delete component dir, strip usages, schema, yaml, dep; `npm uninstall @giscus/react`
- [ ] `npm test` green
- [ ] Commit `feat: remove commenting system`

### Task 2: Token system + Utopia scales (globals.css + tailwind.config.ts)

**Files:** `app/globals.css`, `tailwind.config.ts`

- [ ] globals.css: define RGB-triplet vars for both themes (values above), fluid `--step-*`/`--space-*`, easing vars (`--ease-organic: cubic-bezier(0.33,1,0.68,1)`, `--ease-grand: cubic-bezier(0.65,0,0.35,1)`), body uses `bg-surface text-ink font-body text-fluid-base`, theme-transition rule, selection color, focus-visible ring, filigree/ornament utility classes, reveal keyframes.
- [ ] tailwind.config.ts: semantic colors via `rgb(var(--x) / <alpha-value>)` (surface, surface-low/mid/high, ink, ink-muted, accent, accent-strong, on-accent, secondary, secondary-container, tertiary, outline, outline-variant), fontSize `fluid-xs..fluid-3xl` → `var(--step-*)`, spacing `flow-3xs..flow-3xl` → `var(--space-*)`.
- [ ] Keep legacy palette names temporarily so build stays green mid-migration; delete at end of Task 3.
- [ ] Commit `feat: semantic two-theme tokens + Utopia fluid scales`

### Task 3: Migrate all components/pages to semantic tokens

**Files:** every file under `app/` + `components/` using `obsidian|parchment|gold|emerald|ink` classes.

Mapping: `bg-obsidian→bg-surface`, `bg-obsidian-low→bg-surface-low`, `text-ink→text-ink`, `text-gold→text-accent`, `border-gold-container→border-accent-strong`, `text-emerald→text-secondary`, `bg-gold→bg-accent`, `text-obsidian` (on gold) → `text-on-accent`, `prose-invert` → theme-aware prose.

- [ ] Sweep + hand-fix each file; replace fixed text sizes with fluid classes; replace fixed section padding with flow spacing
- [ ] Remove legacy palette from tailwind config
- [ ] `npm test`, fix assertions on classes if any
- [ ] Commit `refactor: migrate UI to semantic theme tokens`

### Task 4: Working theme toggle

**Files:** `components/layout/ThemeToggle.tsx` (+test), `app/layout.tsx`

- [ ] ThemeToggle: `mounted` guard (useEffect), `resolvedTheme`, animated sun/moon SVG crossfade, aria-label reflects target theme
- [ ] layout.tsx: `enableSystem`, `disableTransitionOnChange` OFF (we want smooth), keep `defaultTheme="dark"` (primary experience per Stitch)
- [ ] Update ThemeToggle.test.tsx for mounted behavior
- [ ] Commit `fix: functional persisted theme switching`

### Task 5: Icon set

**Files:** Create `components/ui/icons.tsx` — thin-stroke (1.25–1.5), rounded terminals, 24-box: Menu, Close, Sun, Moon, Search, ArrowRight, Send, Instagram, Pinterest, Heart, Quill, Flourish (spa-like leaf).

- [ ] Implement; replace ☰/☀/☾/text socials everywhere
- [ ] Commit `feat: consistent thin-stroke icon set`

### Task 6: Header polish

**Files:** `components/layout/Header.tsx`, `MobileNav.tsx`

- [ ] Stained-glass blur bar (`bg-surface/80 backdrop-blur-md`), emerald/crimson tint via secondary-container at low alpha, border-b outline-variant
- [ ] Nav links: center-out underline sweep (::after scale-x), active state = accent
- [ ] Mobile menu icon swap (Menu/Close), slide-fade panel
- [ ] Commit `feat: stained-glass header with underline nav`

### Task 7: Footer redesign

**Files:** `components/layout/Footer.tsx` (+test)

- [ ] Structure per Stitch: quote + filigree centered; 3-col desktop grid (Navegação [2-col ul], Redes Sociais icons in circular frames, tagline/flourish); tablet 2-col; mobile stacked centered; bottom bar: © left, flourish center, "Feito com ♥ e poesia" right
- [ ] Update Footer.test.tsx
- [ ] Commit `feat: balanced responsive footer`

### Task 8: Ornaments upgrade

**Files:** `components/ui/ornaments/` — improve `VineDivider` (❦-style filigree with vine curls), add `CornerFlourish`, refine `StainedGlassRose` (richer leading, more panes), `ArchFrame` (double border + keystone diamond)

- [ ] Implement, keep data-testids
- [ ] Commit `feat: richer Art Nouveau ornaments`

### Task 9: Motion & interactions

**Files:** `app/template.tsx` (new — page fade/rise transition), `components/ui/Reveal.tsx` (new — scroll reveal wrapper using use-in-view), `components/ui/ReadingProgress.tsx` (new), buttons/cards/chips/pagination hover states

- [ ] template.tsx: keyframe fade-up on route change
- [ ] Reveal: staggered in-view reveals on home sections, card grids
- [ ] Buttons: gold-foil fill sweep on hover (300ms, ease-grand), glow shadows tinted secondary
- [ ] Cards: elevation via border-accent + soft tinted shadow + slight -translate-y
- [ ] Commit `feat: organic motion system`

### Task 10: Reading experience (poem detail)

**Files:** `components/templates/DetailPage.tsx`, `app/poemas/[slug]/page.tsx`, `app/portfolio/[slug]/page.tsx`

- [ ] ReadingProgress bar (top, accent gradient)
- [ ] Centered header: category label, display title, filigree divider, meta
- [ ] Body: max-w ~36rem, fluid body-lg, line-height 1.8, first-letter drop cap (display font, accent), stanza spacing via --space-m
- [ ] End ornament (flourish) + related section behind decorative divider
- [ ] Commit `feat: book-like reading experience`

### Task 11: Home + grid pages polish

**Files:** `app/page.tsx`, `Hero.tsx`, `PoemListItem.tsx`, `TeaserCard.tsx`, `QuoteBanner.tsx`, `CardGridPage.tsx`, remaining pages (`sobre`, `contato`, `poemas`, `portfolio`, `categorias`, `not-found`)

- [ ] Hero: eyebrow rule+name, display title w/ soft glow, italic subtitle, scroll indicator, arch image w/ corner flourish, buttons per Stitch
- [ ] Latest poems: circular-icon list items (flourish icon in ring)
- [ ] Section headers: heading + short accent rule, generous --space-2xl/3xl rhythm
- [ ] QuoteBanner: flourish icon above, filigree below
- [ ] Commit `feat: home and archive visual fidelity`

### Task 12: Verify + docs

- [ ] `npm test` (all green), `npm run build` (static ○/● only)
- [ ] Update README/CONTENT_GUIDE/decisions + context.md (giscus removal, token system) via documentation-sync
- [ ] Commit `docs: sync after design refinement`

## Self-Review
- Spec coverage: ✔ comments (T1), typography/spacing (T2/T3), tokens (T2/T3), theme (T4), footer (T7), motion (T9), reading (T10), fidelity/ornaments (T8/T11), icons (T5).
- Types consistent: semantic token names fixed in T2, consumed everywhere after.
