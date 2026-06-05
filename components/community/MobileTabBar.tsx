// components/community/MobileTabBar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bell, Flame, Home, PenLine, User } from 'lucide-react'

const ACTIVE = '#C9A96E'
const INACTIVE = 'rgba(255,255,255,0.35)'

export function MobileTabBar({ onWrite }: { onWrite: () => void }) {
  const pathname = usePathname()
  const [sort, setSort] = useState<string | null>(null)

  useEffect(() => {
    setSort(new URLSearchParams(window.location.search).get('sort'))
  }, [pathname])

  const isHome = pathname === '/'
  const isPopular = pathname === '/community' && sort === 'popular'
  const isMy = pathname.startsWith('/mypage')

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '56px',
        background: 'rgba(13,13,15,0.98)',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Inter, Pretendard, sans-serif',
      }}
    >
      <TabItem href="/" active={isHome} icon={<Home style={{ width: 18, height: 18 }} />} label="홈" />
      <TabItem
        href="/community?sort=popular"
        active={isPopular}
        icon={<Flame style={{ width: 18, height: 18 }} />}
        label="인기"
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          type="button"
          onClick={onWrite}
          aria-label="글쓰기"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#C9A96E',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-16px',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(201,169,110,0.28)',
          }}
        >
          <PenLine style={{ width: 18, height: 18, color: '#0d0d0f' }} />
        </button>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            color: INACTIVE,
            marginTop: '2px',
          }}
        >
          글쓰기
        </span>
      </div>
      <TabItem href="#" active={false} icon={<Bell style={{ width: 18, height: 18 }} />} label="알림" />
      <TabItem href="/mypage" active={isMy} icon={<User style={{ width: 18, height: 18 }} />} label="마이" />
    </div>
  )
}

function TabItem({
  href,
  active,
  icon,
  label,
}: {
  href: string
  active: boolean
  icon: React.ReactNode
  label: string
}) {
  const color = active ? ACTIVE : INACTIVE
  return (
    <Link
      href={href}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        textDecoration: 'none',
        color,
      }}
    >
      {icon}
      <span style={{ fontSize: '9px', fontWeight: 500 }}>{label}</span>
    </Link>
  )
}
