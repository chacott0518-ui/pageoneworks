// components/community/PostCard.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HOT_CATEGORIES } from './constants'
import { timeAgoKorean } from './utils'
import type { CommunityPost } from './types'

const STAT_COLOR = 'rgba(255,255,255,0.6)'
const TIME_COLOR = 'rgba(255,255,255,0.45)'
const TITLE_COLOR = 'rgba(255,255,255,0.82)'
const TITLE_HOVER = 'rgba(255,255,255,0.98)'
const BADGE_TEXT = 'rgba(255,255,255,0.7)'
const BADGE_BG = 'rgba(255,255,255,0.07)'
const HOT_BG = 'rgba(232,112,90,0.12)'

export function PostCard({ post }: { post: CommunityPost }) {
  const pinned = Boolean(post.is_pinned)
  const isHot = HOT_CATEGORIES.has(post.category_slug)
  const [hovered, setHovered] = useState(false)

  const baseBg = pinned ? 'rgba(201,169,110,0.04)' : 'transparent'
  const hoverBg = pinned ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.04)'

  const statStyle: React.CSSProperties = {
    fontSize: '10px',
    color: STAT_COLOR,
    whiteSpace: 'nowrap',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <Link
      href={`/community/${post.id}`}
      className="block"
      style={{
        height: '52px',
        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
        background: hovered ? hoverBg : baseBg,
        borderLeft: hovered ? '2px solid rgba(201,169,110,0.3)' : '2px solid transparent',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
        transition: 'all 150ms ease',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="h-full flex items-center gap-2 px-3 min-w-0"
        style={{ lineHeight: '52px', fontFamily: 'Inter, Pretendard, sans-serif' }}
      >
        {pinned ? (
          <span className="shrink-0 text-[11px]" style={{ lineHeight: 1 }}>
            📌
          </span>
        ) : (
          <span className="shrink-0 w-[14px]" />
        )}

        <span
          className="shrink-0 font-medium"
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            background: isHot ? HOT_BG : BADGE_BG,
            color: isHot ? '#E8705A' : BADGE_TEXT,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {post.category_slug}
        </span>

        <span
          className="flex-1 min-w-0 text-[13px] font-medium truncate"
          style={{
            color: hovered ? TITLE_HOVER : TITLE_COLOR,
            lineHeight: 1.2,
            transition: 'color 150ms ease',
          }}
        >
          {post.title}
        </span>

        <div className="shrink-0 flex items-center" style={{ gap: '8px' }}>
          <span style={statStyle}>👍{(post.like_count ?? 0).toLocaleString()}</span>
          <span style={statStyle}>💬{(post.comment_count ?? 0).toLocaleString()}</span>
          <span style={statStyle}>👁{(post.view_count ?? 0).toLocaleString()}</span>
          <span style={{ ...statStyle, color: TIME_COLOR }}>{timeAgoKorean(post.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
