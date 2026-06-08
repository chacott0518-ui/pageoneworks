// components/community/CategorySidebar.tsx

'use client'

import { PenLine } from 'lucide-react'
import { COMMUNITY_CATEGORIES, COMMUNITY_COLORS } from './constants'
import type { CategoryCountMap } from './types'

export function MobileCategoryChips({
  activeCategory,
  onSelect,
}: {
  activeCategory: string
  onSelect: (slug: string) => void
}) {
  return (
    <div
      className="min-[1200px]:hidden sticky top-[60px] z-30 border-b"
      style={{ borderColor: COMMUNITY_COLORS.border, background: 'rgba(13,13,15,0.98)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="community-chip-scroll max-w-[1400px] mx-auto px-4 py-2.5 flex gap-1.5 overflow-x-auto"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {COMMUNITY_CATEGORIES.map((c) => {
          const active = activeCategory === c.slug
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onSelect(c.slug)}
              className="shrink-0 px-3 py-1.5 text-[12px] font-medium"
              style={{
                whiteSpace: 'nowrap',
                borderRadius: '999px',
                border: `0.5px solid ${active ? 'rgba(201,169,110,0.35)' : COMMUNITY_COLORS.border}`,
                color: active ? COMMUNITY_COLORS.gold : COMMUNITY_COLORS.sub,
                background: active ? 'rgba(201,169,110,0.10)' : COMMUNITY_COLORS.surface,
              }}
            >
              {c.label}
            </button>
          )
        })}
      </div>
      <style jsx>{`
        .community-chip-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export function CategorySidebar({
  activeCategory,
  categoryCounts,
  onSelect,
  onWrite,
}: {
  activeCategory: string
  categoryCounts: CategoryCountMap
  onSelect: (slug: string) => void
  onWrite: () => void
}) {
  return (
    <aside
      className="hidden min-[1200px]:flex flex-col w-[200px] shrink-0 py-6 pr-4"
      style={{ borderRight: `0.5px solid ${COMMUNITY_COLORS.border}`, fontFamily: 'Inter, Pretendard, sans-serif' }}
    >
      <p
        className="px-2 mb-3 text-[9px] font-medium uppercase"
        style={{ letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)' }}
      >
        CATEGORIES
      </p>

      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {COMMUNITY_CATEGORIES.map((c) => {
          const active = activeCategory === c.slug
          const count = categoryCounts[c.slug] ?? 0
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onSelect(c.slug)}
              className="w-full flex items-center justify-between px-2 py-2 text-left text-[13px] font-medium transition-colors"
              style={{
                borderRadius: '6px',
                color: active ? COMMUNITY_COLORS.gold : COMMUNITY_COLORS.text,
                background: active ? 'rgba(201,169,110,0.10)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span className="truncate">{c.label}</span>
              <span
                className="ml-2 shrink-0 text-[10px] font-medium px-1.5 py-0.5"
                style={{
                  borderRadius: '4px',
                  color: active ? COMMUNITY_COLORS.gold : COMMUNITY_COLORS.meta,
                  background: 'rgba(255,255,255,0.04)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {count.toLocaleString()}
              </span>
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onWrite}
        className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium"
        style={{
          borderRadius: '6px',
          border: `0.5px solid ${COMMUNITY_COLORS.gold}`,
          color: COMMUNITY_COLORS.gold,
          background: 'rgba(201,169,110,0.06)',
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(201,169,110,0.15)'
          e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(201,169,110,0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(201,169,110,0.06)'
          e.currentTarget.style.borderColor = COMMUNITY_COLORS.gold
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
        onMouseUp={(e) => {
          if (e.currentTarget.matches(':hover')) {
            e.currentTarget.style.transform = 'translateY(-1px)'
          }
        }}
      >
        <PenLine className="w-3.5 h-3.5" />
        ✏ 글쓰기
      </button>
    </aside>
  )
}
