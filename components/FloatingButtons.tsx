'use client'

import { useState, useEffect, useCallback } from 'react'

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

  // 모바일 감지
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
    document.body.style.overflow = panelOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [panelOpen])

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

  // PC: bottom 60px right 40px / 모바일: bottom 24px right 16px
  const btnBottom = isMobile ? '24px' : '60px'
  const btnRight = isMobile ? '16px' : '40px'
  const btnSize = isMobile ? '48px' : '52px'
  const panelWidth = isMobile ? '100vw' : 'min(460px, 100vw)'

  return (
    <>
      {/* ── 플로팅 버튼 그룹 ── */}
      <div style={{
        position: 'fixed',
        bottom: btnBottom,
        right: btnRight,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        zIndex: 99998,
        transition: 'bottom 0.2s, right 0.2s',
      }}>
        {/* AI 질문 버튼 */}
        <button
          onClick={() => setPanelOpen(true)}
          aria-label="AI 에디터에게 질문하기"
          title="AI 에디터에게 질문하기"
          style={{
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
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '16px', color: '#C4A882', lineHeight: 1 }}>✦</span>
          <span style={{ fontSize: '8px', color: '#C4A882', fontFamily: 'var(--font-space-mono)', letterSpacing: '0.05em' }}>AI</span>
        </button>

        {/* 글쓰기 버튼 */}
        <button
          onClick={() => { window.location.href = '/community' }}
          aria-label="커뮤니티 글쓰기"
          title="커뮤니티 글쓰기"
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: '50%',
            background: '#C4A882',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '2px',
            boxShadow: '0 4px 20px rgba(196,168,130,0.25)',
            transition: 'transform 0.2s, opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '16px', color: '#0a0a0a', lineHeight: 1 }}>✏</span>
          <span style={{ fontSize: '8px', color: '#0a0a0a', fontFamily: 'var(--font-space-mono)', letterSpacing: '0.05em', fontWeight: 700 }}>글쓰기</span>
        </button>
      </div>

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