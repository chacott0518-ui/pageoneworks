// components/admin/Skeleton.tsx

'use client'

import { ADMIN_THEME } from '@/lib/admin/constants'

const pulseStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  borderRadius: 8,
  animation: 'admin-skeleton-pulse 1.2s ease-in-out infinite',
}

export function SkeletonBlock({ height = 40, style }: { height?: number; style?: React.CSSProperties }) {
  return <div style={{ ...pulseStyle, height, ...style }} />
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}} />
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          <td colSpan={cols} style={{ padding: 8 }}>
            <SkeletonBlock height={40} />
          </td>
        </tr>
      ))}
    </>
  )
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            style={{
              ...pulseStyle,
              height: 100,
              border: ADMIN_THEME.border,
              background: ADMIN_THEME.surface,
            }}
          />
        ))}
      </div>
    </>
  )
}

export function SkeletonList({ count = 5, itemHeight = 48 }: { count?: number; itemHeight?: number }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonBlock key={i} height={itemHeight} />
        ))}
      </div>
    </>
  )
}

export function SkeletonStatGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ padding: 16, borderRadius: 8, border: ADMIN_THEME.border, background: ADMIN_THEME.surface }}>
          <SkeletonBlock height={56} />
        </div>
      ))}
    </div>
  )
}
