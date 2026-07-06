import type { Metadata } from 'next'
import {
  webSiteSchema,
  getBreadcrumbSchema,
  getItemListSchema,
} from '@/lib/schemas'
import { siteConfig } from '@/lib/site.config'
import { articles } from '@/lib/data'
import { getLatestArticles } from '@/lib/article-selectors'
import HomeClient from './HomeClient'

const SITE_URL = siteConfig.baseUrl

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    '의료·안티에이징·부동산·모빌리티·법률·금융·라이프스타일·뷰티·미식·교육 분야 최고 전문가들의 프리미엄 콘텐츠. 네이버 AI 브리핑·구글 AI Overview에 인용되는 검증된 인사이트.',
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    title: 'PAGEONEWORKS — 프리미엄 라이프스타일 매거진',
    description: '의료·부동산·모빌리티·법률·금융·라이프스타일·뷰티·미식·교육 프리미엄 웹 매거진',
    type: 'website',
    url: SITE_URL,
    siteName: 'PAGEONEWORKS',
    locale: 'ko_KR',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAGEONEWORKS — 프리미엄 라이프스타일 매거진',
    description: '의료·부동산·모빌리티·법률·금융·라이프스타일 프리미엄 웹 매거진',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'z4InSUzW93WSmuLC9KrIgmXMBT5mKgO5rmhxJ6YtALo',
    other: { 'naver-site-verification': 'e022afdd6733e34ed024626ec671c1401bcc3271' },
  },
}

// ─── 스키마 ───────────────────────────────────────────────────
const breadcrumbSchema = getBreadcrumbSchema([
  { name: '홈', url: SITE_URL },
])

const featuredArticles = getLatestArticles(articles, 10)
const itemListSchema = getItemListSchema(
  'PAGEONEWORKS 최신 아티클',
  featuredArticles.map((a) => ({
    title: a.titleKo,
    url: `${SITE_URL}/article/${a.slug}`,
  }))
)

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <HomeClient />
    </>
  )
}