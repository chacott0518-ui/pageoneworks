import { articles } from '@/lib/data';
import { siteConfig } from '@/lib/site.config';

const BASE_URL = siteConfig.baseUrl;

export async function GET() {
  const rssItems = articles
    .slice()
    .sort((a, b) => new Date(b.date.replace(/\./g, '-')).getTime() - new Date(a.date.replace(/\./g, '-')).getTime())
    .map((article) => {
      const pubDate = new Date(article.date.replace(/\./g, '-')).toUTCString();
      const link = `${BASE_URL}/article/${article.slug}`;
      const excerpt = (article.excerpt ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<item>
<title><![CDATA[${article.titleKo}]]></title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<description><![CDATA[${excerpt}]]></description>
<category><![CDATA[${article.category}]]></category>
<pubDate>${pubDate}</pubDate>
</item>`;
    })
    .join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${siteConfig.title}</title>
<link>${BASE_URL}</link>
<description>${siteConfig.description}</description>
<language>ko</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
</channel>
</rss>`;

  return new Response(rssFeed.trimStart(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}