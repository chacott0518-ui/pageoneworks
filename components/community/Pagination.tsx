// components/community/Pagination.tsx

'use client'

import { COMMUNITY_COLORS } from './constants'

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const windowSize = 5
  const start = Math.max(1, Math.min(page - 2, totalPages - (windowSize - 1)))
  const end = Math.min(totalPages, start + (windowSize - 1))
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const btnBase: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: `0.5px solid ${COMMUNITY_COLORS.border}`,
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'Inter, Pretendard, sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 150ms ease, color 150ms ease',
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-8">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-2 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          ...btnBase,
          width: 'auto',
          paddingLeft: '10px',
          paddingRight: '10px',
          color: COMMUNITY_COLORS.sub,
          background: 'transparent',
        }}
      >
        이전
      </button>

      {pages.map((p) => {
        const active = p === page
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            style={{
              ...btnBase,
              color: active ? COMMUNITY_COLORS.gold : COMMUNITY_COLORS.sub,
              background: active ? 'rgba(201,169,110,0.12)' : 'transparent',
              borderColor: active ? 'rgba(201,169,110,0.25)' : COMMUNITY_COLORS.border,
            }}
          >
            {p}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-2 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          ...btnBase,
          width: 'auto',
          paddingLeft: '10px',
          paddingRight: '10px',
          color: COMMUNITY_COLORS.sub,
          background: 'transparent',
        }}
      >
        다음
      </button>
    </div>
  )
}
