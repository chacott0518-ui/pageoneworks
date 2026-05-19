'use client'

import { useState, useEffect, useCallback } from 'react'

const SESSION_KEY = 'pageoneworks_aiqna_used'

interface QAEntry {
  question: string
  answer: string
}

interface AIQnAProps {
  category?: string
  placeholder?: string
}

// 마크다운 ## 헤딩과 **볼드** 렌더링
function renderAnswer(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      elements.push(<div key={key++} style={{ height: '8px' }} />)
      continue
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <div key={key++} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          margin: '20px 0 8px',
        }}>
          <div style={{ width: '3px', height: '18px', background: '#C4A882', borderRadius: '2px', flexShrink: 0 }} />
          <p style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C4A882',
            fontWeight: 600,
            margin: 0,
          }}>
            {trimmed.replace('## ', '')}
          </p>
        </div>
      )
      continue
    }

    // **볼드** 처리
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#f5f2ed', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
      }
      return part
    })

    elements.push(
      <p key={key++} style={{
        fontFamily: 'var(--font-inter)',
        fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
        fontWeight: 300,
        color: 'rgba(245,242,237,0.75)',
        lineHeight: '1.8',
        margin: '4px 0',
        wordBreak: 'keep-all',
      }}>
        {rendered}
      </p>
    )
  }
  return elements
}

export default function AIQnA({ category, placeholder = '이 아티클에 대해 궁금한 점을 질문해 보세요...' }: AIQnAProps) {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<QAEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionUsed, setSessionUsed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSessionUsed(!!sessionStorage.getItem(SESSION_KEY))
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    const q = question.trim()
    if (!q || loading || sessionUsed) return
    if (q.length < 5) {
      setError('질문은 최소 5자 이상 입력해 주세요.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, category }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '오류가 발생했습니다.')
        return
      }
      setResult({ question: data.question, answer: data.answer })
      setQuestion('')
      // 세션 사용 기록
      sessionStorage.setItem(SESSION_KEY, '1')
      setSessionUsed(true)
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [question, category, loading, sessionUsed])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section style={{
      margin: '48px 0',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #111 100%)',
      border: '1px solid rgba(196,168,130,0.3)',
      borderRadius: '2px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* 상단 골드 라인 */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #C4A882, #9E8A7A, #C4A882)' }} />

      <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#C4A882',
              background: 'rgba(196,168,130,0.1)',
              border: '1px solid rgba(196,168,130,0.3)',
              padding: '4px 10px',
              borderRadius: '2px',
            }}>
              AI Q&A
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(196,168,130,0.2)' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 400,
            color: '#f5f2ed',
            margin: '0 0 6px',
            lineHeight: 1.2,
          }}>
            AI 에디터에게 물어보세요
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            fontWeight: 300,
            color: 'rgba(245,242,237,0.4)',
            margin: 0,
            letterSpacing: '0.02em',
          }}>
            PAGEONEWORKS AI가 전문 답변을 드립니다 · 하루 1회 이용 가능
          </p>
        </div>

        {/* 이미 사용한 경우 */}
        {sessionUsed && !result && (
          <div style={{
            padding: '20px 24px',
            background: 'rgba(196,168,130,0.05)',
            border: '1px solid rgba(196,168,130,0.2)',
            borderRadius: '2px',
          }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: 300,
              color: 'rgba(245,242,237,0.5)',
              margin: 0,
              textAlign: 'center',
            }}>
              오늘 이미 AI 질문을 사용하셨습니다. 내일 다시 이용해 주세요.
            </p>
          </div>
        )}

        {/* 입력창 — 사용 전에만 표시 */}
        {!sessionUsed && (
          <div style={{ position: 'relative' }}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              maxLength={500}
              disabled={loading}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${error ? '#E53E3E' : 'rgba(196,168,130,0.25)'}`,
                borderRadius: '2px',
                padding: '16px 120px 16px 16px',
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                fontWeight: 300,
                color: '#f5f2ed',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(196,168,130,0.6)'}
              onBlur={(e) => e.target.style.borderColor = error ? '#E53E3E' : 'rgba(196,168,130,0.25)'}
            />
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                color: 'rgba(245,242,237,0.25)',
              }}>
                {question.length}/500
              </span>
              <button
                onClick={handleSubmit}
                disabled={loading || question.trim().length < 5}
                style={{
                  background: loading
                    ? 'rgba(196,168,130,0.2)'
                    : question.trim().length >= 5
                    ? 'linear-gradient(135deg, #C4A882, #9E8A7A)'
                    : 'rgba(196,168,130,0.15)',
                  color: question.trim().length >= 5 ? '#0f0f0f' : 'rgba(245,242,237,0.3)',
                  border: 'none',
                  padding: '8px 16px',
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: loading || question.trim().length < 5 ? 'not-allowed' : 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                  fontWeight: 600,
                }}
              >
                {loading ? '생성 중...' : '질문하기'}
              </button>
            </div>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(196,168,130,0.05)',
            border: '1px solid rgba(196,168,130,0.15)',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(196,168,130,0.3)',
              borderTopColor: '#C4A882',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0,
            }} />
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              fontWeight: 300,
              color: 'rgba(245,242,237,0.5)',
              margin: 0,
            }}>
              AI 에디터가 답변을 작성하고 있습니다...
            </p>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: 'rgba(229,62,62,0.08)',
            border: '1px solid rgba(229,62,62,0.3)',
            borderRadius: '2px',
          }}>
            <p style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              color: '#FC8181',
              margin: 0,
            }}>
              ⚠ {error}
            </p>
          </div>
        )}

        {/* 답변 */}
        {result && (
          <div style={{ marginTop: '28px' }}>
            {/* 구분선 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(196,168,130,0.15)' }} />
              <span style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'rgba(196,168,130,0.4)',
                textTransform: 'uppercase',
              }}>
                AI 답변
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(196,168,130,0.15)' }} />
            </div>

            {/* 질문 */}
            <div style={{
              display: 'flex',
              gap: '14px',
              marginBottom: '20px',
              padding: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '2px',
            }}>
              <span style={{
                flexShrink: 0,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'rgba(245,242,237,0.6)',
              }}>
                Q
              </span>
              <p style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                fontWeight: 400,
                color: 'rgba(245,242,237,0.85)',
                margin: 0,
                lineHeight: '1.6',
                paddingTop: '4px',
              }}>
                {result.question}
              </p>
            </div>

            {/* 답변 */}
            <div style={{
              display: 'flex',
              gap: '14px',
            }}>
              <span style={{
                flexShrink: 0,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C4A882, #9E8A7A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#0f0f0f',
              }}>
                A
              </span>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                {renderAnswer(result.answer)}
              </div>
            </div>
          </div>
        )}

        {/* 하단 면책 */}
        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(196,168,130,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}>
          <span style={{ color: 'rgba(196,168,130,0.4)', fontSize: '12px', flexShrink: 0 }}>※</span>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '12px',
            fontWeight: 300,
            color: 'rgba(245,242,237,0.25)',
            margin: 0,
            lineHeight: '1.6',
          }}>
            AI 답변은 참고용입니다. 의료·법률·금융·세무 관련 결정은 반드시 전문가와 상담하세요.
          </p>
        </div>
      </div>

      {/* 스핀 애니메이션 */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}