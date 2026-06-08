// components/community/PostCard.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HOT_CATEGORIES, COMMUNITY_COLORS } from './constants'
import { timeAgoKorean } from './utils'
import type { CommunityPost } from './types'

const META_STYLE: React.CSSProperties = {
  fontSize: '10px',
  color: 'rgba(255,255,255,0.25)',
  whiteSpace: 'nowrap',
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
}

export function PostCard({ post }: { post: CommunityPost }) {
  const pinned = Boolean(post.is_pinned)
  const isHot = HOT_CATEGORIES.has(post.category_slug)
  const [hovered, setHovered] = useState(false)

  const baseBg = pinned ? 'rgba(201,169,110,0.04)' : 'transparent'
  const hoverBg = pinned ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.04)'

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
            background: isHot ? 'rgba(232,112,90,0.12)' : 'rgba(255,255,255,0.06)',
            color: isHot ? COMMUNITY_COLORS.hot : COMMUNITY_COLORS.text,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {post.category_slug}
        </span>

        <span
          className="flex-1 min-w-0 text-[13px] font-medium truncate"
          style={{
            color: hovered ? 'rgba(255,255,255,0.95)' : COMMUNITY_COLORS.text,
            lineHeight: 1.2,
            transition: 'color 150ms ease',
          }}
        >
          {post.title}
        </span>

        <div className="shrink-0 flex items-center" style={{ gap: '8px' }}>
          <span style={META_STYLE}>👍{(post.like_count ?? 0).toLocaleString()}</span>
          <span style={META_STYLE}>💬{(post.comment_count ?? 0).toLocaleString()}</span>
          <span style={META_STYLE}>👁{(post.view_count ?? 0).toLocaleString()}</span>
          <span style={META_STYLE}>{timeAgoKorean(post.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
