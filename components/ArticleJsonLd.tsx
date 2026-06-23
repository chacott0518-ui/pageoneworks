import type { Article } from '@/lib/data';
import { siteConfig, absoluteUrl } from '@/lib/site.config';
import { normalizeDate } from '@/lib/schemas';

interface Props {
  article: Article;
}

export function ArticleJsonLd({ article }: Props) {
  const url = absoluteUrl(`/article/${article.slug}`);
  const date = normalizeDate(article.date);

  // 작성자 실명/프로필 정보가 없고 편집부 콘텐츠이면 Organization(publisher) 참조,
  // 개별 작성자명이 있으면 최소 Person 객체만 사용한다. (허위 URL·자격 생성 금지)
  const isEditorial = !article.author || /편집부|PAGEONEWORKS/i.test(article.author);
  const author = isEditorial
    ? { '@id': siteConfig.publisherId }
    : { '@type': 'Person', name: article.author };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.titleKo,
    description: article.excerpt,
    image: absoluteUrl(article.image),
    datePublished: date,
    ...(article.updatedAt ? { dateModified: normalizeDate(article.updatedAt) } : {}),
    author,
    publisher: { '@id': siteConfig.publisherId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: article.tags?.join(', ') ?? '',
    articleSection: article.category,
    inLanguage: siteConfig.language,
    ...(article.sources?.some((s) => s.url) && {
      citation: article.sources
        .filter((s) => s.url)
        .map((s) => ({ '@type': 'CreativeWork', name: s.name, url: s.url })),
    }),
    ...(article.isSponsored && {
      sponsor: {
        '@type': 'Organization',
        name: article.sponsorName,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}