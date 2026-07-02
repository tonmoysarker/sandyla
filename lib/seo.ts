import type { Metadata } from "next";
import type { Poem, Project } from "@/lib/content";
import type { SiteSettings } from "@/lib/types";

export function buildPoemMetadata(poem: Poem, settings: SiteSettings): Metadata {
  return {
    title: `${poem.seo?.title ?? poem.title} | ${settings.siteTitle}`,
    description: poem.seo?.description ?? poem.excerpt,
    openGraph: {
      title: poem.seo?.title ?? poem.title,
      description: poem.seo?.description ?? poem.excerpt,
      images: poem.seo?.ogImage ? [poem.seo.ogImage] : [poem.coverImage],
      type: "article",
      publishedTime: poem.date,
    },
  };
}

export function buildPoemJsonLd(poem: Poem, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: poem.title,
    description: poem.excerpt,
    datePublished: poem.date,
    author: { "@type": "Person", name: settings.siteTitle },
    image: poem.coverImage,
  };
}

export function buildProjectMetadata(project: Project, settings: SiteSettings): Metadata {
  return {
    title: `${project.seo?.title ?? project.title} | ${settings.siteTitle}`,
    description: project.seo?.description ?? project.excerpt,
    openGraph: {
      title: project.seo?.title ?? project.title,
      description: project.seo?.description ?? project.excerpt,
      images: project.seo?.ogImage ? [project.seo.ogImage] : [project.coverImage],
      type: "article",
      publishedTime: project.date,
    },
  };
}

export function buildProjectJsonLd(project: Project, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    dateCreated: project.date,
    creator: { "@type": "Person", name: settings.siteTitle },
    image: project.coverImage,
  };
}
