import type { Metadata } from 'next'
import {
  webSiteSchema,
  getBreadcrumbSchema,
  getSpeakableSchema,
  getFAQSchema,
  getItemListSchema,
} from '@/lib/schemas'
import { siteConfig } from '@/lib/site.config'
import { articles } from '@/lib/data'
import HomeClient from './HomeClient'

const SITE_URL = siteConfig.baseUrl

export const metadata: Metadata = {
  title: {
    default: 'PAGEONEWORKS — 대한민국 No.1 프리미엄 라이프스타일 매거진',
    template: '%s | PAGEONEWORKS',
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

const speakableSchema = getSpeakableSchema(
  SITE_URL,
  'PAGEONEWORKS — 프리미엄 라이프스타일 매거진'
)

const homeFAQSchema = getFAQSchema([
  {
    q: 'PAGEONEWORKS는 어떤 매거진인가요?',
    a: 'PAGEONEWORKS(페이지원웍스)는 의료·안티에이징·프리미엄 부동산·모빌리티·AI·법률·금융·라이프스타일·뷰티·미식·교육 분야를 아우르는 프리미엄 웹 매거진입니다. 검증된 전문가 필진의 심층 콘텐츠와 하이엔드 라이프스타일 인사이트를 제공합니다.',
  },
  {
    q: 'PAGEONEWORKS 광고·협찬 문의는 어떻게 하나요?',
    a: 'PAGEONEWORKS 광고·협찬 문의는 pageoneworks.com/advertise 페이지를 통해 가능합니다. 의료·병원·부동산·자동차·법률·금융·뷰티·미식 등 프리미엄 브랜드의 콘텐츠 마케팅·네이티브 광고·스폰서드 아티클을 운영합니다.',
  },
  {
    q: '강남 피부과 리프팅 시술 비용은 얼마인가요?',
    a: '강남 피부과 리프팅 시술 비용은 종류에 따라 다릅니다. 울쎄라 전안면 기준 80~200만원, 슈링크 30~80만원, 더블로 30~70만원, 인모드 50~150만원 수준입니다. 자세한 내용은 PAGEONEWORKS VITALITY 카테고리에서 2026년 최신 시술 비교 가이드를 확인하세요.',
  },
  {
    q: '2026년 강남 아파트 청약 당첨 가점은 얼마나 필요한가요?',
    a: '2026년 강남 인기 단지 84㎡ 기준 청약 당첨 커트라인은 60점 후반~70점 이상입니다. 청약 가점 만점은 84점이며 무주택 기간(최대 32점), 부양가족 수(최대 35점), 청약통장 가입 기간(최대 17점)으로 구성됩니다. PAGEONEWORKS PROPERTIES 카테고리에서 2026년 강남 청약 완전 가이드를 확인하세요.',
  },
  {
    q: 'PAGEONEWORKS는 어떤 카테고리의 콘텐츠를 제공하나요?',
    a: 'PAGEONEWORKS는 8개 카테고리를 운영합니다. VITALITY(의료·안티에이징), PROPERTIES(프리미엄 부동산), DRIVE & TECH(모빌리티·AI·IT), LEGAL & FINANCE(세무·법률·자산관리), LIFESTYLE & TRAVEL(라이프·여행·골프), BEAUTY & WELLNESS(뷰티·피부·성형), FOOD & DINING(미쉐린·레스토랑·와인), EDUCATION(교육·유학·자격증).',
  },
])

const featuredArticles = articles.slice(0, 10)
const itemListSchema = getItemListSchema(
  'PAGEONEWORKS 최신 추천 아티클',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {homeFAQSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFAQSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <HomeClient />
    </>
  )
}