// components/community/CommunityClient.tsx

'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Clock, Flame, MessageCircle, X } from 'lucide-react'
import { CategorySidebar, MobileCategoryChips } from './CategorySidebar'
import { PostCard } from './PostCard'
import { TrendingSidebar } from './TrendingSidebar'
import { AvatarCard } from './AvatarCard'
import { Pagination } from './Pagination'
import { MobileTabBar } from './MobileTabBar'
import { SkeletonPostList } from './SkeletonPostCard'
import { NoticeBanner, type CommunityNoticeItem } from './NoticeBanner'
import { PcHeroAd, MobileHeroAd, type HeroAdData } from './HeroAdBanner'
import { COMMUNITY_COLORS } from './constants'
import type {
  CategoryCountMap,
  CommunityPost,
  CommunityStats,
  ProfileMini,
  SortKey,
  TrendingPost,
} from './types'

const TEXT_DATE = 'rgba(255,255,255,0.5)'
const TEXT_SORT_INACTIVE = 'rgba(255,255,255,0.55)'
const TEXT_TRENDING_TITLE = 'rgba(255,255,255,0.75)'
const TEXT_TRENDING_SUB = 'rgba(255,255,255,0.45)'
const TEXT_FOOTER = 'rgba(255,255,255,0.35)'
const GOLD = '#C9A96E'

