import type { Metadata } from 'next'
import { getBreadcrumbSchema } from '@/lib/schemas'
import { siteConfig, absoluteUrl } from '@/lib/site.config'
import ArchiveClient from './ArchiveClient'

const archiveUrl = absoluteUrl('/archive')

const archiveTitle = `전체 아티클 아카이브 | ${siteConfig.name}`
const archiveDesc = '강남 부동산·의료·안티에이징·법률·세무·라이프스타일 전문 매거진 PAGEONEWORKS 전체 아티클 모음'

export const metadata: Metadata = {
  title: archiveTitle,
  description: archiveDesc,
  alternates: { canonical: archiveUrl },
  openGraph: {
    title: archiveTitle,
    description: archiveDesc,
    url: archiveUrl,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImagePath, width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: archiveTitle },
}

const breadcrumbSchema = getBreadcrumbSchema([
  { name: '홈', url: siteConfig.baseUrl },
  { name: '아카이브', url: archiveUrl },
])

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: archiveTitle,
  url: archiveUrl,
  description: archiveDesc,
}

export default function ArchivePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <ArchiveClient />
    </>
  )
}
