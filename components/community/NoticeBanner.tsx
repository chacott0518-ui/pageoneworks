// components/community/NoticeBanner.tsx

'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { COMMUNITY_COLORS } from './constants'

export type CommunityNoticeItem = {
  id: string
  title: string
  content: string | null
}

export function NoticeBanner({ notices }: { notices: CommunityNoticeItem[] }) {
  const [index, setIndex] = useState(0)

  const go = useCallback(
    (dir: -1 | 1) => {
      if (notices.length <= 1) return
      setIndex((i) => (i + dir + notices.length) % notices.length)
    },
    [notices.length]
  )

  useEffect(() => {
    if (notices.length <= 1) return
    const t = window.setInterval(() => go(1), 5000)
    return () => window.clearInterval(t)
  }, [notices.length, go])

  if (!notices.length) return null

  const current = notices[index]
  const multi = notices.length > 1

  return (
    <div
      className="block mb-4 px-4 py-3 rounded-lg"
      style={{
        borderLeft: `2px solid ${COMMUNITY_COLORS.gold}`,
        background: 'rgba(201,169,110,0.06)',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-[9px] font-medium px-1.5 py-0.5 shrink-0"
          style={{ background: COMMUNITY_COLORS.gold, color: '#0d0d0f', borderRadius: '4px' }}
        >
          공지
        </span>
        {multi && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 공지"
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md"
            style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}`, color: COMMUNITY_COLORS.sub }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium truncate m-0" style={{ color: COMMUNITY_COLORS.text }}>
            {current.title}
          </p>
          {current.content && (
            <p
              className="text-[11px] font-normal m-0 mt-1"
              style={{
                color: COMMUNITY_COLORS.sub,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {current.content}
            </p>
          )}
        </div>
        {multi && (
          <>
            <span className="text-[10px] font-medium shrink-0" style={{ color: COMMUNITY_COLORS.meta }}>
              공지 {index + 1}/{notices.length}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 공지"
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md"
              style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}`, color: COMMUNITY_COLORS.sub }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