export default function CommunityClient({
  initialPosts,
  initialStats,
  initialTrending,
  initialCategoryCounts,
  initialNotices,
  initialPcHeroAd,
  initialMobileHeroAd,
  profile,
  currentCategory,
  currentSort,
  page,
  totalPages,
}: {
  initialPosts: CommunityPost[]
  initialStats: CommunityStats
  initialTrending: TrendingPost[]
  initialCategoryCounts: CategoryCountMap
  initialNotices: CommunityNoticeItem[]
  initialPcHeroAd: HeroAdData | null
  initialMobileHeroAd: HeroAdData | null
  profile: ProfileMini | null
  currentCategory: string
  currentSort: SortKey
  page: number
  totalPages: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const supabase = useMemo(() => createClient(), [])

  const [loginOpen, setLoginOpen] = useState(false)
  const [displayPosts, setDisplayPosts] = useState(initialPosts)
  const [displayStats] = useState(initialStats)
  const [displayTrending] = useState(initialTrending)
  const [displayCategoryCounts] = useState(initialCategoryCounts)
  const [displayNotices, setDisplayNotices] = useState(initialNotices)
  const [pcHeroAd] = useState(initialPcHeroAd)
  const [mobileHeroAd] = useState(initialMobileHeroAd)

  useEffect(() => {
    setDisplayPosts(initialPosts)
  }, [initialPosts])

  useEffect(() => {
    setDisplayNotices(initialNotices)
  }, [initialNotices])

  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'community-hide-floating-buttons'
    style.textContent =
      'button[aria-label="AI 에디터에게 질문하기"] { display: none !important; visibility: hidden !important; pointer-events: none !important; }'
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'community-right-sidebar-layout'
    style.textContent =
      '.community-right-sidebar > aside { display: block !important; width: 100% !important; padding: 0 !important; }'
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])

  useEffect(() => {
    const intent = localStorage.getItem('community_write_intent')
    if (intent === '1') {
      localStorage.removeItem('community_write_intent')
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) router.push('/community/write')
      })
    }
  }, [router, supabase])

  const buildUrl = useCallback(
    (next: { category?: string; sort?: SortKey; page?: number }) => {
      const category = next.category ?? currentCategory
      const sort = next.sort ?? currentSort
      const p = next.page ?? 1
      const sp = new URLSearchParams(searchParams.toString())
      if (category && category !== 'all') sp.set('category', category)
      else sp.delete('category')
      if (sort && sort !== 'latest') sp.set('sort', sort)
      else sp.delete('sort')
      if (p && p !== 1) sp.set('page', String(p))
      else sp.delete('page')
      const qs = sp.toString()
      return `/community${qs ? `?${qs}` : ''}`
    },
    [currentCategory, currentSort, searchParams]
  )

  const navigate = useCallback(
    (next: { category?: string; sort?: SortKey; page?: number }) => {
      const url = buildUrl(next)
      startTransition(() => {
        router.push(url)
      })
    },
    [buildUrl, router]
  )

  const handleWrite = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      router.push('/community/write')
      return
    }
    setLoginOpen(true)
  }, [router, supabase])

  const isPopularMobileView = currentSort === 'popular'

  return (
    <div className="pb-[72px] min-[1200px]:pb-0">
      {loginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onGoogle={async () => {
            localStorage.setItem('community_write_intent', '1')
            await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: `${location.origin}/auth/callback?next=/community` },
            })
          }}
          onKakao={async () => {
            localStorage.setItem('community_write_intent', '1')
            await supabase.auth.signInWithOAuth({
              provider: 'kakao',
              options: { redirectTo: `${location.origin}/auth/callback?next=/community` },
            })
          }}
        />
      )}

      <main
        className="min-h-screen pt-[60px]"
        style={{ background: COMMUNITY_COLORS.bg, fontFamily: 'Inter, Pretendard, sans-serif' }}
      >
        <div className="border-b px-4 md:px-6 py-5" style={{ borderColor: COMMUNITY_COLORS.border, background: 'rgba(255,255,255,0.02)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[9px] font-medium uppercase mb-1" style={{ letterSpacing: '1.5px', color: COMMUNITY_COLORS.gold }}>
              Community
            </p>
            <h1 className="text-[22px] md:text-[28px] font-medium speakable-summary" style={{ color: COMMUNITY_COLORS.text }}>
              프리미엄 포럼
            </h1>
            <p className="text-[13px] font-normal mt-1 hidden md:block" style={{ color: COMMUNITY_COLORS.sub }}>
              검증된 인사이트를 공유하는 PAGEONEWORKS 커뮤니티
            </p>
            <PcHeroAd ad={pcHeroAd} />
          </div>
        </div>

        <MobileCategoryChips
          activeCategory={currentCategory}
          onSelect={(slug) => navigate({ category: slug, page: 1 })}
        />
        <MobileHeroAd ad={mobileHeroAd} />

        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex gap-5">
            <CategorySidebar
              activeCategory={currentCategory}
              categoryCounts={displayCategoryCounts}
              onSelect={(slug) => navigate({ category: slug, page: 1 })}
              onWrite={handleWrite}
            />

            <section className="flex-1 min-w-0 py-5 min-[1200px]:border-r min-[1200px]:pr-5" style={{ borderColor: COMMUNITY_COLORS.border }}>
              <NoticeBanner notices={displayNotices} />

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <SortTab active={currentSort === 'latest'} icon={<Clock className="w-3.5 h-3.5" />} label="최신순" onClick={() => navigate({ sort: 'latest', page: 1 })} />
                <SortTab active={currentSort === 'popular'} icon={<Flame className="w-3.5 h-3.5" />} label="인기순" onClick={() => navigate({ sort: 'popular', page: 1 })} />
                <SortTab active={currentSort === 'comment'} icon={<MessageCircle className="w-3.5 h-3.5" />} label="댓글많은순" onClick={() => navigate({ sort: 'comment', page: 1 })} />
                <span className="ml-auto text-[11px] font-medium" style={{ color: TEXT_DATE }}>
                  페이지 {page} / {totalPages}
                </span>
              </div>

              {isPopularMobileView && (
                <div className="min-[1200px]:hidden mb-4 rounded-xl overflow-hidden" style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}`, background: COMMUNITY_COLORS.surface }}>
                  <p className="px-3 py-2 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    🔥 실시간 인기글 TOP5
                  </p>
                  {displayTrending.map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/community/${p.id}`}
                      className="flex gap-2 px-3 py-2 border-t"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                    >
                      <span className="text-[11px] font-medium w-5" style={{ color: i === 0 ? GOLD : 'rgba(255,255,255,0.3)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[12px] font-medium"
                          style={{
                            color: TEXT_TRENDING_TITLE,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.title}
                        </p>
                        <p className="text-[10px] font-normal" style={{ color: TEXT_TRENDING_SUB }}>
                          {p.category_slug} · 조회 {(p.view_count ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div
                className="rounded-xl overflow-hidden"
                style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}`, background: COMMUNITY_COLORS.surface }}
              >
                {isPending ? (
                  <SkeletonPostList count={8} />
                ) : displayPosts.length === 0 ? (
                  <div className="py-16 text-center text-[13px] font-medium" style={{ color: COMMUNITY_COLORS.sub }}>
                    아직 게시글이 없어요.
                  </div>
                ) : (
                  displayPosts.map((post, idx) => (
                    <div key={post.id}>
                      <PostCard post={post} />
                      {idx % 4 === 3 && <MobileInlineAd />}
                    </div>
                  ))
                )}
              </div>

              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => navigate({ page: p })} />
            </section>

            <RightSidebarColumn
              profile={profile}
              trending={displayTrending}
              stats={displayStats}
              onWrite={handleWrite}
            />
          </div>
        </div>

        <CommunityFooter />

        <MobileTabBar onWrite={handleWrite} />
      </main>
    </div>
  )
}

function RightSidebarColumn({
  profile,
  trending,
  stats,
  onWrite,
}: {
  profile: ProfileMini | null
  trending: TrendingPost[]
  stats: CommunityStats
  onWrite: () => void
}) {
  return (
    <div
      className="community-right-sidebar hidden min-[1200px]:block w-[220px] shrink-0 py-6 pl-4"
      style={{ fontFamily: 'Inter, Pretendard, sans-serif' }}
    >
      {profile && <AvatarCard profile={profile} />}
      <SidebarWriteButton onClick={onWrite} />
      <TrendingSidebar trending={trending} stats={stats} profile={null} />
    </div>
  )
}

function SidebarWriteButton({ onClick }: { onClick: () => void }) {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.3)',
    color: GOLD,
    fontSize: '13px',
    fontWeight: 500,
    padding: '10px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 150ms ease',
    fontFamily: 'Inter, Pretendard, sans-serif',
    marginBottom: '20px',
    boxShadow: 'none',
    transform: 'translateY(0)',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="hidden min-[1200px]:flex"
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(201,169,110,0.18)'
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,169,110,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(201,169,110,0.1)'
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <span>✏</span>
      <span>글쓰기</span>
    </button>
  )
}

function SortTab({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium"
      style={{
        borderRadius: '999px',
        border: `0.5px solid ${active ? 'rgba(201,169,110,0.35)' : COMMUNITY_COLORS.border}`,
        color: active ? GOLD : TEXT_SORT_INACTIVE,
        background: active ? 'rgba(201,169,110,0.10)' : 'transparent',
        transition: 'all 150ms ease',
        cursor: 'pointer',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function CommunityFooter() {
  const linkStyle: React.CSSProperties = {
    color: TEXT_FOOTER,
    textDecoration: 'none',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.02em',
  }

  const footerBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    borderTop: '0.5px solid rgba(255,255,255,0.06)',
    fontFamily: 'Inter, Pretendard, sans-serif',
    color: TEXT_FOOTER,
    fontSize: '11px',
    fontWeight: 400,
  }

  return (
    <>
      <footer className="hidden min-[1200px]:block" style={{ ...footerBase, height: '64px' }}>
        <div
          className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span style={{ color: TEXT_FOOTER, whiteSpace: 'nowrap' }}>프리미엄 인사이트를 가장 먼저 받아보세요</span>
            <Link
              href="/mypage"
              style={{
                ...linkStyle,
                color: GOLD,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              구독 신청 →
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end" style={{ color: TEXT_FOOTER }}>
            <span>USENAD CO., LTD.</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>CEO: 김세준</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>206-31-95055</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <Link href="/privacy" style={linkStyle}>PRIVACY</Link>
            <Link href="/terms" style={linkStyle}>TERMS</Link>
            <Link href="/cookie" style={linkStyle}>COOKIE</Link>
          </div>
        </div>
      </footer>

      <footer
        className="min-[1200px]:hidden"
        style={{
          ...footerBase,
          padding: '16px 16px 72px',
        }}
      >
        <p style={{ margin: '0 0 8px', color: TEXT_FOOTER, textAlign: 'center' }}>
          프리미엄 인사이트를 가장 먼저 받아보세요
        </p>
        <Link
          href="/mypage"
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            padding: '10px 16px',
            marginBottom: '16px',
            borderRadius: '8px',
            border: `0.5px solid rgba(201,169,110,0.35)`,
            color: GOLD,
            fontWeight: 500,
            fontSize: '12px',
            textDecoration: 'none',
          }}
        >
          구독 신청 →
        </Link>
        <p style={{ margin: '0 0 4px', textAlign: 'center', lineHeight: 1.5 }}>
          USENAD CO., LTD. · CEO: 김세준
        </p>
        <p style={{ margin: '0 0 12px', textAlign: 'center', lineHeight: 1.5 }}>
          206-31-95055
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link href="/privacy" style={linkStyle}>PRIVACY</Link>
          <Link href="/terms" style={linkStyle}>TERMS</Link>
          <Link href="/cookie" style={linkStyle}>COOKIE</Link>
        </div>
      </footer>
    </>
  )
}

function MobileInlineAd() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '0.5px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '10px',
        fontWeight: 400,
        color: 'rgba(255,255,255,0.25)',
        textAlign: 'center',
      }}
    >
      AD · 광고 영역
    </div>
  )
}

function LoginModal({
  onClose,
  onGoogle,
  onKakao,
}: {
  onClose: () => void
  onGoogle: () => Promise<void>
  onKakao: () => Promise<void>
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: '#141416',
          border: `0.5px solid ${COMMUNITY_COLORS.border}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          fontFamily: 'Inter, Pretendard, sans-serif',
        }}
      >
        <div className="flex justify-end px-5 pt-4">
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-7 pb-7">
          <p className="text-center text-[11px] font-medium mb-1" style={{ letterSpacing: '0.2em', color: COMMUNITY_COLORS.gold }}>
            PAGEONEWORKS
          </p>
          <h2 className="text-[17px] font-medium text-center mb-1" style={{ color: COMMUNITY_COLORS.text }}>
            로그인 후 이용하세요
          </h2>
          <p className="text-[13px] font-normal text-center mb-5" style={{ color: COMMUNITY_COLORS.sub }}>
            글 작성, 댓글, 좋아요는 로그인 후 이용 가능합니다
          </p>

          <button
            type="button"
            onClick={onGoogle}
            className="w-full relative flex items-center bg-white rounded-xl px-4 py-3 mb-2.5 text-[14px] font-medium hover:bg-white/90 transition-all"
            style={{ color: '#1f1f1f' }}
          >
            <svg className="w-5 h-5 shrink-0 absolute left-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="w-full text-center">Google로 로그인</span>
          </button>

          <button
            type="button"
            onClick={onKakao}
            className="w-full relative flex items-center rounded-xl px-4 py-3 mb-4 text-[14px] font-medium hover:brightness-95 transition-all"
            style={{ background: '#FEE500', color: '#191919' }}
          >
            <svg className="w-5 h-5 shrink-0 absolute left-4" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.7 5.08 4.27 6.47L5.2 21l4.53-2.97c.75.1 1.51.17 2.27.17 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z" />
            </svg>
            <span className="w-full text-center">카카오로 로그인</span>
          </button>

          <p className="text-[11px] font-normal text-center" style={{ color: COMMUNITY_COLORS.meta }}>
            로그인 시 이용약관 및 개인정보처리방침에 동의하는 것으로 간주됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
