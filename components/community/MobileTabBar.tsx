// components/community/MobileTabBar.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { Bell, Flame, Home, User } from 'lucide-react'

const ACTIVE = '#C9A96E'
const INACTIVE = 'rgba(255,255,255,0.35)'

const TABBAR_CSS = `
.community-mobile-tabbar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: 56px;
  background: rgba(13, 13, 15, 0.98);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 0.5px solid rgba(255, 255, 255, 0.07);
  align-items: center;
  font-family: Inter, Pretendard, sans-serif;
}

@media (max-width: 768px) {
  .community-mobile-tabbar {
    display: flex;
  }
}
`

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
    <>
      <style dangerouslySetInnerHTML={{ __html: TABBAR_CSS }} />
      <nav className="community-mobile-tabbar">
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
              color: '#0d0d0f',
              fontSize: '20px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-16px',
              cursor: 'pointer',
              lineHeight: 1,
              boxShadow: '0 6px 18px rgba(201,169,110,0.28)',
            }}
          >
            ✏
          </button>
          <span style={{ fontSize: '9px', fontWeight: 500, color: INACTIVE, marginTop: '2px' }}>
            글쓰기
          </span>
        </div>
        <TabItem href="#" active={false} icon={<Bell style={{ width: 18, height: 18 }} />} label="알림" />
        <TabItem href="/mypage" active={isMy} icon={<User style={{ width: 18, height: 18 }} />} label="마이" />
      </nav>
    </>
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
  icon: ReactNode
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
        minHeight: '44px',
      }}
    >
      {icon}
      <span style={{ fontSize: '9px', fontWeight: 500 }}>{label}</span>
    </Link>
  )
}
