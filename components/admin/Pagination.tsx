// components/admin/Pagination.tsx

'use client'

import { ADMIN_THEME } from '@/lib/admin/constants'

type PaginationProps = {
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, pageSize, totalCount, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const btnStyle: React.CSSProperties = {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 8,
    border: ADMIN_THEME.border,
    background: ADMIN_THEME.surface,
    color: ADMIN_THEME.text,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: '150ms',
  }

  const pageNumbers: number[] = []
  const maxVisible = 7
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else if (currentPage <= 4) {
    for (let i = 1; i <= maxVisible; i++) pageNumbers.push(i)
  } else if (currentPage >= totalPages - 3) {
    for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    for (let i = currentPage - 3; i <= currentPage + 3; i++) pageNumbers.push(i)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
      <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} style={btnStyle}>
        이전
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onPageChange(num)}
          style={{
            ...btnStyle,
            background: currentPage === num ? 'rgba(201,169,110,0.15)' : ADMIN_THEME.surface,
            color: currentPage === num ? ADMIN_THEME.gold : ADMIN_THEME.text,
          }}
        >
          {num}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={btnStyle}
      >
        다음
      </button>
    </div>
  )
}
