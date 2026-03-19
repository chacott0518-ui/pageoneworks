import type { Article } from '@/lib/data';

interface Props {
  article: Article;
}

export function ArticleJsonLd({ article }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.titleKo,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date.replace(/\./g, '-'),
    dateModified: article.date.replace(/\./g, '-'),
    author: {
      '@type': 'Organization',
      name: article.author ?? 'PAGEONEWORKS',
      url: 'https://pageoneworks.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PAGEONEWORKS',
      url: 'https://pageoneworks.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pageoneworks.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://pageoneworks.com/article/${article.slug}`,
    },
    keywords: article.tags?.join(', ') ?? '',
    articleSection: article.category,
    inLanguage: 'ko-KR',
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