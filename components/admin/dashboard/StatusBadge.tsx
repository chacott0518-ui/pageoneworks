// components/admin/dashboard/StatusBadge.tsx

'use client'

import { ADMIN_THEME } from '@/lib/admin/constants'

const T = ADMIN_THEME

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: '미처리', color: T.warning },
    reviewed: { label: '처리완료', color: T.success },
    dismissed: { label: '무시', color: T.meta },
  }
  const s = map[status] ?? { label: status, color: T.sub }
  return (
    <span style={{ fontSize: 11, fontWeight: 500, color: s.color, padding: '2px 8px', borderRadius: 4, border: T.border }}>
      {s.label}
    </span>
  )
}
