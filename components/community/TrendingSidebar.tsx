// components/community/TrendingSidebar.tsx

'use client'

import Link from 'next/link'
import { COMMUNITY_COLORS } from './constants'
import type { CommunityStats, ProfileMini, TrendingPost } from './types'
import { AvatarCard } from './AvatarCard'

const GOLD = '#C9A96E'
const TITLE_COLOR = 'rgba(255,255,255,0.75)'
const SUB_COLOR = 'rgba(255,255,255,0.45)'
const SECTION_TITLE = 'rgba(255,255,255,0.5)'
const STAT_LABEL = 'rgba(255,255,255,0.5)'
const RANK_OTHER = 'rgba(255,255,255,0.3)'

export function TrendingSidebar({
  trending,
  stats,
  profile,
}: {
  trending: TrendingPost[]
  stats: CommunityStats
  profile: ProfileMini | null
}) {
  return (
    <aside
      className="hidden min-[1200px]:block w-[220px] shrink-0 py-6 pl-4"
      style={{ fontFamily: 'Inter, Pretendard, sans-serif' }}
    >
      {profile && <AvatarCard profile={profile} />}

      <div className="mb-5">
        <p className="text-[11px] font-medium mb-3" style={{ color: SECTION_TITLE }}>
          🔥 실시간 인기글
        </p>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}`, background: COMMUNITY_COLORS.surface }}
        >
          {trending.map((p, i) => {
            const rank = String(i + 1).padStart(2, '0')
            const isFirst = i === 0
            return (
              <Link
                key={p.id}
                href={`/community/${p.id}`}
                className="block px-3 py-2.5 transition-colors hover:bg-white/[0.025]"
                style={{ borderBottom: i < trending.length - 1 ? `0.5px solid rgba(255,255,255,0.04)` : undefined }}
              >
                <div className="flex gap-2 min-w-0">
                  <span
                    className="w-5 shrink-0 text-[11px] font-medium"
                    style={{ color: isFirst ? GOLD : RANK_OTHER, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[12px] font-medium"
                      style={{
                        color: TITLE_COLOR,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.title}
                    </p>
                    <p className="text-[10px] font-normal mt-0.5" style={{ color: SUB_COLOR }}>
                      {p.category_slug} · 조회 {(p.view_count ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-medium mb-3" style={{ color: SECTION_TITLE }}>
          📊 오늘 통계
        </p>
        <div className="grid grid-cols-2 gap-2">
          <StatCell label="새글" value={stats.todayNewPosts} />
          <StatCell label="댓글" value={stats.todayComments} />
          <StatCell label="방문" value={stats.todayVisits} />
          <StatCell label="신규가입" value={stats.todayNewMembers} />
        </div>
      </div>

      <div>
        <p
          className="text-[8px] font-medium mb-2 uppercase"
          style={{ letterSpacing: '1px', color: SECTION_TITLE }}
        >
          AD
        </p>
        <div
          className="flex items-center justify-center"
          style={{
            width: '160px',
            height: '300px',
            border: `0.5px solid ${COMMUNITY_COLORS.border}`,
            borderRadius: '8px',
            background: COMMUNITY_COLORS.surface,
            color: SUB_COLOR,
            fontSize: '11px',
          }}
        >
          160×300
        </div>
      </div>
    </aside>
  )
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-lg px-3 py-2.5"
      style={{ background: COMMUNITY_COLORS.surface, border: `0.5px solid ${COMMUNITY_COLORS.border}` }}
    >
      <p className="text-[10px] font-normal" style={{ color: STAT_LABEL }}>
        {label}
      </p>
      <p
        className="text-[14px] mt-1"
        style={{ color: GOLD, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  )
}
