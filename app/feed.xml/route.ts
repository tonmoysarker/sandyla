import { getAllPoems, getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const poems = getAllPoems();
  const settings = getSiteSettings();

  const items = poems
    .map(
      (poem) => `
    <item>
      <title>${escapeXml(poem.title)}</title>
      <link>${SITE_URL}/poemas/${poem.slug}</link>
      <guid>${SITE_URL}/poemas/${poem.slug}</guid>
      <pubDate>${new Date(poem.date).toUTCString()}</pubDate>
      <description>${escapeXml(poem.excerpt)}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(settings.siteTitle)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(settings.tagline)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}
