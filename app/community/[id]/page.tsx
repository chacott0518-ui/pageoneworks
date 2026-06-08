// app/community/[id]/page.tsx

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { SkeletonPostList } from '@/components/community/SkeletonPostCard'
import type { TrendingPost } from '@/components/community/types'
import type { Metadata } from 'next'

const PostDetail = dynamic(() => import('@/components/community/PostDetail'), {
  loading: () => <PostDetailLoadingFallback />,
})

interface Props {
  params: { id: string }
}

const BASE_URL = 'https://www.pageoneworks.com'
const HIDDEN_FILTER = 'is_hidden.is.null,is_hidden.eq.false'

const POST_COLUMNS =
  'id,user_id,title,content,category_slug,tags,images,is_anonymous,view_count,like_count,comment_count,created_at'

type PostProfile = {
  nickname: string
  level: number
  avatar_url: string | null
}

type PostDetailData = {
  id: string
  user_id: string | null
  title: string
  content: string
  category_slug: string
  tags?: string[] | null
  images?: string[] | null
  is_anonymous?: boolean | null
  view_count: number | null
  like_count: number | null
  comment_count: number | null
  created_at: string
  profiles: PostProfile | null
}

type RelatedPostItem = {
  id: string
  title: string
  category_slug: string
  view_count: number | null
}

function normalizeProfile<T extends { profiles?: PostProfile | PostProfile[] | null }>(
  row: T
): T & { profiles: PostProfile | null } {
  const p = row.profiles
  const profiles = Array.isArray(p) ? p[0] ?? null : p ?? null
  return { ...row, profiles }
}

function PostDetailLoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d0f',
        paddingTop: '60px',
        fontFamily: 'Inter, Pretendard, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div
          className="animate-pulse"
          style={{
            height: 24,
            width: 160,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            marginBottom: 16,
          }}
        />
        <div
          style={{
            borderRadius: 8,
            border: '0.5px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div style={{ height: 14, width: 80, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
          <div style={{ height: 28, width: '70%', borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />
          <div style={{ height: 12, width: 200, borderRadius: 4, background: 'rgba(255,255,255,0.04)', marginBottom: 24 }} />
          <div style={{ height: 120, borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <SkeletonPostList count={4} />
      </div>
    </div>
  )
}

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
    .select(`${POST_COLUMNS}, profiles(nickname, avatar_url, level)`)
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  const [{ data: relatedRaw }, { data: trendingRaw }] = await Promise.all([
    supabase
      .from('community_posts')
      .select('id, title, category_slug, view_count')
      .eq('category_slug', post.category_slug)
      .neq('id', params.id)
      .or(HIDDEN_FILTER)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('community_posts')
      .select('id, category_slug, title, view_count, comment_count, created_at')
      .or(HIDDEN_FILTER)
      .order('view_count', { ascending: false })
      .limit(5),
  ])

  const initialPost = normalizeProfile(post) as PostDetailData
  const relatedPosts = (relatedRaw ?? []) as RelatedPostItem[]
  const trendingPosts = (trendingRaw ?? []) as TrendingPost[]

  const postUrl = `${BASE_URL}/community/${params.id}`
  const authorName = post.is_anonymous
    ? '익명'
    : (normalizeProfile(post).profiles?.nickname ?? '회원')

  const discussionSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: post.title,
    text: post.content,
    url: postUrl,
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: 'PAGEONEWORKS',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/og-default.jpg` },
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
    publisher: { '@type': 'Organization', name: 'PAGEONEWORKS', url: BASE_URL },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'PAGEONEWORKS 커뮤니티 이용 방법',
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
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.speakable-summary'] },
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
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/og-default.jpg` },
    sameAs: ['https://www.instagram.com/pageoneworks', 'https://www.youtube.com/@pageoneworks'],
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
      <Suspense fallback={<PostDetailLoadingFallback />}>
        <PostDetail
          postId={params.id}
          initialPost={initialPost}
          relatedPosts={relatedPosts}
          trendingPosts={trendingPosts}
        />
      </Suspense>
    </>
  )
}
