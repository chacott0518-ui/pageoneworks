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
import { siteConfig, absoluteUrl } from '@/lib/site.config'

const PAGE_URL = absoluteUrl('/community')
const BASE_URL = siteConfig.baseUrl

const POST_LIST_COLUMNS =
  'id,title,category_slug,like_count,comment_count,view_count,created_at,is_pinned,user_id,is_anonymous,profiles(nickname,avatar_url,level)'

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
    images: [{ url: absoluteUrl(siteConfig.ogImagePath), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    description: '검증된 인사이트를 공유하는 PAGEONEWORKS 프리미엄 커뮤니티',
    images: [absoluteUrl(siteConfig.ogImagePath)],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

function buildSchemas(posts: { id: string; title: string }[]) {
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: '프리미엄 커뮤니티 포럼 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 프리미엄 커뮤니티 — 최신·인기·댓글많은 글',
    isPartOf: { '@id': siteConfig.websiteId },
    publisher: { '@id': siteConfig.publisherId },
    inLanguage: siteConfig.language,
    ...(posts.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: posts.length,
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BASE_URL}/community/${p.id}`,
          name: p.title,
        })),
      },
    }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '커뮤니티', item: PAGE_URL },
    ],
  }

  return {
    collectionPageSchema,
    breadcrumbSchema,
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

async function fetchActiveNotices(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const { data, error } = await supabase
    .from('community_notices')
    .select('id, title, content')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
  if (error) return []
  return data ?? []
}

async function fetchHeroAds(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const { data, error } = await supabase
    .from('ad_banners')
    .select('slot_name, image_url, link_url, is_active')
    .in('slot_name', ['pc_hero', 'mobile_hero'])
  if (error) return { pc: null, mobile: null }
  const rows = data ?? []
  return {
    pc: rows.find((r) => r.slot_name === 'pc_hero') ?? null,
    mobile: rows.find((r) => r.slot_name === 'mobile_hero') ?? null,
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
    activeNotices,
    heroAds,
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
    fetchActiveNotices(supabase),
    fetchHeroAds(supabase),
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
  const schemas = buildSchemas(
    initialPosts.map((p) => ({ id: p.id, title: p.title }))
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }} />

      <Suspense fallback={<CommunityLoadingFallback />}>
        <CommunityClient
          initialPosts={initialPosts}
          initialStats={stats}
          initialTrending={trending}
          initialCategoryCounts={categoryCounts}
          initialNotices={activeNotices}
          initialPcHeroAd={heroAds.pc}
          initialMobileHeroAd={heroAds.mobile}
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
