// components/admin/AdminLayoutClient.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { ConfirmProvider } from './ConfirmModal'
import { ToastProvider } from './Toast'

const BG = '#0a0a0c'
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'

const NAV = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/posts', label: '글 관리', icon: '📝' },
  { href: '/admin/comments', label: '댓글 관리', icon: '💬' },
  { href: '/admin/users', label: '회원 관리', icon: '👥' },
  { href: '/admin/reports', label: '신고 관리', icon: '🚨' },
  { href: '/admin/ads', label: '광고 관리', icon: '📣' },
  { href: '/admin/notices', label: '공지 관리', icon: '📌' },
]

export function AdminLayoutClient({
  children,
  nickname,
}: {
  children: ReactNode
  nickname: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navContent = (
    <>
      <div style={{ padding: '24px 16px', borderBottom: BORDER }}>
        <p style={{ fontSize: '18px', fontWeight: 500, color: GOLD, margin: 0, letterSpacing: '0.12em' }}>ADMIN</p>
        <p style={{ fontSize: '11px', fontWeight: 400, color: SUB, margin: '4px 0 0' }}>PAGEONEWORKS</p>
      </div>
      <nav style={{ flex: 1, padding: '8px' }}>
        {NAV.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minHeight: '44px',
                padding: '0 12px',
                marginBottom: '4px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 500,
                color: active ? GOLD : TEXT,
                background: active ? 'rgba(201,169,110,0.1)' : 'transparent',
                transition: '150ms',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px', borderTop: BORDER }}>
        <p style={{ fontSize: '12px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>{nickname}</p>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: '100%',
            minHeight: '44px',
            borderRadius: '8px',
            border: BORDER,
            background: SURFACE,
            color: SUB,
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: '150ms',
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  )

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter, Pretendard, sans-serif' }}>
          <header
            className="admin-mobile-header"
            style={{
              display: 'none',
              position: 'sticky',
              top: 0,
              zIndex: 50,
              height: '56px',
              padding: '0 16px',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: BG,
              borderBottom: BORDER,
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 500, color: GOLD, letterSpacing: '0.1em' }}>ADMIN</span>
            <button
              type="button"
              aria-label="메뉴"
              onClick={() => setMenuOpen(true)}
              style={{
                minWidth: '44px',
                minHeight: '44px',
                border: BORDER,
                borderRadius: '8px',
                background: SURFACE,
                color: TEXT,
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ☰
            </button>
          </header>

          {menuOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: BG,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px' }}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    border: 'none',
                    background: 'transparent',
                    color: TEXT,
                    fontSize: '24px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
              {navContent}
            </div>
          )}

          <div style={{ display: 'flex' }}>
            <aside
              className="admin-sidebar"
              style={{
                width: '220px',
                flexShrink: 0,
                minHeight: '100vh',
                borderRight: BORDER,
                background: SURFACE,
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                alignSelf: 'flex-start',
              }}
            >
              {navContent}
            </aside>
            <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: '24px 16px' }}>
              {children}
            </main>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .admin-sidebar { display: none !important; }
            .admin-mobile-header { display: flex !important; }
            .admin-main { padding: 16px !important; }
          }
        `}} />
      </ConfirmProvider>
    </ToastProvider>
  )
}
