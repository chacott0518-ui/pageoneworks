// components/community/PostCard.tsx

'use client'

import Link from 'next/link'
import { Eye, MessageCircle, ThumbsUp } from 'lucide-react'
import { HOT_CATEGORIES, COMMUNITY_COLORS } from './constants'
import { timeAgoKorean } from './utils'
import type { CommunityPost } from './types'

export function PostCard({ post }: { post: CommunityPost }) {
  const pinned = Boolean(post.is_pinned)
  const isHot = HOT_CATEGORIES.has(post.category_slug)

  return (
    <Link
      href={`/community/${post.id}`}
      className="group block"
      style={{
        height: '52px',
        borderBottom: '0.5px solid rgba(255,255,255,0.04)',
        background: pinned ? 'rgba(201,169,110,0.04)' : 'transparent',
        transition: 'background 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = pinned
          ? 'rgba(201,169,110,0.06)'
          : 'rgba(255,255,255,0.025)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = pinned ? 'rgba(201,169,110,0.04)' : 'transparent'
      }}
    >
      <div
        className="h-full flex items-center gap-2 px-3"
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
          className="shrink-0 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap"
          style={{
            borderRadius: '4px',
            background: isHot ? 'rgba(232,112,90,0.12)' : 'rgba(255,255,255,0.06)',
            color: isHot ? COMMUNITY_COLORS.hot : COMMUNITY_COLORS.text,
            lineHeight: 1.2,
          }}
        >
          {post.category_slug}
        </span>

        <span
          className="flex-1 min-w-0 text-[13px] font-medium truncate"
          style={{ color: COMMUNITY_COLORS.text, lineHeight: 1.2 }}
        >
          {post.title}
        </span>

        <div
          className="shrink-0 hidden sm:flex items-center gap-3 text-[10px] font-normal"
          style={{ color: COMMUNITY_COLORS.meta, lineHeight: 1 }}
        >
          <span className="inline-flex items-center gap-0.5">
            <ThumbsUp className="w-3 h-3" />
            {(post.like_count ?? 0).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <MessageCircle className="w-3 h-3" />
            {(post.comment_count ?? 0).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Eye className="w-3 h-3" />
            {(post.view_count ?? 0).toLocaleString()}
          </span>
        </div>

        <span
          className="shrink-0 text-[10px] font-normal sm:hidden"
          style={{ color: COMMUNITY_COLORS.meta, lineHeight: 1 }}
        >
          💬{(post.comment_count ?? 0).toLocaleString()}
        </span>

        <span
          className="shrink-0 text-[10px] font-normal w-[52px] text-right"
          style={{ color: COMMUNITY_COLORS.meta, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
        >
          {timeAgoKorean(post.created_at)}
        </span>
      </div>
    </Link>
  )
}
