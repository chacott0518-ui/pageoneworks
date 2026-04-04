import { articles } from '@/lib/data';

const BASE_URL = 'https://www.pageoneworks.com';

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
<title>PAGEONEWORKS — 프리미엄 라이프스타일 매거진</title>
<link>${BASE_URL}</link>
<description>의료·안티에이징·부동산·모빌리티·법률·금융·라이프스타일·뷰티·미식·교육을 아우르는 대한민국 No.1 프리미엄 웹 매거진</description>
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