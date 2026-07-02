---
name: project-health
description: Use this skill for a periodic health audit of sandy-portfolio — before starting a new build phase, after a milestone, when something feels off, or when the user asks about "project health", "tech debt", "what needs attention", "how are we doing", or "audit the project". Also use it to review the project's own skills/agents for staleness or redundancy. Returns a short, prioritized, actionable report.
---

# Project Health

sandy-portfolio is a small static Next.js site (poetry blog + portfolio) maintained solo, with content authored by a non-developer owner via GitHub. "Health" here means: does the site still build cleanly, does content stay decoupled from code, and can the owner keep editing Markdown without ever touching application logic. Run this periodically rather than waiting for something to visibly break.

## Part 1: Project Audit

For each dimension, note: Healthy / Needs Attention / Critical.

### Content/Code Separation

- Does anything in `/app` or `/components` hardcode content (poem text, project descriptions, nav labels) that belongs in `/content`?
- Do all poems/projects in `/content` still validate against the front-matter schema in `/lib/types.ts`?
- Any `published: false` items lingering that should've shipped or been deleted?

### Documentation Quality

- Is `CONTENT_GUIDE.md` still accurate against the real front-matter schema? (see [[documentation-sync]])
- Is `docs/decisions.md` current — are recent non-obvious choices recorded?
- Does the README's setup/deploy section match how the site is actually deployed?

### Build & Performance

- Does `next build` complete without warnings?
- Any pages opted out of static generation unintentionally (check for accidental `dynamic = 'force-dynamic'` or uncached fetches)?
- Lighthouse/Core Web Vitals still in the target range, especially on the poem detail and archive pages (heaviest content)?
- Any images not going through `next/image`?

### Architecture Consistency

- Any page reimplementing logic that already exists in `/lib` (date formatting, reading-time calc, category filtering)?
- Any component duplicated across `poems/` and `portfolio/` that should be a single shared component?
- Any file growing large enough (~150+ lines) that it's likely doing too much?

### Accessibility & SEO

- Do new pages have Metadata (title/description/OG) set?
- Contrast ratios still meeting the design system's stated targets in dark and light mode?
- Sitemap/RSS/robots still reflecting current routes?

### Technical Debt

- Any `TODO`/`FIXME` left over from a previous phase?
- Any dependency added without a recorded reason in `docs/decisions.md`?
- Any feature the roadmap deferred (newsletter, Decap CMS, dynamic OG images) that's since been half-started?

## Part 2: Skills & Agents Audit

Review `.claude/skills/` and `.claude/agents/` (if present) for this project specifically:

- Is each skill's description specific enough to trigger reliably, and does it actually apply to this project (a static content-driven site), not leftover cruft from elsewhere?
- Does each skill explain *why*, not just steps?
- Is any skill duplicating something the built-in/superpowers skill set already covers?

## Output Format

```
## Project Health Report — [Date]

### Critical (address immediately)
- [item]

### Should Fix Soon
- [item]

### Low Priority
- [item]

### Healthy (no action needed)
- [area]
```

Keep it short. A 3-item critical list with concrete next steps beats an exhaustive catalog.
