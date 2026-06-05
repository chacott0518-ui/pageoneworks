// components/community/CategorySidebar.tsx

'use client'

import { PenLine } from 'lucide-react'
import { COMMUNITY_CATEGORIES, COMMUNITY_COLORS } from './constants'
import type { CategoryCountMap } from './types'

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
        className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium transition-colors"
        style={{
          borderRadius: '6px',
          border: `0.5px solid ${COMMUNITY_COLORS.gold}`,
          color: COMMUNITY_COLORS.gold,
          background: 'rgba(201,169,110,0.06)',
        }}
      >
        <PenLine className="w-3.5 h-3.5" />
        ✏ 글쓰기
      </button>
    </aside>
  )
}
