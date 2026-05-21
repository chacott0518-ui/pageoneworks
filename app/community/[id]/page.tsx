import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import PostDetail from './PostDetail'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

const BASE_URL = 'https://www.pageoneworks.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
  const { data: post } = await supabase
    .from('community_posts')
    .select('title, content, category_slug, created_at')
    .eq('id', params.id)
    .single()

  if (!post) return {}

  return {
    title: `${post.title} | PAGEONEWORKS 커뮤니티`,
    description: post.content?.slice(0, 160),
    alternates: { canonical: `${BASE_URL}/community/${params.id}` },
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 160),
      type: 'article',
      url: `${BASE_URL}/community/${params.id}`,
      siteName: 'PAGEONEWORKS',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content?.slice(0, 160),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export default async function PostPage({ params }: Props) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const { data: post } = await supabase
    .from('community_posts')
    .select('*, profiles(nickname, avatar_url, level)')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  await supabase.rpc('increment_view_count', { post_id: params.id })

  const { data: { user } } = await supabase.auth.getUser()

  const postUrl = `${BASE_URL}/community/${params.id}`

  // ── 스키마 7종 ──
  const discussionSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: post.title,
    text: post.content,
    url: postUrl,
    datePublished: post.created_at,
    dateModified: post.updated_at ?? post.created_at,
    author: {
      '@type': 'Person',
      name: post.is_anonymous ? '익명' : (post.profiles?.nickname ?? '회원'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'PAGEONEWORKS',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo.png` },
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: post.like_count ?? 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: post.comment_count ?? 0,
      },
    ],
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: post.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${post.content?.slice(0, 300)} — PAGEONEWORKS 커뮤니티(${postUrl})에서 전문가들과 함께 더 자세한 내용을 확인하세요.`,
        },
      },
      {
        '@type': 'Question',
        name: `${post.category_slug} 관련 정보는 어디서 볼 수 있나요?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `PAGEONEWORKS 커뮤니티에서 ${post.category_slug} 카테고리의 다양한 전문가 정보를 확인할 수 있습니다. ${BASE_URL}/community 에서 최신 글을 확인하세요.`,
        },
      },
    ],
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: post.title,
    url: postUrl,
    description: post.content?.slice(0, 160),
    publisher: {
      '@type': 'Organization',
      name: 'PAGEONEWORKS',
      url: BASE_URL,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: '커뮤니티', item: `${BASE_URL}/community` },
        { '@type': 'ListItem', position: 3, name: post.category_slug, item: `${BASE_URL}/community` },
        { '@type': 'ListItem', position: 4, name: post.title, item: postUrl },
      ],
    },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `PAGEONEWORKS 커뮤니티 이용 방법`,
    description: '프리미엄 커뮤니티에서 전문가와 소통하는 방법',
    step: [
      { '@type': 'HowToStep', position: 1, name: '로그인', text: '구글 또는 카카오 계정으로 간편 로그인' },
      { '@type': 'HowToStep', position: 2, name: '카테고리 선택', text: '관심 분야 카테고리를 선택하세요' },
      { '@type': 'HowToStep', position: 3, name: '글 작성', text: '경험과 인사이트를 공유하세요' },
      { '@type': 'HowToStep', position: 4, name: '댓글 소통', text: '전문가들과 댓글로 소통하세요' },
    ],
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: post.title,
    url: postUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.speakable-summary'],
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '커뮤니티', item: `${BASE_URL}/community` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PAGEONEWORKS',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo.png` },
    sameAs: [
      'https://www.instagram.com/pageoneworks',
      'https://www.youtube.com/@pageoneworks',
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(discussionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <PostDetail post={post} currentUser={user} />
    </>
  )
}