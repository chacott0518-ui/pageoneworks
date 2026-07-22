// components/FloatingButtons.tsx

'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AiComingSoonModal } from '@/components/AiComingSoonModal'

interface FloatingButtonsProps {
  category?: string
}

export default function FloatingButtons(_props: FloatingButtonsProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const btnBottom = isMobile ? '24px' : '60px'
  const btnRight = isMobile ? '16px' : '40px'
  const btnSize = isMobile ? '48px' : '52px'

  if (pathname.startsWith('/community')) return null
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <button
        onClick={() => setComingSoonOpen(true)}
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
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
      >
        <span style={{ fontSize: '16px', color: '#C4A882', lineHeight: 1 }}>✦</span>
        <span style={{ fontSize: '8px', color: '#C4A882', fontFamily: 'var(--font-space-mono)', letterSpacing: '0.05em' }}>AI</span>
      </button>

      <AiComingSoonModal open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />
    </>
  )
}
