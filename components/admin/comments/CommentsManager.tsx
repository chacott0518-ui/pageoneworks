// components/admin/comments/CommentsManager.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ADMIN_THEME, PAGE_SIZE } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useDebounce } from '@/components/admin/hooks/useDebounce'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'
import { SkeletonTable, SkeletonCards } from '@/components/admin/Skeleton'
import { Pagination } from '@/components/admin/Pagination'

const T = ADMIN_THEME

type CommentRow = {
  id: string
  content: string
  created_at: string
  post_id: string
  is_hidden: boolean | null
  author: string
  postTitle: string
}

function truncate(s: string, n: number) {
  return s.length > n ? `${s.slice(0, n)}…` : s
}

const btnStyle: React.CSSProperties = {
  minHeight: 36,
  padding: '0 12px',
  borderRadius: 8,
  border: T.border,
  background: T.surface,
  color: T.text,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  transition: '150ms',
}

export function CommentsManager() {
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
    try {
      const qs = new URLSearchParams({ page: String(page), search: debouncedSearch })
      const data = await adminFetch<{ comments: CommentRow[]; total: number }>(`/api/admin/comments?${qs}`)
      setComments(data.comments)
      setTotal(data.total)
    } catch (e) {
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, showToast])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [debouncedSearch])

  const toggleHidden = async (comment: CommentRow) => {
    const next = !comment.is_hidden
    const prev = comments
    setComments((c) => c.map((x) => (x.id === comment.id ? { ...x, is_hidden: next } : x)))
    try {
      await adminFetch(`/api/admin/comments/${comment.id}`, { method: 'PATCH', body: JSON.stringify({ is_hidden: next }) })
      showToast(next ? '블라인드 처리되었습니다' : '블라인드가 해제되었습니다', 'success')
    } catch (e) {
      setComments(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const deleteComment = (comment: CommentRow) => {
    confirm({
      title: '댓글 삭제',
      message: '삭제하면 복구할 수 없습니다. 계속하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        const prev = comments
        setComments((c) => c.filter((x) => x.id !== comment.id))
        try {
          await adminFetch(`/api/admin/comments/${comment.id}`, { method: 'DELETE' })
          setTotal((t) => t - 1)
          showToast('댓글이 삭제되었습니다', 'success')
        } catch (e) {
          setComments(prev)
          showToast(e instanceof Error ? e.message : '실패', 'error')
        }
      },
    })
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: '0 0 24px' }}>댓글 관리</h1>
      <input type="search" placeholder="댓글 내용 검색" value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: 40, padding: '0 12px', borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 13, width: '100%', maxWidth: 400, marginBottom: 16 }} />

      <div className="admin-comments-table" style={{ overflowX: 'auto', border: T.border, borderRadius: 8, background: T.surface }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.meta, textAlign: 'left' }}>
              <th style={{ padding: 8, fontWeight: 500 }}>댓글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>작성자</th>
              <th style={{ padding: 8, fontWeight: 500 }}>원글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>날짜</th>
              <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <SkeletonTable rows={5} cols={5} /> : comments.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: T.meta }}>댓글이 없습니다</td></tr>
            ) : comments.map((c) => (
              <tr key={c.id} style={{ borderTop: T.border }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                <td style={{ padding: 8, color: T.text, maxWidth: 280 }}>{truncate(c.content, 50)}{c.is_hidden && <span style={{ marginLeft: 8, fontSize: 10, color: T.warning }}>(블라인드)</span>}</td>
                <td style={{ padding: 8, color: T.sub }}>{c.author}</td>
                <td style={{ padding: 8 }}><Link href={`/community/${c.post_id}`} target="_blank" style={{ color: T.gold, textDecoration: 'none' }}>{truncate(c.postTitle, 30)}</Link></td>
                <td style={{ padding: 8, color: T.meta }}>{formatDate(c.created_at)}</td>
                <td style={{ padding: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" onClick={() => toggleHidden(c)} style={{ ...btnStyle, color: T.warning }}>{c.is_hidden ? '해제' : '블라인드'}</button>
                    <button type="button" onClick={() => deleteComment(c)} style={{ ...btnStyle, background: T.danger, color: T.bg, border: 'none' }}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-comments-cards" style={{ display: 'none' }}>
        {!loading && comments.map((c) => (
          <div key={c.id} style={{ border: T.border, borderRadius: 8, background: T.surface, padding: 16, marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: T.text, margin: 0 }}>{truncate(c.content, 80)}</p>
            <p style={{ fontSize: 11, color: T.meta, margin: '8px 0' }}>{c.author} · {formatDate(c.created_at)}</p>
            <Link href={`/community/${c.post_id}`} style={{ fontSize: 12, color: T.gold }}>{c.postTitle}</Link>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="button" onClick={() => toggleHidden(c)} style={btnStyle}>{c.is_hidden ? '해제' : '블라인드'}</button>
              <button type="button" onClick={() => deleteComment(c)} style={{ ...btnStyle, background: T.danger, color: T.bg, border: 'none' }}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} pageSize={PAGE_SIZE} totalCount={total} onPageChange={setPage} />
      <style dangerouslySetInnerHTML={{ __html: `@media(max-width:768px){.admin-comments-table{display:none!important}.admin-comments-cards{display:block!important}}` }} />
    </div>
  )
}
