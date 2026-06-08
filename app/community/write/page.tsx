// app/community/write/page.tsx

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import WriteForm from '@/components/community/WriteForm'

const BASE_URL = 'https://www.pageoneworks.com'
const PAGE_URL = `${BASE_URL}/community/write`

export const metadata: Metadata = {
  title: '글쓰기 | PAGEONEWORKS 커뮤니티',
  description: 'PAGEONEWORKS 프리미엄 커뮤니티에 새 글을 작성하세요.',
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: false },
}

function buildSchemas() {
  const discussionForumSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    name: 'PAGEONEWORKS 커뮤니티 글쓰기',
    url: PAGE_URL,
    description: '프리미엄 커뮤니티 글 작성 페이지',
    publisher: { '@type': 'Organization', name: 'PAGEONEWORKS', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '글쓰기는 로그인이 필요한가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네. 글쓰기는 로그인 후 이용할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '몇 개의 카테고리에서 글을 쓸 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '21개 카테고리 중 원하는 분야를 선택해 글을 작성할 수 있습니다.',
        },
      },
    ],
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '글쓰기 | PAGEONEWORKS 커뮤니티',
    url: PAGE_URL,
    description: '커뮤니티 새 글 작성',
    publisher: { '@type': 'Organization', name: 'PAGEONEWORKS', url: BASE_URL },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: '커뮤니티 글 작성 방법',
    description: '카테고리 선택부터 게시까지',
    step: [
      { '@type': 'HowToStep', position: 1, name: '로그인', text: '구글 또는 카카오로 로그인합니다.' },
      { '@type': 'HowToStep', position: 2, name: '카테고리 선택', text: '21개 카테고리 중 하나를 선택합니다.' },
      { '@type': 'HowToStep', position: 3, name: '내용 작성', text: '제목과 본문, 태그를 입력합니다.' },
      { '@type': 'HowToStep', position: 4, name: '게시', text: '게시하기 버튼을 눌러 글을 등록합니다.' },
    ],
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'PAGEONEWORKS 커뮤니티 글쓰기',
    url: PAGE_URL,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.speakable-summary'] },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '커뮤니티', item: `${BASE_URL}/community` },
      { '@type': 'ListItem', position: 3, name: '글쓰기', item: PAGE_URL },
    ],
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PAGEONEWORKS',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/og-default.jpg` },
    sameAs: ['https://www.instagram.com/pageoneworks', 'https://www.youtube.com/@pageoneworks'],
  }

  return {
    discussionForumSchema,
    faqSchema,
    webPageSchema,
    howToSchema,
    speakableSchema,
    breadcrumbSchema,
    organizationSchema,
  }
}

export default async function CommunityWritePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/community/write')
  }

  const schemas = buildSchemas()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.discussionForumSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organizationSchema) }} />
      <WriteForm userId={user.id} />
    </>
  )
}
