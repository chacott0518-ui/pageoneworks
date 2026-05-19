'use client'

import { useState, useCallback } from 'react'

interface QAEntry {
  question: string
  answer: string
}

interface AIQnAProps {
  category?: string
  placeholder?: string
}

export default function AIQnA({
  category,
  placeholder = '이 아티클에 대해 궁금한 점을 질문해 보세요...',
}: AIQnAProps) {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<QAEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    const q = question.trim()
    if (!q || loading) return
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
      setHistory((prev) => [{ question: data.question, answer: data.answer }, ...prev])
      setQuestion('')
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [question, category, loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <section
      className="my-12 rounded-2xl border p-8"
      style={{ background: '#f8f7f5', borderColor: '#e5e2dd' }}
    >
      {/* 헤더 */}
      <div className="mb-6">
        <p
          className="uppercase mb-1"
          style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em', color: '#9E8A7A' }}
        >
          AI Q&A
        </p>
        <h2
          style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 500, color: '#1a1a1a' }}
        >
          AI 에디터에게 물어보세요
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, color: 'rgba(26,26,26,0.5)' }}
        >
          PAGEONEWORKS AI가 전문 답변을 드립니다 · Ctrl+Enter로 전송
        </p>
      </div>

      {/* 입력창 */}
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          maxLength={500}
          disabled={loading}
          className="w-full text-sm resize-none rounded-xl border px-4 py-3 focus:outline-none transition-all"
          style={{
            background: '#fff',
            borderColor: error ? '#e53e3e' : '#e5e2dd',
            color: '#1a1a1a',
            fontFamily: 'var(--font-inter)',
            paddingRight: '100px',
          }}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-xs" style={{ color: 'rgba(26,26,26,0.35)' }}>
            {question.length}/500
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || question.trim().length < 5}
            className="px-4 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-40"
            style={{
              background: loading ? '#e5e2dd' : '#1a1a1a',
              color: loading ? '#666' : '#fff',
              fontFamily: 'var(--font-space-mono)',
              letterSpacing: '0.05em',
              cursor: loading || question.trim().length < 5 ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '생성 중...' : '질문하기'}
          </button>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <p className="mt-2 text-xs" style={{ color: '#e53e3e' }}>
          ⚠ {error}
        </p>
      )}

      {/* 답변 목록 */}
      {history.length > 0 && (
        <div className="mt-8 space-y-6">
          {history.map((entry, i) => (
            <div key={i}>
              {/* 질문 */}
              <div className="flex gap-3 mb-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#1a1a1a', fontFamily: 'var(--font-space-mono)' }}
                >
                  Q
                </span>
                <p
                  className="text-sm font-medium pt-0.5"
                  style={{ color: '#1a1a1a', fontFamily: 'var(--font-inter)' }}
                >
                  {entry.question}
                </p>
              </div>
              {/* 답변 */}
              <div className="flex gap-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#9E8A7A', fontFamily: 'var(--font-space-mono)' }}
                >
                  A
                </span>
                <div className="flex-1">
                  {entry.answer.split('\n').filter(Boolean).map((line, li) => (
                    <p
                      key={li}
                      className="text-sm mb-2 leading-relaxed"
                      style={{ color: 'rgba(26,26,26,0.7)', fontFamily: 'var(--font-inter)', fontWeight: 300 }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              {i < history.length - 1 && <hr className="mt-4" style={{ borderColor: '#e5e2dd' }} />}
            </div>
          ))}
        </div>
      )}

      {/* 면책 고지 */}
      <p
        className="mt-6 text-xs"
        style={{ color: 'rgba(26,26,26,0.35)', fontFamily: 'var(--font-inter)', lineHeight: '1.5' }}
      >
        AI 답변은 참고용입니다. 의료·법률·금융·세무 관련 결정은 반드시 전문가와 상담하세요.
      </p>
    </section>
  )
}