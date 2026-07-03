import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

export const SeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});

export const PoemFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: isoDate,
  excerpt: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  coverImage: z.string(),
  readingTime: z.number().optional(),
  seo: SeoSchema.optional(),
});
export type PoemFrontmatter = z.infer<typeof PoemFrontmatterSchema>;

export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: isoDate,
  excerpt: z.string(),
  category: z.string(),
  coverImage: z.string(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  externalLink: z.string().optional(),
  seo: SeoSchema.optional(),
});
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

export const CategorySchema = z.object({
  slug: z.string(),
  label: z.string(),
  description: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const HomeContentSchema = z.object({
  heroTitleLine1: z.string(),
  heroTitleLine2: z.string(),
  heroSubtitle: z.string(),
  heroPrimaryCta: z.object({ label: z.string(), href: z.string() }),
  heroSecondaryCta: z.object({ label: z.string(), href: z.string() }),
});
export type HomeContent = z.infer<typeof HomeContentSchema>;

export const SiteSettingsSchema = z.object({
  siteTitle: z.string(),
  tagline: z.string(),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
  socials: z.array(z.object({ platform: z.string(), url: z.string() })),
  footerQuote: z.string(),
  contactFormEndpoint: z.string().optional(),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
