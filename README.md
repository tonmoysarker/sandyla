# Versos

Poetry blog and creative portfolio. Static Next.js site — content lives in `/content`, code never contains poem/project text.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test
```

## Build

```bash
npm run build
```

`prebuild` regenerates `public/search-index.json` from current content automatically.

## Deployment

Production: https://sandy-portfolio-mu.vercel.app

Push to `main` on GitHub — Vercel auto-deploys. No environment variables required for the base site (`NEXT_PUBLIC_SITE_URL` optionally overrides the canonical URL used in the RSS feed/sitemap).

## Design system

Colors, type, and spacing are semantic CSS variables in `app/globals.css` (light "Aged Parchment" on `:root`, dark "Obsidian Night" on `.dark`), consumed by Tailwind as `bg-surface`, `text-ink`, `text-accent`, `text-fluid-*`, `p-flow-*`, etc. Never hardcode palette hex values in components — see ADR-007 in `docs/decisions.md`.

## Adding content

**New to GitHub?** Start here: [COMO_COMEAR.md](./COMO_COMEAR.md) — setup guide for non-technical users with no git account.

Then see [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) — detailed instructions for adding poems, projects, and editing site text.
