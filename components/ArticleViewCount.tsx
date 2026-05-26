'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface Props {
  slug: string
}

export default function ArticleViewCount({ slug }: Props) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const track = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`, { method: 'POST' })
        if (res.ok) {
          const data = await res.json()
          setCount(data.viewCount)
        }
      } catch {
        // 에러 시 무시
      }
    }
    track()
  }, [slug])

  if (count === null || count <= 0) return null

  return (
    <>
      <span className="text-cream/20">·</span>
      <span
        className="inline-flex items-center gap-1 text-cream/70"
        style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
      >
        <Eye className="w-3 h-3" />
        {count.toLocaleString()}
      </span>
    </>
  )
}
