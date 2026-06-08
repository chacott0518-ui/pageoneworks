// components/admin/posts/PostsManager.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { COMMUNITY_CATEGORIES } from '@/components/community/constants'
import { ADMIN_THEME, PAGE_SIZE } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useDebounce } from '@/components/admin/hooks/useDebounce'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'
import { SkeletonTable, SkeletonCards } from '@/components/admin/Skeleton'
import { Pagination } from '@/components/admin/Pagination'
import { PostStatusBadge } from './PostStatusBadge'

const T = ADMIN_THEME
type SortKey = 'latest' | 'popular' | 'comment'
type StatusFilter = 'all' | 'normal' | 'hidden' | 'pinned'

type PostRow = {
  id: string
  title: string
  category_slug: string
  created_at: string
  view_count: number | null
  comment_count: number | null
  is_hidden: boolean | null
  is_pinned: boolean | null
  author: string
}

const inputStyle: React.CSSProperties = {
  height: 40,
  padding: '0 12px',
  borderRadius: 8,
  border: T.border,
  background: T.surface,
  color: T.text,
  fontSize: 13,
  fontWeight: 400,
  width: '100%',
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

export function PostsManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<PostRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [category, setCategory] = useState('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortKey>('latest')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const categories = COMMUNITY_CATEGORIES.filter((c) => c.slug !== 'all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams({
        page: String(page),
        search: debouncedSearch,
        category,
        status: statusFilter,
        sort,
      })
      const data = await adminFetch<{ posts: PostRow[]; total: number }>(`/api/admin/posts?${qs}`)
      setPosts(data.posts)
      setTotal(data.total)
    } catch (e) {
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, category, statusFilter, sort, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, statusFilter, sort])

  const patchPost = async (id: string, patch: Partial<PostRow>, body: Record<string, boolean>) => {
    const prev = posts
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    try {
      await adminFetch(`/api/admin/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
      return true
    } catch (e) {
      setPosts(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
      return false
    }
  }

  const togglePin = async (post: PostRow) => {
    const next = !post.is_pinned
    const ok = await patchPost(post.id, { is_pinned: next }, { is_pinned: next })
    if (ok) showToast(next ? '공지로 고정되었습니다' : '공지 고정이 해제되었습니다', 'success')
  }

  const toggleHidden = async (post: PostRow) => {
    const next = !post.is_hidden
    const ok = await patchPost(post.id, { is_hidden: next }, { is_hidden: next })
    if (ok) showToast(next ? '블라인드 처리되었습니다' : '블라인드가 해제되었습니다', 'success')
  }

  const deleteOne = (id: string) => {
    confirm({
      title: '글 삭제',
      message: '삭제하면 복구할 수 없습니다. 계속하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        const prev = posts
        setPosts((p) => p.filter((x) => x.id !== id))
        setSelected((s) => { const n = new Set(s); n.delete(id); return n })
        try {
          await adminFetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
          setTotal((t) => t - 1)
          showToast('글이 삭제되었습니다', 'success')
        } catch (e) {
          setPosts(prev)
          showToast(e instanceof Error ? e.message : '실패', 'error')
        }
      },
    })
  }

  const bulkHidden = async () => {
    const ids = Array.from(selected)
    if (!ids.length) return
    const prev = posts
    setPosts((p) => p.map((x) => (ids.includes(x.id) ? { ...x, is_hidden: true } : x)))
    try {
      await adminFetch('/api/admin/posts', { method: 'PATCH', body: JSON.stringify({ action: 'hide', ids }) })
      showToast('선택한 글이 블라인드 처리되었습니다', 'success')
      setSelected(new Set())
    } catch (e) {
      setPosts(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const bulkDelete = () => {
    const ids = Array.from(selected)
    if (!ids.length) return
    confirm({
      title: '일괄 삭제',
      message: `선택한 ${ids.length}개 글을 삭제하시겠습니까?`,
      confirmText: '삭제',
      onConfirm: async () => {
        const prev = posts
        setPosts((p) => p.filter((x) => !ids.includes(x.id)))
        setSelected(new Set())
        try {
          await adminFetch('/api/admin/posts', { method: 'PATCH', body: JSON.stringify({ action: 'delete', ids }) })
          setTotal((t) => t - ids.length)
          showToast('선택한 글이 삭제되었습니다', 'success')
        } catch (e) {
          setPosts(prev)
          showToast(e instanceof Error ? e.message : '실패', 'error')
        }
      },
    })
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  const actionButtons = (post: PostRow) => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      <button type="button" onClick={() => togglePin(post)} style={btnStyle} title="공지">📌</button>
      <button type="button" onClick={() => toggleHidden(post)} style={btnStyle} title="블라인드">🚫</button>
      <button type="button" onClick={() => deleteOne(post.id)} style={{ ...btnStyle, background: T.danger, color: T.bg, border: 'none' }} title="삭제">🗑️</button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: '0 0 24px' }}>글 관리</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, marginBottom: 16 }}>
        <input type="search" placeholder="제목 검색" value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="all">전체 카테고리</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} style={inputStyle}>
          <option value="all">전체 상태</option>
          <option value="normal">정상</option>
          <option value="hidden">블라인드</option>
          <option value="pinned">공지고정</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={inputStyle}>
          <option value="latest">최신순</option>
          <option value="popular">조회수순</option>
          <option value="comment">댓글순</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: T.sub }}>{selected.size}개 선택됨</span>
          <button type="button" onClick={bulkHidden} style={{ ...btnStyle, color: T.warning }}>일괄 블라인드</button>
          <button type="button" onClick={bulkDelete} style={{ ...btnStyle, background: T.danger, color: T.bg, border: 'none' }}>일괄 삭제</button>
        </div>
      )}

      <div className="admin-posts-table" style={{ overflowX: 'auto', border: T.border, borderRadius: 8, background: T.surface }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.meta, textAlign: 'left' }}>
              <th style={{ padding: 8, width: 36 }}>
                <input type="checkbox" checked={posts.length > 0 && selected.size === posts.length} onChange={() => {
                  if (selected.size === posts.length) setSelected(new Set())
                  else setSelected(new Set(posts.map((p) => p.id)))
                }} />
              </th>
              <th style={{ padding: 8, fontWeight: 500 }}>제목</th>
              <th style={{ padding: 8, fontWeight: 500 }}>카테고리</th>
              <th style={{ padding: 8, fontWeight: 500 }}>작성자</th>
              <th style={{ padding: 8, fontWeight: 500 }}>작성일</th>
              <th style={{ padding: 8, fontWeight: 500 }}>조회</th>
              <th style={{ padding: 8, fontWeight: 500 }}>댓글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>상태</th>
              <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTable rows={5} cols={9} />
            ) : posts.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: T.meta }}>글이 없습니다</td></tr>
            ) : posts.map((post) => (
              <tr key={post.id} style={{ borderTop: T.border }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                <td style={{ padding: 8 }}><input type="checkbox" checked={selected.has(post.id)} onChange={() => {
                  setSelected((prev) => { const n = new Set(prev); if (n.has(post.id)) n.delete(post.id); else n.add(post.id); return n })
                }} /></td>
                <td style={{ padding: 8, maxWidth: 220 }}><Link href={`/community/${post.id}`} target="_blank" style={{ color: T.text, textDecoration: 'none' }}>{post.title}</Link></td>
                <td style={{ padding: 8 }}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, border: T.border, color: T.sub }}>{post.category_slug}</span></td>
                <td style={{ padding: 8, color: T.sub }}>{post.author}</td>
                <td style={{ padding: 8, color: T.meta }}>{formatDate(post.created_at)}</td>
                <td style={{ padding: 8, color: T.meta }}>{post.view_count ?? 0}</td>
                <td style={{ padding: 8, color: T.meta }}>{post.comment_count ?? 0}</td>
                <td style={{ padding: 8 }}><PostStatusBadge post={post} /></td>
                <td style={{ padding: 8 }}>{actionButtons(post)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-posts-cards" style={{ display: 'none' }}>
        {loading ? <SkeletonCards count={4} /> : posts.map((post) => (
          <div key={post.id} style={{ border: T.border, borderRadius: 8, background: T.surface, padding: 16, marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="checkbox" checked={selected.has(post.id)} onChange={() => {
                setSelected((prev) => { const n = new Set(prev); if (n.has(post.id)) n.delete(post.id); else n.add(post.id); return n })
              }} />
              <div style={{ flex: 1 }}>
                <Link href={`/community/${post.id}`} target="_blank" style={{ color: T.text, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{post.title}</Link>
                <p style={{ fontSize: 11, color: T.meta, margin: '4px 0 0' }}>{post.category_slug} · {formatDate(post.created_at)}</p>
                <div style={{ marginTop: 8 }}>{actionButtons(post)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} pageSize={PAGE_SIZE} totalCount={total} onPageChange={setPage} />

      <style dangerouslySetInnerHTML={{ __html: `@media(max-width:768px){.admin-posts-table{display:none!important}.admin-posts-cards{display:block!important}}` }} />
    </div>
  )
}
