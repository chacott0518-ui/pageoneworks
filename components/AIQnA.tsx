'use client'

import { useState } from 'react'
import { AiComingSoonModal } from '@/components/AiComingSoonModal'

interface AIQnAProps {
  category?: string
  placeholder?: string
}

export default function AIQnA(_props: AIQnAProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section
        className="article-ai-qna"
        style={{
          margin: '48px 0',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #111 100%)',
          border: '1px solid rgba(196,168,130,0.3)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #C4A882, #9E8A7A, #C4A882)' }} />

        <div className="article-ai-qna-body">
          <div className="article-ai-qna-head">
            <div className="article-ai-qna-label-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#C4A882',
                  background: 'rgba(196,168,130,0.1)',
                  border: '1px solid rgba(196,168,130,0.3)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                }}
              >
                AI Q&A
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(196,168,130,0.2)' }} />
            </div>
            <h2
              className="article-ai-qna-title"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontWeight: 400,
                color: '#f5f2ed',
                wordBreak: 'keep-all',
                minWidth: 0,
              }}
            >
              AI 에디터 업데이트 준비 중
            </h2>
            <p
              className="article-ai-qna-desc"
              style={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 300,
                color: 'rgba(245,242,237,0.45)',
                margin: 0,
                letterSpacing: '0.02em',
                lineHeight: 1.7,
                wordBreak: 'keep-all',
              }}
            >
              더 정확하고 신뢰할 수 있는 답변을 위해 기능을 개선하고 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="AI 에디터 업데이트 안내 보기"
            className="article-ai-qna-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              padding: '0 22px',
              background: 'linear-gradient(135deg, #C4A882, #9E8A7A)',
              color: '#0f0f0f',
              border: 'none',
              borderRadius: '2px',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            안내 보기
          </button>
        </div>
      </section>

      <AiComingSoonModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
