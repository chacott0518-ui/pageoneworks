// components/admin/AdminLayoutClient.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { ADMIN_THEME } from '@/lib/admin/constants'
import { ConfirmProvider } from './ConfirmModal'
import { ToastProvider } from './Toast'

const { bg: BG, surface: SURFACE, border: BORDER, gold: GOLD, text: TEXT, sub: SUB } = ADMIN_THEME

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
  isSuperAdmin,
}: {
  children: ReactNode
  nickname: string
  isSuperAdmin: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navLinks = (
    <nav style={{ flex: 1, padding: 8 }}>
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
              gap: 10,
              minHeight: 44,
              height: 52,
              padding: '0 12px',
              marginBottom: 4,
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 13,
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
  )

  const sidebarHeader = (
    <div style={{ padding: '24px 16px', borderBottom: BORDER }}>
      <p style={{ fontSize: 18, fontWeight: 500, color: GOLD, margin: 0, letterSpacing: '0.12em' }}>ADMIN</p>
      <p style={{ fontSize: 11, fontWeight: 400, color: SUB, margin: '4px 0 0' }}>PAGEONEWORKS</p>
    </div>
  )

  const sidebarFooter = (
    <div style={{ padding: 16, borderTop: BORDER }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: TEXT, margin: 0 }}>{nickname}</p>
        {isSuperAdmin && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: GOLD,
              padding: '2px 6px',
              borderRadius: 4,
              border: BORDER,
              background: 'rgba(201,169,110,0.1)',
            }}
          >
            SUPER
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          width: '100%',
          minHeight: 44,
          borderRadius: 8,
          border: BORDER,
          background: SURFACE,
          color: SUB,
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          transition: '150ms',
        }}
      >
        로그아웃
      </button>
    </div>
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
              height: 52,
              padding: '0 16px',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: BG,
              borderBottom: BORDER,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 500, color: GOLD, letterSpacing: '0.1em' }}>ADMIN</span>
            <button
              type="button"
              aria-label="메뉴"
              onClick={() => setMenuOpen(true)}
              style={{
                minWidth: 44,
                minHeight: 44,
                border: BORDER,
                borderRadius: 8,
                background: SURFACE,
                color: TEXT,
                fontSize: 18,
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
                    minWidth: 44,
                    minHeight: 44,
                    border: 'none',
                    background: 'transparent',
                    color: TEXT,
                    fontSize: 24,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
              {sidebarHeader}
              {navLinks}
              {sidebarFooter}
            </div>
          )}

          <div style={{ display: 'flex' }}>
            <aside
              className="admin-sidebar"
              style={{
                width: 220,
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
              {sidebarHeader}
              {navLinks}
              {sidebarFooter}
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
