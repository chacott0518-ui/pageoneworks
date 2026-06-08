// app/admin/notices/page.tsx

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/admin/Toast'

const MAX_NOTICES = 3
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'

type NoticeRow = {
  id: string
  title: string
  created_at: string
  category_slug: string
}

type SearchResult = {
  id: string
  title: string
}

function useDebounce<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return debounced
}

export default function AdminNoticesPage() {
  const supabase = useMemo(() => createClient(), [])
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [notices, setNotices] = useState<NoticeRow[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, title, created_at, category_slug')
      .eq('is_pinned', true)
      .order('created_at', { ascending: true })

    if (error) {
      showToast('공지 목록을 불러오지 못했습니다', 'error')
    } else {
      setNotices((data ?? []) as NoticeRow[])
    }
    setLoading(false)
  }, [supabase, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([])
      return
    }
    const run = async () => {
      setSearching(true)
      const { data } = await supabase
        .from('community_posts')
        .select('id, title')
        .ilike('title', `%${debouncedSearch.trim()}%`)
        .or('is_pinned.is.null,is_pinned.eq.false')
        .limit(10)
      setResults((data ?? []) as SearchResult[])
      setSearching(false)
    }
    run()
  }, [debouncedSearch, supabase])

  const unpin = async (notice: NoticeRow) => {
    const prev = notices
    setNotices((n) => n.filter((x) => x.id !== notice.id))
    const { error } = await supabase.from('community_posts').update({ is_pinned: false }).eq('id', notice.id)
    if (error) {
      setNotices(prev)
      showToast('공지 해제에 실패했습니다', 'error')
    } else {
      showToast('공지가 해제되었습니다', 'success')
    }
  }

  const pinPost = async (post: SearchResult) => {
    if (notices.length >= MAX_NOTICES) {
      showToast(`공지는 최대 ${MAX_NOTICES}개까지 지정할 수 있습니다`, 'warning')
      return
    }
    const { data } = await supabase
      .from('community_posts')
      .select('id, title, created_at, category_slug')
      .eq('id', post.id)
      .maybeSingle()
    if (!data) return

    const prev = notices
    setNotices((n) => [...n, data as NoticeRow])
    setSearch('')
    setResults([])
    const { error } = await supabase.from('community_posts').update({ is_pinned: true }).eq('id', post.id)
    if (error) {
      setNotices(prev)
      showToast('공지 지정에 실패했습니다', 'error')
    } else {
      showToast('공지로 지정되었습니다', 'success')
    }
  }

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= notices.length) return
    const next = [...notices]
    const a = next[index]
    const b = next[target]
    next[index] = b
    next[target] = a
    setNotices(next)

    const aTime = new Date(a.created_at).getTime()
    const bTime = new Date(b.created_at).getTime()
    const mid = new Date((aTime + bTime) / 2).toISOString()

    const { error: errA } = await supabase.from('community_posts').update({ created_at: mid }).eq('id', a.id)
    const { error: errB } = await supabase
      .from('community_posts')
      .update({ created_at: b.created_at })
      .eq('id', b.id)
    if (errA || errB) {
      load()
      showToast('순서 변경에 실패했습니다', 'error')
    } else {
      showToast('순서가 변경되었습니다', 'success')
    }
  }

  const btnStyle: React.CSSProperties = {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 8,
    border: BORDER,
    background: SURFACE,
    color: TEXT,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: '150ms',
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>공지 관리</h1>
      <p style={{ fontSize: 12, color: SUB, margin: '0 0 24px' }}>
        공지는 최대 {MAX_NOTICES}개까지 고정할 수 있습니다. ({notices.length}/{MAX_NOTICES})
      </p>

      <section style={{ border: BORDER, borderRadius: 8, background: SURFACE, padding: 16, marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, color: TEXT, margin: '0 0 16px' }}>현재 공지</h2>
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} style={{ height: 56, borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: 8 }} />
          ))
        ) : notices.length === 0 ? (
          <p style={{ fontSize: 12, color: META }}>고정된 공지가 없습니다</p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {notices.map((n, i) => (
              <li
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 0',
                  borderBottom: BORDER,
                }}
              >
                <span style={{ fontSize: 12, color: GOLD, width: 24 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: TEXT, margin: 0 }}>{n.title}</p>
                  <p style={{ fontSize: 11, color: META, margin: '4px 0 0' }}>{n.category_slug}</p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} style={btnStyle}>
                    ↑
                  </button>
                  <button type="button" disabled={i === notices.length - 1} onClick={() => move(i, 1)} style={btnStyle}>
                    ↓
                  </button>
                  <button type="button" onClick={() => unpin(n)} style={{ ...btnStyle, color: GOLD }}>
                    해제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ border: BORDER, borderRadius: 8, background: SURFACE, padding: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, color: TEXT, margin: '0 0 16px' }}>공지 지정</h2>
        <input
          type="search"
          placeholder="글 제목 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            height: 40,
            padding: '0 12px',
            borderRadius: 8,
            border: BORDER,
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            marginBottom: 8,
          }}
        />
        {searching && <p style={{ fontSize: 11, color: META }}>검색 중...</p>}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {results.map((r) => (
            <li
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: BORDER,
              }}
            >
              <span style={{ fontSize: 13, color: TEXT }}>{r.title}</span>
              <button type="button" onClick={() => pinPost(r)} style={{ ...btnStyle, color: GOLD }}>
                지정
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
