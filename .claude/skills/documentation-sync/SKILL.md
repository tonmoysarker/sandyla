---
name: documentation-sync
description: Use this skill after any implementation change to sandy-portfolio to keep docs (README, CONTENT_GUIDE.md, decisions log) accurate, or when docs feel stale or out of sync with the code. Trigger on "update the docs", "sync documentation", "the docs are wrong", "update the content guide", or after shipping a page, component, or content schema change. Documentation that lags behind the code is worse than no documentation — the site owner is not a developer and depends entirely on CONTENT_GUIDE.md being correct.
---

# Documentation Sync

sandy-portfolio is a static Next.js poetry blog/portfolio maintained by a non-developer owner who edits Markdown/MDX files directly on GitHub. The docs are their only interface to the system — if `CONTENT_GUIDE.md` describes a front-matter field that no longer exists, or omits one that's now required, the owner's next edit breaks the build. Treat doc drift here as a real defect, not busywork.

## When to Run This

- After adding, renaming, or removing a front-matter field on poems, projects, or site settings
- After adding a new content type or route
- After changing the design-token source (colors, fonts, spacing) so it no longer matches what's documented
- After a refactor that changes how content maps to pages
- When a doc is noticed to be wrong

## What to Update and Where

### `CONTENT_GUIDE.md`

The owner's primary reference. Update whenever:
- A front-matter field is added/removed/renamed for poems (`/content/poems/*.mdx`) or projects (`/content/projects/*.mdx`)
- `categories.yaml` or `settings.yaml` shape changes
- The workflow (edit on GitHub → commit → Vercel rebuild) changes in any way
- A content template in `/content/_templates/` changes — the guide's example must match the template exactly, since the owner copies from one to the other

### `README.md`

Update if:
- Setup/dev commands change (`npm install`, `npm run dev`, etc.)
- The deployment target or process changes
- The folder structure section no longer matches `/app`, `/components`, `/lib`, `/content`

### `docs/decisions.md` (create if it doesn't exist yet)

Add an entry whenever a non-obvious technical choice is made — e.g. why MDX over plain Markdown, why no CMS, why a particular search approach. Format:

```markdown
## ADR-XXX: Short title

**Decision:** What was decided.
**Reason:** Why — constraints, tradeoffs, what was rejected and why it lost.
```

ADRs are append-only. Never edit a past decision — add a new one that supersedes it.

## Discrepancy Protocol

If the doc says X but the code does Y:

1. Work out which is actually correct.
2. If the code is correct: update the doc, and say so in the commit/summary.
3. If the doc is correct: the code has a bug — fix the code, don't rewrite the doc to match broken behavior.

Never silently reconcile a doc to match incorrect code — the owner will trust whatever the doc says next time they add a poem.

## Quick Checklist

After any change that touches content shape or workflow:

- [ ] `CONTENT_GUIDE.md` front-matter reference matches actual schema in `/lib/types.ts`
- [ ] `/content/_templates/*.mdx` starter files match the guide's examples
- [ ] `README.md` setup/deploy steps still accurate
- [ ] Non-obvious decisions logged in `docs/decisions.md`
