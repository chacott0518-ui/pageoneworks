import type { Metadata } from 'next'
import { getBreadcrumbSchema, siteSchema } from '@/lib/schemas'
import ArchiveClient from './ArchiveClient'

export const metadata: Metadata = {
  title: '전체 아티클 아카이브 | PAGEONEWORKS',
  description: '강남 부동산·의료·안티에이징·법률·세무·라이프스타일 전문 매거진 PAGEONEWORKS 전체 아티클 모음',
  alternates: { canonical: 'https://www.pageoneworks.com/archive' },
  openGraph: {
    title: '전체 아티클 아카이브 | PAGEONEWORKS',
    description: '강남 부동산·의료·안티에이징·법률·세무·라이프스타일 전문 매거진 PAGEONEWORKS 전체 아티클 모음',
    url: 'https://www.pageoneworks.com/archive',
    siteName: 'PAGEONEWORKS',
    images: [{ url: 'https://www.pageoneworks.com/og-image.jpg', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: '전체 아티클 아카이브 | PAGEONEWORKS' },
}

const breadcrumbSchema = getBreadcrumbSchema([
  { name: '홈', url: 'https://www.pageoneworks.com' },
  { name: '아카이브', url: 'https://www.pageoneworks.com/archive' },
])

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '전체 아티클 아카이브 | PAGEONEWORKS',
  url: 'https://www.pageoneworks.com/archive',
  description: '강남 부동산·의료·법률·라이프스타일 전문 매거진 전체 아티클 모음',
}

export default function ArchivePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
      <ArchiveClient />
    </>
  )
}
