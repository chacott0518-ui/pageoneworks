'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

export default function LoginPage() {
  const [marketing, setMarketing] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/`,
      },
    })
  }

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/`,
      },
    })
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-5">
        <div className="w-full max-w-[420px]">

          {/* 로고 */}
          <div className="text-center mb-12">
            <p
              className="text-[11px] tracking-[0.25em] uppercase text-white/40 mb-2"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              PAGEONEWORKS
            </p>
            <h1
              className="text-[clamp(2rem,5vw,2.8rem)] font-light text-[#f5f2ed] leading-tight mb-3"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Premium Magazine
            </h1>
            <p className="text-[14px] font-light text-white/40">
              프리미엄 콘텐츠를 무제한으로 이용하세요
            </p>
          </div>

          {/* 로그인 박스 */}
          <div
            className="bg-[#18181B] border border-white/10 rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.08)' }}
          >
            <div className="px-8 py-8">
              <p
                className="text-[10px] tracking-[0.15em] uppercase text-white/30 text-center mb-6"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                소셜 계정으로 간편 로그인
              </p>

              {/* 구글 */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center gap-3 bg-white text-[#1F1F1F] rounded-xl px-4 py-3.5 mb-3 font-bold text-[14px] hover:bg-white/90 transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="flex-1 text-center">Google로 계속하기</span>
              </button>

              {/* 카카오 */}
              <button
                onClick={handleKakaoLogin}
                className="w-full flex items-center gap-3 bg-[#FEE500] text-[#191919] rounded-xl px-4 py-3.5 mb-3 font-bold text-[14px] hover:bg-[#FDD800] transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#191919">
                  <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.7 5.08 4.27 6.47L5.2 21l4.53-2.97c.75.1 1.51.17 2.27.17 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
                </svg>
                <span className="flex-1 text-center">카카오로 계속하기</span>
              </button>

              {/* 네이버 준비중 */}
              <button
                disabled
                className="w-full flex items-center gap-3 bg-[#03C75A]/30 text-white/30 rounded-xl px-4 py-3.5 mb-6 font-bold text-[14px] cursor-not-allowed"
              >
                <svg className="w-5 h-5 shrink-0 opacity-40" viewBox="0 0 24 24" fill="#03C75A">
                  <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                </svg>
                <span className="flex-1 text-center">네이버로 계속하기 (준비중)</span>
              </button>

              {/* 마케팅 동의 */}
              <div className="bg-gold/5 border border-gold/15 rounded-xl px-4 py-3 mb-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={e => setMarketing(e.target.checked)}
                    className="mt-0.5 shrink-0 accent-gold w-3.5 h-3.5"
                  />
                  <span className="text-[12px] text-white/40 leading-relaxed">
                    <strong className="text-white/60">[선택] 마케팅 정보 수신 동의</strong><br />
                    새 아티클, 이벤트 등 유용한 정보를 이메일로 받아보실 수 있습니다.
                  </span>
                </label>
              </div>

              {/* 약관 */}
              <p className="text-[11px] text-white/20 text-center leading-relaxed">
                로그인 시 PAGEONEWORKS의{' '}
                <span className="text-white/40 underline cursor-pointer hover:text-white/60 transition-colors">
                  이용약관
                </span>
                {' '}및{' '}
                <span className="text-white/40 underline cursor-pointer hover:text-white/60 transition-colors">
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