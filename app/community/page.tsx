// app/community/page.tsx

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import CommunityClient from '@/components/community/CommunityClient'
import { SkeletonPostList } from '@/components/community/SkeletonPostCard'
import { COMMUNITY_CATEGORIES, PAGE_SIZE } from '@/components/community/constants'
import type {
  CategoryCountMap,
  CommunityPost,
  CommunityStats,
  ProfileMini,
  SortKey,
  TrendingPost,
} from '@/components/community/types'
import { getKstTodayStartISO, parsePage, parseSort } from '@/components/community/utils'

const PAGE_URL = 'https://www.pageoneworks.com/community'
const BASE_URL = 'https://www.pageoneworks.com'

const DEFAULT_NOTICE_TEXT =
  '커뮤니티 이용 규칙을 준수해 주세요. 광고·도배·욕설 금지'

const POST_LIST_COLUMNS =
  'id,title,category_slug,like_count,comment_count,view_count,created_at,is_pinned,user_id'

export const metadata: Metadata = {
  title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
  description:
    '부동산·주식·IT·법률·건강 등 21개 카테고리에서 전문가와 함께하는 프리미엄 커뮤니티. 최신글·인기글·댓글많은글을 한눈에 확인하세요.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    description: '검증된 인사이트를 공유하는 PAGEONEWORKS 프리미엄 커뮤니티',
    siteName: 'PAGEONEWORKS',
    images: [{ url: `${BASE_URL}/og-community.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    description: '검증된 인사이트를 공유하는 PAGEONEWORKS 프리미엄 커뮤니티',
    images: [`${BASE_URL}/og-community.jpg`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

function buildSchemas() {
  const discussionForumSchema = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    name: 'PAGEONEWORKS 커뮤니티',
    url: PAGE_URL,
    description: '21개 카테고리 프리미엄 커뮤니티 포럼',
    author: { '@type': 'Organization', name: 'PAGEONEWORKS', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'PAGEONEWORKS', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '커뮤니티 글은 로그인 없이 볼 수 있나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '네. 글 읽기는 로그인 없이 가능합니다. 글쓰기·댓글·좋아요는 로그인 후 이용할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '인기순 정렬 기준은 무엇인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '인기순은 조회수(view_count)를 기준으로 정렬됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '카테고리는 몇 개인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '전체를 포함해 21개 카테고리를 운영합니다. PC에서는 좌측 사이드바, 모바일에서는 상단 칩으로 선택할 수 있습니다.',
        },
      },
    ],
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    url: PAGE_URL,
    description: 'PAGEONEWORKS 프리미엄 커뮤니티 — 최신·인기·댓글많은 글',
    publisher: { '@type': 'Organization', name: 'PAGEONEWORKS', url: BASE_URL },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'PAGEONEWORKS 커뮤니티 이용 방법',
    description: '카테고리 선택, 정렬, 글쓰기까지 커뮤니티 이용 가이드',
    step: [
      { '@type': 'HowToStep', position: 1, name: '카테고리 선택', text: '관심 카테고리를 선택합니다.' },
      { '@type': 'HowToStep', position: 2, name: '정렬 선택', text: '최신순·인기순·댓글많은순 중 선택합니다.' },
      { '@type': 'HowToStep', position: 3, name: '글 읽기', text: '목록에서 글을 클릭해 상세 내용을 확인합니다.' },
      { '@type': 'HowToStep', position: 4, name: '글쓰기', text: '로그인 후 글쓰기 버튼으로 새 글을 작성합니다.' },
    ],
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'PAGEONEWORKS 커뮤니티',
    url: PAGE_URL,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.speakable-summary'] },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '커뮤니티', item: PAGE_URL },
    ],
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PAGEONEWORKS',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
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

async function fetchCategoryCounts(supabase: ReturnType<typeof createServerSupabaseClient>): Promise<CategoryCountMap> {
  const counts: CategoryCountMap = { all: 0 }
  COMMUNITY_CATEGORIES.forEach((c) => {
    counts[c.slug] = 0
  })

  const { data } = await supabase
    .from('community_posts')
    .select('category_slug')
    .or('is_hidden.is.null,is_hidden.eq.false')

  if (data) {
    for (const row of data) {
      const slug = row.category_slug as string
      counts.all = (counts.all ?? 0) + 1
      if (counts[slug] !== undefined) counts[slug] += 1
      else counts[slug] = 1
    }
  }

  return counts
}

async function fetchStats(supabase: ReturnType<typeof createServerSupabaseClient>): Promise<CommunityStats> {
  const todayStart = getKstTodayStartISO()
  const hiddenFilter = 'is_hidden.is.null,is_hidden.eq.false'

  const [todayPostsRes, todayCommentsRes, todayMembersRes, todayViewsRes] = await Promise.all([
    supabase
      .from('community_posts')
      .select('id', { count: 'exact', head: true })
      .or(hiddenFilter)
      .gte('created_at', todayStart),
    supabase
      .from('community_comments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart),
    supabase
      .from('community_posts')
      .select('view_count')
      .or(hiddenFilter)
      .gte('created_at', todayStart),
  ])

  const todayVisits = (todayViewsRes.data ?? []).reduce(
    (sum, row) => sum + (Number(row.view_count) || 0),
    0
  )

  return {
    todayNewPosts: todayPostsRes.count ?? 0,
    todayComments: todayCommentsRes.count ?? 0,
    todayVisits,
    todayNewMembers: todayMembersRes.count ?? 0,
  }
}

function CommunityLoadingFallback() {
  return (
    <div
      className="min-h-screen pt-[60px] pb-[72px] min-[1200px]:pb-0"
      style={{ background: '#0d0d0f', fontFamily: 'Inter, Pretendard, sans-serif' }}
    >
      <div className="border-b px-4 md:px-6 py-5" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="h-3 w-16 rounded animate-pulse mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-7 w-48 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-5">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}
        >
          <SkeletonPostList count={8} />
        </div>
      </div>
    </div>
  )
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: { category?: string; sort?: string; page?: string }
}) {
  const category = (searchParams?.category ?? 'all').trim()
  const sort = parseSort(searchParams?.sort)
  const page = parsePage(searchParams?.page)
  const supabase = createServerSupabaseClient()
  const hiddenFilter = 'is_hidden.is.null,is_hidden.eq.false'

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let listQuery = supabase
    .from('community_posts')
    .select(POST_LIST_COLUMNS, { count: 'exact' })
    .or(hiddenFilter)

  if (category !== 'all') {
    listQuery = listQuery.eq('category_slug', category)
  }

  if (sort === 'popular') listQuery = listQuery.order('view_count', { ascending: false })
  else if (sort === 'comment') listQuery = listQuery.order('comment_count', { ascending: false })
  else listQuery = listQuery.order('created_at', { ascending: false })

  listQuery = listQuery.order('is_pinned', { ascending: false, nullsFirst: false }).range(from, to)

  const [
    { data: postsRaw, count: totalCount },
    { data: trendingRaw },
    { data: pinnedRaw },
    stats,
    categoryCounts,
    { data: { user } },
  ] = await Promise.all([
    listQuery,
    supabase
      .from('community_posts')
      .select('id,category_slug,title,view_count,comment_count,created_at')
      .or(hiddenFilter)
      .order('view_count', { ascending: false })
      .limit(5),
    supabase
      .from('community_posts')
      .select('id,title,category_slug,is_pinned')
      .or(hiddenFilter)
      .eq('is_pinned', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    fetchStats(supabase),
    fetchCategoryCounts(supabase),
    supabase.auth.getUser(),
  ])

  let profile: ProfileMini | null = null
  if (user) {
    const { data: profileRow } = await supabase
      .from('profiles')
      .select('id,nickname,avatar_url,level')
      .eq('id', user.id)
      .maybeSingle()
    if (profileRow) {
      profile = {
        ...profileRow,
        post_count: null,
        is_admin: null,
      } as ProfileMini
    }
  }

  const initialPosts = (postsRaw ?? []).map((row) => ({
    ...row,
    content: '',
    is_hidden: null,
  })) as CommunityPost[]
  const trending = (trendingRaw ?? []) as TrendingPost[]
  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / PAGE_SIZE))
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

      <Suspense fallback={<CommunityLoadingFallback />}>
        <CommunityClient
          initialPosts={initialPosts}
          initialStats={stats}
          initialTrending={trending}
          initialCategoryCounts={categoryCounts}
          pinnedNotice={pinnedRaw ?? null}
          noticeFallbackText={DEFAULT_NOTICE_TEXT}
          profile={profile}
          currentCategory={category}
          currentSort={sort}
          page={page}
          totalPages={totalPages}
        />
      </Suspense>
    </>
  )
}
