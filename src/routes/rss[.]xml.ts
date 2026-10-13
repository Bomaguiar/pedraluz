import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://pedraluz.lovable.app";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: string | null): string {
  if (!date) return new Date().toUTCString();
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { fetchNewsPosts } = await import("@/lib/news.server");
        const { posts } = await fetchNewsPosts();

        const items = posts
          .map((post) => {
            const link = `${SITE_URL}/news/${post.slug}`;
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
${
  post.cover
    ? `      <enclosure url="${escapeXml(post.cover)}" type="image/jpeg" />\n`
    : ""
}${
              post.tags.length
                ? post.tags
                    .map((t) => `      <category>${escapeXml(t)}</category>`)
                    .join("\n") + "\n"
                : ""
            }    </item>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pedra &amp; Luz — News &amp; Updates</title>
    <link>${SITE_URL}/news</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Studio news, site progress, and project updates from Pedra &amp; Luz.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
