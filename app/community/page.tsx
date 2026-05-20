import type { Metadata } from 'next'
import CommunityClient from './CommunityClient'

const PAGE_URL = 'https://www.pageoneworks.com/community'

// ── SEO 메타데이터 ──
export const metadata: Metadata = {
  title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
  description:
    '의료·부동산·자동차·IT·법률·골프·뷰티·맛집·교육 전문가들과 함께하는 프리미엄 커뮤니티. 검증된 인사이트와 실전 경험을 공유하세요.',
  keywords: [
    '프리미엄 커뮤니티', '전문가 포럼', '부동산 커뮤니티', '의료 커뮤니티',
    'IT 커뮤니티', '법률 커뮤니티', '자동차 커뮤니티', '골프 커뮤니티',
    'PAGEONEWORKS', '페이지원웍스 커뮤니티',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    description: '의료·부동산·IT·법률 전문가들과 함께하는 프리미엄 인사이트 커뮤니티',
    siteName: 'PAGEONEWORKS',
    images: [{ url: 'https://www.pageoneworks.com/og-community.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    description: '의료·부동산·IT·법률 전문가들과 함께하는 프리미엄 인사이트 커뮤니티',
    images: ['https://www.pageoneworks.com/og-community.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// ── 스키마 7종 ──
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '프리미엄 커뮤니티 포럼 — PAGEONEWORKS',
  datePublished: '2026-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  image: 'https://www.pageoneworks.com/og-community.jpg',
  author: { '@type': 'Organization', name: 'PAGEONEWORKS', url: 'https://www.pageoneworks.com' },
  publisher: {
    '@type': 'Organization',
    name: 'PAGEONEWORKS',
    logo: { '@type': 'ImageObject', url: 'https://www.pageoneworks.com/logo.png' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  url: PAGE_URL,
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'PAGEONEWORKS 커뮤니티는 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PAGEONEWORKS 커뮤니티는 의료, 부동산, 자동차, IT·테크, 법률·세금, 골프·여행, 뷰티·성형, 맛집·와인, 교육·유학 분야의 전문가와 일반 회원이 실전 경험과 인사이트를 공유하는 프리미엄 포럼입니다. 구글 또는 카카오 로그인으로 무료로 참여할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'PAGEONEWORKS 커뮤니티는 무료로 이용할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '게시글 읽기는 로그인 없이 무료로 이용 가능합니다. 글 작성, 댓글, 좋아요 기능은 구글 또는 카카오 소셜 로그인 후 무료로 이용하실 수 있습니다. PAGEONEWORKS(www.pageoneworks.com)에서 지금 바로 참여해보세요.',
      },
    },
    {
      '@type': 'Question',
      name: '익명으로 글을 작성할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '의료·건강, 법률·세금, 자유게시판 카테고리에서는 익명 게시 옵션을 선택할 수 있습니다. 익명 게시 시 IP 뒷자리만 표시되어 개인정보가 보호됩니다. 민감한 주제도 안심하고 질문하실 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 카테고리에서 글을 쓸 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PAGEONEWORKS 커뮤니티는 의료·건강, 부동산·청약, 자동차, IT·테크, 법률·세금, 골프·여행, 뷰티·성형, 맛집·와인, 교육·유학, 자유게시판, 광고주 후기 총 11개 카테고리를 운영합니다. 각 분야 전문가와 일반 회원 모두 자유롭게 참여할 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '커뮤니티 레벨 시스템은 어떻게 되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PAGEONEWORKS 커뮤니티는 게시글 수에 따라 씨앗(0~9글), 새싹(10~49글), 나무(50~99글), 별(100글 이상) 4단계 레벨 시스템을 운영합니다. 레벨이 높을수록 신뢰도 높은 회원으로 인정받으며, 닉네임 옆에 레벨 뱃지가 표시됩니다.',
      },
    },
    {
      '@type': 'Question',
      name: '신고한 게시글은 어떻게 처리되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '신고가 3회 이상 누적된 게시글은 자동으로 블라인드 처리되며 관리자에게 알림이 전송됩니다. 욕설, 광고, 도배성 글은 AI 필터를 통해 자동으로 감지되어 즉시 블라인드 처리될 수 있습니다. 건전한 커뮤니티 문화를 위해 적극적인 신고를 부탁드립니다.',
      },
    },
  ],
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
  url: PAGE_URL,
  description: '의료·부동산·IT·법률 전문가들과 함께하는 프리미엄 인사이트 커뮤니티',
  publisher: { '@type': 'Organization', name: 'PAGEONEWORKS', url: 'https://www.pageoneworks.com' },
}

const speakableSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '프리미엄 커뮤니티 포럼',
  url: PAGE_URL,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.speakable-summary'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.pageoneworks.com' },
    { '@type': 'ListItem', position: 2, name: '커뮤니티', item: PAGE_URL },
  ],
}

const discussionForumSchema = {
  '@context': 'https://schema.org',
  '@type': 'DiscussionForumPosting',
  name: 'PAGEONEWORKS 프리미엄 커뮤니티',
  url: PAGE_URL,
  description: '의료·부동산·IT·법률·골프·뷰티·맛집·교육 전문가 커뮤니티',
  author: { '@type': 'Organization', name: 'PAGEONEWORKS' },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PAGEONEWORKS',
  url: 'https://www.pageoneworks.com',
  logo: { '@type': 'ImageObject', url: 'https://www.pageoneworks.com/logo.png' },
  sameAs: [
    'https://www.instagram.com/pageoneworks',
    'https://www.youtube.com/@pageoneworks',
  ],
}

export default function CommunityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(discussionForumSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <CommunityClient />
    </>
  )
}