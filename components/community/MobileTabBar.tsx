// components/community/MobileTabBar.tsx

'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Bell, Flame, Home, PenLine, User } from 'lucide-react'
import { COMMUNITY_COLORS } from './constants'

export function MobileTabBar({ onWrite }: { onWrite: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort')
  const isCommunity = pathname === '/community'
  const isPopular = isCommunity && sort === 'popular'
  const isHome = pathname === '/' || (isCommunity && sort !== 'popular')
  const isMy = pathname.startsWith('/mypage')

  return (
    <nav
      className="min-[1200px]:hidden grid grid-cols-5"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '56px',
        background: 'rgba(13,13,15,0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '0.5px solid rgba(255,255,255,0.07)',
        fontFamily: 'Inter, Pretendard, sans-serif',
      }}
    >
      <Tab href="/" active={isHome && pathname === '/'} icon={<Home className="w-[18px] h-[18px]" />} label="홈" />
      <Tab
        href="/community?sort=popular"
        active={isPopular}
        icon={<Flame className="w-[18px] h-[18px]" />}
        label="인기"
      />
      <div className="flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={onWrite}
          className="flex items-center justify-center -mt-4"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#C9A96E',
            color: '#0d0d0f',
            boxShadow: '0 6px 18px rgba(201,169,110,0.28)',
          }}
          aria-label="글쓰기"
        >
          <PenLine className="w-[18px] h-[18px]" style={{ color: '#0d0d0f' }} />
        </button>
        <span className="text-[9px] font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
          글쓰기
        </span>
      </div>
      <Tab href="#" active={false} icon={<Bell className="w-[18px] h-[18px]" />} label="알림" />
      <Tab href="/mypage" active={isMy} icon={<User className="w-[18px] h-[18px]" />} label="마이" />
    </nav>
  )
}

function Tab({
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
  const color = active ? COMMUNITY_COLORS.gold : 'rgba(255,255,255,0.3)'
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-0.5" style={{ color }}>
      {icon}
      <span className="text-[9px] font-medium">{label}</span>
    </Link>
  )
}
