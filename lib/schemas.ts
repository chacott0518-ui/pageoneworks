const BASE_URL = 'https://www.pageoneworks.com'

// ─── 사이트 기본 스키마 ───────────────────────────────────────
export const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'PAGEONEWORKS',
  alternateName: '페이지원웍스',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/images/og-default.jpg`,
    width: 1200,
    height: 630,
  },
  description:
    '의료·안티에이징·부동산·모빌리티·법률·금융·라이프스타일·뷰티·미식·교육을 아우르는 대한민국 No.1 프리미엄 웹 매거진',
  foundingDate: '2024',
  inLanguage: 'ko-KR',
  countryOfOrigin: { '@type': 'Country', name: 'KR' },
}

// ─── 웹사이트 스키마 (홈 전용) ───────────────────────────────
export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PAGEONEWORKS',
  url: BASE_URL,
  description: '대한민국 No.1 프리미엄 라이프스타일 웹 매거진',
  inLanguage: 'ko-KR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/archive?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// ─── Article 스키마 만들기 ────────────────────────────────────
export function getArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName = 'PAGEONEWORKS 편집부',
  category,
  tags = [],
}: {
  title: string
  description: string
  url: string
  imageUrl: string
  datePublished: string
  dateModified?: string
  authorName?: string
  category?: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'PAGEONEWORKS',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
      },
    },
    articleSection: category,
    keywords: tags.join(', '),
    inLanguage: 'ko-KR',
    isAccessibleForFree: true,
  }
}

// ─── FAQPage 스키마 만들기 (AI 브리핑 핵심) ──────────────────
export function getFAQSchema(faqs: { q: string; a: string }[]) {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

// ─── BreadcrumbList 스키마 만들기 ─────────────────────────────
// 빵부스러기 = 홈 > 카테고리 > 아티클 이런 경로 표시
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ─── Speakable 스키마 만들기 (네이버 AI 브리핑 음성 읽기) ────
export function getSpeakableSchema(url: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.speakable-summary', '.article-lead'],
    },
  }
}

// ─── WebPage / CollectionPage 스키마 만들기 ──────────────────
export function getWebPageSchema({
  name,
  url,
  description,
  type = 'WebPage',
}: {
  name: string
  url: string
  description: string
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url,
    description,
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'PAGEONEWORKS',
      url: BASE_URL,
    },
  }
}

// ─── ItemList 스키마 만들기 (카테고리 페이지용) ───────────────
export function getItemListSchema(
  listName: string,
  items: { title: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: item.url,
    })),
  }
}

// ─── 아티클 body에서 FAQ 자동 추출 ───────────────────────────
// body 안에 있는 Q. 질문 / A. 답변 패턴을 자동으로 찾아냄
export function extractFAQsFromBody(
  body: string
): { q: string; a: string }[] {
  if (!body) return []
  const faqs: { q: string; a: string }[] = []
  const lines = body.split('\n')
  let currentQ = ''
  let currentALines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('Q. ')) {
      if (currentQ && currentALines.length > 0) {
        faqs.push({ q: currentQ, a: currentALines.join(' ').trim() })
      }
      currentQ = trimmed.replace(/^Q\.\s*/, '')
      currentALines = []
    } else if (trimmed.startsWith('A. ') && currentQ) {
      currentALines = [trimmed.replace(/^A\.\s*/, '')]
    } else if (currentQ && currentALines.length > 0 && trimmed) {
      currentALines.push(trimmed)
    }
  }

  if (currentQ && currentALines.length > 0) {
    faqs.push({ q: currentQ, a: currentALines.join(' ').trim() })
  }

  return faqs
}

// ─── 날짜 변환 헬퍼 ───────────────────────────────────────────
// 2026.05.13 → 2026-05-13 (구글이 읽는 형식)
export function normalizeDate(dateStr: string): string {
  return dateStr.replace(/\./g, '-')
}