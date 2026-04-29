'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

export default function MyPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(245,242,237,0.3)' }}>
            LOADING...
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.3)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            My Account
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              fontWeight: 400,
              color: '#f5f2ed',
              marginBottom: '48px',
            }}
          >
            마이페이지
          </h1>

          {/* 프로필 카드 */}
          <div
            style={{
              background: '#141414',
              border: '1px solid rgba(245,242,237,0.08)',
              padding: '32px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="프로필"
                  style={{ width: '56px', height: '56px', borderRadius: '50%' }}
                />
              )}
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: '#f5f2ed',
                    marginBottom: '4px',
                  }}
                >
                  {user?.user_metadata?.full_name || '회원'}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '13px',
                    fontWeight: 300,
                    color: 'rgba(245,242,237,0.4)',
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(245,242,237,0.06)', paddingTop: '20px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: 'rgba(245,242,237,0.25)',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                멤버십
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  fontWeight: 300,
                  color: 'rgba(245,242,237,0.6)',
                }}
              >
                무료 플랜
              </p>
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              border: '1px solid rgba(245,242,237,0.15)',
              color: 'rgba(245,242,237,0.5)',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(245,242,237,0.3)'
              e.currentTarget.style.color = 'rgba(245,242,237,0.8)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(245,242,237,0.15)'
              e.currentTarget.style.color = 'rgba(245,242,237,0.5)'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  )
}