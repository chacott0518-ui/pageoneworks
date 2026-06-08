// components/admin/dashboard/StatCard.tsx

'use client'

import { ADMIN_THEME } from '@/lib/admin/constants'

const T = ADMIN_THEME

export function StatCard({ label, value, delta }: { label: string; value: number; delta: number }) {
  const deltaText = delta === 0 ? '전일과 동일' : delta > 0 ? `+${delta} 전일대비` : `${delta} 전일대비`
  const deltaColor = delta > 0 ? T.success : delta < 0 ? T.danger : T.sub
  return (
    <div style={{ padding: 16, borderRadius: 8, border: T.border, background: T.surface }}>
      <p style={{ fontSize: 24, fontWeight: 500, color: T.gold, margin: 0 }}>{value.toLocaleString()}</p>
      <p style={{ fontSize: 12, fontWeight: 400, color: T.sub, margin: '4px 0 0' }}>{label}</p>
      <p style={{ fontSize: 11, fontWeight: 400, color: deltaColor, margin: '8px 0 0' }}>{deltaText}</p>
    </div>
  )
}
