import type { MetadataRoute } from "next";
import { getAllPoems, getAllProjects, getCategories } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/poemas", "/portfolio", "/sobre", "/contato"].map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  const poemRoutes = getAllPoems().map((poem) => ({ url: `${SITE_URL}/poemas/${poem.slug}` }));
  const projectRoutes = getAllProjects().map((project) => ({ url: `${SITE_URL}/portfolio/${project.slug}` }));
  const categoryRoutes = getCategories().map((category) => ({ url: `${SITE_URL}/categorias/${category.slug}` }));

  return [...staticRoutes, ...poemRoutes, ...projectRoutes, ...categoryRoutes];
}
