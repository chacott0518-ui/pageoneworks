'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

const SESSION_KEY = 'pageoneworks_aiqna_used'

const CATEGORY_NAMES: Record<string, string> = {
  vitality: '의료·안티에이징',
  properties: '프리미엄 부동산',
  'drive-tech': '모빌리티·AI·IT',
  'legal-finance': '세무·법률·자산',
  'lifestyle-travel': '라이프·여행·골프',
  'beauty-wellness': '뷰티·피부·성형',
  'food-dining': '미식·레스토랑',
  education: '교육·유학',
}

interface FloatingButtonsProps {
  category?: string
}

function renderAnswer(text: string) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return <div key={i} style={{ height: '6px' }} />
    if (trimmed.startsWith('## ')) {
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 6px' }}>
          <div style={{ width: '3px', height: '14px', background: '#C4A882', borderRadius: '2px', flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4A882', margin: 0, fontWeight: 600 }}>
            {trimmed.replace('## ', '')}
          </p>
        </div>
      )
    }
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 300, color: 'rgba(245,242,237,0.75)', lineHeight: '1.8', margin: '3px 0', wordBreak: 'keep-all' }}>
        {parts.map((part, pi) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={pi} style={{ color: '#f5f2ed', fontWeight: 500 }}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default function FloatingButtons({ category }: FloatingButtonsProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionUsed, setSessionUsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSessionUsed(!!sessionStorage.getItem(SESSION_KEY))
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkAuth()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.style.overflow = (panelOpen || showLoginModal) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [panelOpen, showLoginModal])

  const handleSubmit = useCallback(async () => {
    const q = question.trim()
    if (!q || loading || sessionUsed) return
    if (q.length < 5) { setError('최소 5자 이상 입력해 주세요.'); return }
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const res = await fetch('/api/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, category }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? '오류가 발생했습니다.'); return }
      setAnswer(data.answer)
      setQuestion('')
      sessionStorage.setItem(SESSION_KEY, '1')
      setSessionUsed(true)
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [question, category, loading, sessionUsed])

  const handleAIButtonClick = () => {
    if (isLoggedIn) {
      setPanelOpen(true)
    } else {
      setShowLoginModal(true)
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${location.pathname}`,
      },
    })
  }

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${location.pathname}`,
      },
    })
  }

  const btnBottom = isMobile ? '24px' : '60px'
  const btnRight = isMobile ? '16px' : '40px'
  const btnSize = isMobile ? '48px' : '52px'
  const panelWidth = isMobile ? '100vw' : 'min(460px, 100vw)'

  return (
    <>
      {/* ── AI 플로팅 버튼 ── */}
      <button
        onClick={handleAIButtonClick}
        aria-label="AI 에디터에게 질문하기"
        title="AI 에디터에게 질문하기"
        style={{
          position: 'fixed',
          bottom: btnBottom,
          right: btnRight,
          zIndex: 99998,
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          background: '#0a0a0a',
          border: '1.5px solid #C4A882',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '2px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,168,130,0.15)',
          transition: 'transform 0.2s, bottom 0.2s, right 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '16px', color: '#C4A882', lineHeight: 1 }}>✦</span>
        <span style={{ fontSize: '8px', color: '#C4A882', fontFamily: 'var(--font-space-mono)', letterSpacing: '0.05em' }}>AI</span>
      </button>

      {/* ── 로그인 바텀시트 모달 ── */}
      {showLoginModal && (
        <>
          <div
            onClick={() => setShowLoginModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 99998,
              backdropFilter: 'blur(3px)',
            }}
          />
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: '#141414',
            borderTop: '1px solid rgba(196,168,130,0.2)',
            borderRadius: '16px 16px 0 0',
            padding: isMobile ? '24px 20px 32px' : '32px 40px 40px',
            maxWidth: '460px',
            margin: '0 auto',
          }}>
            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', margin: '0 auto 20px' }} />
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '22px', color: '#f5f2ed', margin: '0 0 8px', fontWeight: 400, textAlign: 'center' }}>
              로그인이 필요합니다
            </p>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(245,242,237,0.45)', margin: '0 0 24px', textAlign: 'center', lineHeight: '1.6' }}>
              AI Q&A는 로그인 후 이용할 수 있습니다.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google로 계속하기
              </button>
              <button
                onClick={handleKakaoLogin}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#FEE500',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#191919',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.77 5.02 4.44 6.36-.14.52-.9 3.34-.93 3.55 0 0-.02.16.08.22.1.06.22.01.22.01.29-.04 3.37-2.2 3.9-2.57.73.1 1.49.16 2.29.16 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" fill="#191919"/></svg>
                카카오로 계속하기
              </button>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'rgba(245,242,237,0.4)',
                textTransform: 'uppercase',
              }}
            >
              닫기
            </button>
          </div>
        </>
      )}

      {/* ── AI Q&A 슬라이드 패널 ── */}
      {panelOpen && (
        <>
          {/* 오버레이 */}
          <div
            onClick={() => setPanelOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              zIndex: 99998,
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* 패널 */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100dvh',
            width: panelWidth,
            background: '#0f0f0f',
            borderLeft: '1px solid rgba(196,168,130,0.2)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}>
            {/* 골드 상단 라인 */}
            <div style={{ height: '2px', background: '#C4A882', flexShrink: 0 }} />

            {/* 헤더 */}
            <div style={{
              padding: isMobile ? '14px 16px' : '18px 24px',
              borderBottom: '0.5px solid rgba(196,168,130,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.25em', color: '#C4A882', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  AI Q&A · PAGEONEWORKS
                </p>
                <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: isMobile ? '18px' : '22px', color: '#f5f2ed', margin: 0, fontWeight: 400, lineHeight: 1.2 }}>
                  AI 에디터에게 물어보세요
                </p>
                {category && (
                  <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(196,168,130,0.5)', margin: '4px 0 0', letterSpacing: '0.08em' }}>
                    현재: {CATEGORY_NAMES[category] ?? category}
                  </p>
                )}
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="패널 닫기"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  color: 'rgba(245,242,237,0.5)',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* 본문 */}
            <div style={{ padding: isMobile ? '16px' : '20px 24px', flex: 1 }}>

              {/* 이미 사용한 경우 */}
              {sessionUsed && !answer && (
                <div style={{
                  padding: '20px',
                  background: 'rgba(196,168,130,0.05)',
                  border: '0.5px solid rgba(196,168,130,0.2)',
                  borderRadius: '4px',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(245,242,237,0.45)', margin: 0, lineHeight: '1.6' }}>
                    오늘 AI 질문을 이미 사용하셨습니다.<br />내일 다시 이용해 주세요.
                  </p>
                </div>
              )}

              {/* 입력창 */}
              {!sessionUsed && (
                <>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(245,242,237,0.3)', marginBottom: '12px', lineHeight: '1.6' }}>
                    아티클 관련 궁금한 점을 질문하세요. 하루 1회 이용 가능합니다.
                  </p>
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <textarea
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          handleSubmit()
                        }
                      }}
                      placeholder="궁금한 점을 입력하세요... (Ctrl+Enter 전송)"
                      rows={4}
                      maxLength={500}
                      disabled={loading}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${error ? '#E53E3E' : 'rgba(196,168,130,0.2)'}`,
                        borderRadius: '4px',
                        padding: '12px 12px 40px',
                        fontFamily: 'var(--font-inter)',
                        fontSize: '13px',
                        fontWeight: 300,
                        color: '#f5f2ed',
                        lineHeight: '1.6',
                        resize: 'none',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                    />
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(245,242,237,0.2)' }}>
                        {question.length}/500
                      </span>
                      <button
                        onClick={handleSubmit}
                        disabled={loading || question.trim().length < 5}
                        style={{
                          background: question.trim().length >= 5 && !loading ? '#C4A882' : 'rgba(196,168,130,0.12)',
                          color: question.trim().length >= 5 && !loading ? '#0a0a0a' : 'rgba(245,242,237,0.2)',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '6px 14px',
                          fontFamily: 'var(--font-space-mono)',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          cursor: question.trim().length >= 5 && !loading ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s',
                        }}
                      >
                        {loading ? '생성 중...' : '질문하기'}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p style={{ fontSize: '12px', color: '#FC8181', marginBottom: '8px', fontFamily: 'var(--font-inter)' }}>
                      ⚠ {error}
                    </p>
                  )}
                </>
              )}

              {/* 로딩 */}
              {loading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px',
                  background: 'rgba(196,168,130,0.04)',
                  border: '0.5px solid rgba(196,168,130,0.1)',
                  borderRadius: '4px',
                  marginTop: '12px',
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(196,168,130,0.2)',
                    borderTopColor: '#C4A882',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    flexShrink: 0,
                  }} />
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: 'rgba(245,242,237,0.35)', margin: 0 }}>
                    AI 에디터가 답변을 작성하고 있습니다...
                  </p>
                </div>
              )}

              {/* 답변 */}
              {answer && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ flex: 1, height: '0.5px', background: 'rgba(196,168,130,0.15)' }} />
                    <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(196,168,130,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      AI 답변
                    </span>
                    <div style={{ flex: 1, height: '0.5px', background: 'rgba(196,168,130,0.15)' }} />
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '0.5px solid rgba(196,168,130,0.1)',
                    borderRadius: '4px',
                  }}>
                    {renderAnswer(answer)}
                  </div>
                </div>
              )}

              {/* 면책 */}
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '11px',
                color: 'rgba(245,242,237,0.2)',
                marginTop: '24px',
                lineHeight: '1.6',
                paddingTop: '16px',
                borderTop: '0.5px solid rgba(255,255,255,0.05)',
              }}>
                ※ AI 답변은 참고용입니다. 의료·법률·금융·세무 관련 결정은 반드시 전문가와 상담하세요.
              </p>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
