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

Push to `main` on GitHub — Vercel auto-deploys. No environment variables required for the base site (`NEXT_PUBLIC_SITE_URL` optionally overrides the canonical URL used in the RSS feed/sitemap); see `content/settings.yaml` for the Giscus repo/category used for poem comments.

## Adding content

See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) — written for the site owner, not developers.
