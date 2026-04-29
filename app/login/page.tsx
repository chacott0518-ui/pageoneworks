'use client'

import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/`,
      },
    })
  }

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
          }}
        >
          {/* 로고 */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '13px',
                letterSpacing: '0.25em',
                color: 'rgba(245,242,237,0.4)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              PAGEONEWORKS
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                fontWeight: 400,
                color: '#f5f2ed',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Premium Magazine
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(245,242,237,0.4)',
                marginTop: '12px',
              }}
            >
              프리미엄 콘텐츠를 무제한으로 이용하세요
            </p>
          </div>

          {/* 로그인 박스 */}
          <div
            style={{
              background: '#141414',
              border: '1px solid rgba(245,242,237,0.08)',
              padding: '40px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'rgba(245,242,237,0.35)',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '28px',
              }}
            >
              소셜 계정으로 간편 로그인
            </p>

            {/* 구글 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: '#fff',
                color: '#1a1a1a',
                border: 'none',
                padding: '14px 24px',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 계속하기
            </button>

            <div
              style={{
                borderTop: '1px solid rgba(245,242,237,0.06)',
                paddingTop: '24px',
                marginTop: '12px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '12px',
                  fontWeight: 300,
                  color: 'rgba(245,242,237,0.25)',
                  textAlign: 'center',
                  lineHeight: 1.7,
                }}
              >
                로그인 시 PAGEONEWORKS의{' '}
                <span style={{ color: 'rgba(245,242,237,0.45)', textDecoration: 'underline' }}>
                  이용약관
                </span>
                {' '}및{' '}
                <span style={{ color: 'rgba(245,242,237,0.45)', textDecoration: 'underline' }}>
                  개인정보처리방침
                </span>
                에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}