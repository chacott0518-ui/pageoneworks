// app/admin/comments/page.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'

const PAGE_SIZE = 20
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const DANGER = 'rgba(255,70,70,0.9)'
const WARNING = 'rgba(255,180,0,0.9)'
const BG = '#0a0a0c'

type CommentRow = {
  id: string
  content: string
  created_at: string
  post_id: string
  is_hidden: boolean | null
  author: string
  postTitle: string
}

function useDebounce<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return debounced
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n)}…` : s
}

export default function AdminCommentsPage() {
  const supabase = useMemo(() => createClient(), [])
  const { showToast } = useToast()
  const { confirm } = useConfirm()

  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<CommentRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const load = useCallback(async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('community_comments')
      .select(
        'id, content, created_at, post_id, is_hidden, profiles(nickname), community_posts(title)',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    if (debouncedSearch.trim()) {
      query = query.ilike('content', `%${debouncedSearch.trim()}%`)
    }

    const { data, count, error } = await query.range(from, to)

    if (error) {
      showToast('댓글 목록을 불러오지 못했습니다', 'error')
      setLoading(false)
      return
    }

    setTotal(count ?? 0)
    setComments(
      (data ?? []).map((c) => {
        const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
        const post = Array.isArray(c.community_posts) ? c.community_posts[0] : c.community_posts
        return {
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          post_id: c.post_id,
          is_hidden: c.is_hidden ?? null,
          author: (prof as { nickname?: string } | null)?.nickname ?? '회원',
          postTitle: (post as { title?: string } | null)?.title ?? '(삭제된 글)',
        }
      })
    )
    setLoading(false)
  }, [supabase, page, debouncedSearch, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const toggleHidden = async (comment: CommentRow) => {
    const next = !comment.is_hidden
    const prev = comments
    setComments((c) => c.map((x) => (x.id === comment.id ? { ...x, is_hidden: next } : x)))
    const { error } = await supabase.from('community_comments').update({ is_hidden: next }).eq('id', comment.id)
    if (error) {
      setComments(prev)
      showToast('블라인드 처리에 실패했습니다', 'error')
    } else {
      showToast(next ? '블라인드 처리되었습니다' : '블라인드가 해제되었습니다', 'success')
    }
  }

  const deleteComment = (comment: CommentRow) => {
    confirm({
      title: '댓글 삭제',
      message: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmLabel: '삭제',
      onConfirm: async () => {
        const prev = comments
        setComments((c) => c.filter((x) => x.id !== comment.id))
        const { error } = await supabase.from('community_comments').delete().eq('id', comment.id)
        if (error) {
          setComments(prev)
          showToast('삭제에 실패했습니다', 'error')
          return
        }
        const { data: post } = await supabase
          .from('community_posts')
          .select('id, comment_count')
          .eq('id', comment.post_id)
          .maybeSingle()
        if (post) {
          const nextCount = Math.max(0, (post.comment_count ?? 1) - 1)
          await supabase.from('community_posts').update({ comment_count: nextCount }).eq('id', comment.post_id)
        }
        setTotal((t) => t - 1)
        showToast('댓글이 삭제되었습니다', 'success')
      },
    })
  }

  const inputStyle: React.CSSProperties = {
    height: 40,
    padding: '0 12px',
    borderRadius: 8,
    border: BORDER,
    background: SURFACE,
    color: TEXT,
    fontSize: 13,
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
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

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>댓글 관리</h1>
      <input
        type="search"
        placeholder="댓글 내용 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <div className="admin-comments-table" style={{ overflowX: 'auto', border: BORDER, borderRadius: 8, background: SURFACE }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: META, textAlign: 'left' }}>
              <th style={{ padding: 8, fontWeight: 500 }}>댓글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>작성자</th>
              <th style={{ padding: 8, fontWeight: 500 }}>원글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>작성일</th>
              <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} style={{ padding: 8 }}>
                    <div style={{ height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
                  </td>
                </tr>
              ))
            ) : comments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: META }}>
                  댓글이 없습니다
                </td>
              </tr>
            ) : (
              comments.map((c) => (
                <tr
                  key={c.id}
                  style={{ borderTop: BORDER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <td style={{ padding: 8, color: TEXT, maxWidth: 280 }}>
                    {truncate(c.content, 50)}
                    {c.is_hidden && (
                      <span style={{ marginLeft: 8, fontSize: 10, color: WARNING }}>(블라인드)</span>
                    )}
                  </td>
                  <td style={{ padding: 8, color: SUB }}>{c.author}</td>
                  <td style={{ padding: 8, maxWidth: 180 }}>
                    <Link href={`/community/${c.post_id}`} target="_blank" style={{ color: GOLD, textDecoration: 'none' }}>
                      {truncate(c.postTitle, 30)}
                    </Link>
                  </td>
                  <td style={{ padding: 8, color: META }}>{formatDate(c.created_at)}</td>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" onClick={() => toggleHidden(c)} style={{ ...btnStyle, color: WARNING }}>
                        {c.is_hidden ? '해제' : '블라인드'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteComment(c)}
                        style={{ ...btnStyle, background: DANGER, color: BG, border: 'none' }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-comments-cards" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
        {!loading &&
          comments.map((c) => (
            <div key={c.id} style={{ border: BORDER, borderRadius: 8, background: SURFACE, padding: 16 }}>
              <p style={{ fontSize: 13, color: TEXT, margin: 0 }}>{truncate(c.content, 80)}</p>
              <p style={{ fontSize: 11, color: META, margin: '8px 0' }}>
                {c.author} · {formatDate(c.created_at)}
              </p>
              <Link href={`/community/${c.post_id}`} style={{ fontSize: 12, color: GOLD }}>
                {c.postTitle}
              </Link>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" onClick={() => toggleHidden(c)} style={btnStyle}>
                  {c.is_hidden ? '해제' : '블라인드'}
                </button>
                <button type="button" onClick={() => deleteComment(c)} style={{ ...btnStyle, background: DANGER, color: BG, border: 'none' }}>
                  삭제
                </button>
              </div>
            </div>
          ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={btnStyle}>
          이전
        </button>
        <span style={{ fontSize: 12, color: SUB, alignSelf: 'center' }}>
          {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={btnStyle}>
          다음
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width:768px) {
          .admin-comments-table { display: none !important; }
          .admin-comments-cards { display: flex !important; }
        }
      `}} />
    </div>
  )
}
