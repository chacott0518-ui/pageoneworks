// app/admin/posts/page.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { COMMUNITY_CATEGORIES } from '@/components/community/constants'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'

const PAGE_SIZE = 20
const BG = '#0a0a0c'
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const DANGER = 'rgba(255,70,70,0.9)'
const WARNING = 'rgba(255,180,0,0.9)'
const SUCCESS = 'rgba(70,200,100,0.9)'

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

function useDebounce<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return debounced
}

function SkeletonRows({ n = 5 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <tr key={i}>
          <td colSpan={9} style={{ padding: '8px' }}>
            <div
              style={{
                height: 40,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                animation: 'admin-pulse 1.2s ease-in-out infinite',
              }}
            />
          </td>
        </tr>
      ))}
    </>
  )
}

function PostStatusBadge({ post }: { post: PostRow }) {
  if (post.is_pinned) {
    return <span style={{ fontSize: 11, color: GOLD }}>공지</span>
  }
  if (post.is_hidden) {
    return <span style={{ fontSize: 11, color: WARNING }}>블라인드</span>
  }
  return <span style={{ fontSize: 11, color: SUCCESS }}>정상</span>
}

export default function AdminPostsPage() {
  const supabase = useMemo(() => createClient(), [])
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
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('community_posts')
      .select(
        'id, title, category_slug, created_at, view_count, comment_count, is_hidden, is_pinned, profiles(nickname)',
        { count: 'exact' }
      )

    if (debouncedSearch.trim()) {
      query = query.ilike('title', `%${debouncedSearch.trim()}%`)
    }
    if (category !== 'all') {
      query = query.eq('category_slug', category)
    }
    if (statusFilter === 'hidden') {
      query = query.eq('is_hidden', true)
    } else if (statusFilter === 'pinned') {
      query = query.eq('is_pinned', true)
    } else if (statusFilter === 'normal') {
      query = query.or('is_hidden.is.null,is_hidden.eq.false').or('is_pinned.is.null,is_pinned.eq.false')
    }

    if (sort === 'popular') {
      query = query.order('view_count', { ascending: false, nullsFirst: false })
    } else if (sort === 'comment') {
      query = query.order('comment_count', { ascending: false, nullsFirst: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, count, error } = await query.range(from, to)

    if (error) {
      showToast('글 목록을 불러오지 못했습니다', 'error')
      setLoading(false)
      return
    }

    setTotal(count ?? 0)
    setPosts(
      (data ?? []).map((p) => {
        const prof = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
        return {
          id: p.id,
          title: p.title,
          category_slug: p.category_slug,
          created_at: p.created_at,
          view_count: p.view_count,
          comment_count: p.comment_count,
          is_hidden: p.is_hidden,
          is_pinned: p.is_pinned,
          author: (prof as { nickname?: string } | null)?.nickname ?? '회원',
        }
      })
    )
    setLoading(false)
  }, [supabase, page, debouncedSearch, category, statusFilter, sort, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, statusFilter, sort])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === posts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(posts.map((p) => p.id)))
    }
  }

  const updatePost = async (id: string, patch: Partial<PostRow>, dbPatch: Record<string, boolean>) => {
    const prev = posts
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    const { error } = await supabase.from('community_posts').update(dbPatch).eq('id', id)
    if (error) {
      setPosts(prev)
      showToast('처리에 실패했습니다', 'error')
      return false
    }
    return true
  }

  const togglePin = async (post: PostRow) => {
    const next = !post.is_pinned
    const ok = await updatePost(post.id, { is_pinned: next }, { is_pinned: next })
    if (ok) showToast(next ? '공지로 고정되었습니다' : '공지 고정이 해제되었습니다', 'success')
  }

  const toggleHidden = async (post: PostRow) => {
    const next = !post.is_hidden
    const ok = await updatePost(post.id, { is_hidden: next }, { is_hidden: next })
    if (ok) showToast(next ? '블라인드 처리되었습니다' : '블라인드가 해제되었습니다', 'success')
  }

  const deleteOne = (id: string) => {
    confirm({
      title: '글 삭제',
      message: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmLabel: '삭제',
      onConfirm: async () => {
        const prev = posts
        setPosts((p) => p.filter((x) => x.id !== id))
        setSelected((s) => {
          const n = new Set(s)
          n.delete(id)
          return n
        })
        await supabase.from('community_comments').delete().eq('post_id', id)
        const { error } = await supabase.from('community_posts').delete().eq('id', id)
        if (error) {
          setPosts(prev)
          showToast('삭제에 실패했습니다', 'error')
        } else {
          setTotal((t) => t - 1)
          showToast('글이 삭제되었습니다', 'success')
        }
      },
    })
  }

  const bulkHidden = async () => {
    const ids = Array.from(selected)
    if (!ids.length) return
    const prev = posts
    setPosts((p) => p.map((x) => (ids.includes(x.id) ? { ...x, is_hidden: true } : x)))
    const { error } = await supabase.from('community_posts').update({ is_hidden: true }).in('id', ids)
    if (error) {
      setPosts(prev)
      showToast('일괄 블라인드에 실패했습니다', 'error')
    } else {
      showToast('선택한 글이 블라인드 처리되었습니다', 'success')
      setSelected(new Set())
    }
  }

  const bulkDelete = () => {
    const ids = Array.from(selected)
    if (!ids.length) return
    confirm({
      title: '일괄 삭제',
      message: `선택한 ${ids.length}개 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      confirmLabel: '삭제',
      onConfirm: async () => {
        const prev = posts
        setPosts((p) => p.filter((x) => !ids.includes(x.id)))
        setSelected(new Set())
        for (const id of ids) {
          await supabase.from('community_comments').delete().eq('post_id', id)
        }
        const { error } = await supabase.from('community_posts').delete().in('id', ids)
        if (error) {
          setPosts(prev)
          showToast('일괄 삭제에 실패했습니다', 'error')
        } else {
          setTotal((t) => t - ids.length)
          showToast('선택한 글이 삭제되었습니다', 'success')
        }
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
    fontWeight: 400,
    width: '100%',
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
      <style dangerouslySetInnerHTML={{ __html: `@keyframes admin-pulse{0%,100%{opacity:1}50%{opacity:.45}}` }} />
      <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>글 관리</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <input
          type="search"
          placeholder="제목 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
          <option value="all">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          style={inputStyle}
        >
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
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button type="button" onClick={bulkHidden} style={{ ...btnStyle, color: WARNING }}>
            선택한 글 블라인드 ({selected.size})
          </button>
          <button type="button" onClick={bulkDelete} style={{ ...btnStyle, background: DANGER, color: BG, border: 'none' }}>
            선택한 글 삭제 ({selected.size})
          </button>
        </div>
      )}

      <div className="admin-posts-table" style={{ overflowX: 'auto', border: BORDER, borderRadius: 8, background: SURFACE }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: META, textAlign: 'left' }}>
              <th style={{ padding: 8, width: 36 }}>
                <input
                  type="checkbox"
                  checked={posts.length > 0 && selected.size === posts.length}
                  onChange={toggleSelectAll}
                />
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
              <SkeletonRows />
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: 24, textAlign: 'center', color: META }}>
                  글이 없습니다
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  style={{ borderTop: BORDER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <td style={{ padding: 8 }}>
                    <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleSelect(post.id)} />
                  </td>
                  <td style={{ padding: 8, color: TEXT, maxWidth: 220 }}>
                    <Link href={`/community/${post.id}`} target="_blank" style={{ color: TEXT, textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: BORDER,
                        color: SUB,
                      }}
                    >
                      {post.category_slug}
                    </span>
                  </td>
                  <td style={{ padding: 8, color: SUB }}>{post.author}</td>
                  <td style={{ padding: 8, color: META }}>{formatDate(post.created_at)}</td>
                  <td style={{ padding: 8, color: META }}>{post.view_count ?? 0}</td>
                  <td style={{ padding: 8, color: META }}>{post.comment_count ?? 0}</td>
                  <td style={{ padding: 8 }}>
                    <PostStatusBadge post={post} />
                  </td>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => togglePin(post)} style={btnStyle} title="공지고정">
                        📌
                      </button>
                      <button type="button" onClick={() => toggleHidden(post)} style={btnStyle} title="블라인드">
                        🚫
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteOne(post.id)}
                        style={{ ...btnStyle, background: DANGER, color: BG, border: 'none' }}
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-posts-cards" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 100,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  animation: 'admin-pulse 1.2s ease-in-out infinite',
                }}
              />
            ))
          : posts.map((post) => (
              <div key={post.id} style={{ border: BORDER, borderRadius: 8, background: SURFACE, padding: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleSelect(post.id)} />
                  <div style={{ flex: 1 }}>
                    <Link href={`/community/${post.id}`} target="_blank" style={{ color: TEXT, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                      {post.title}
                    </Link>
                    <p style={{ fontSize: 11, color: META, margin: '4px 0 0' }}>
                      {post.category_slug} · {formatDate(post.created_at)}
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="button" onClick={() => togglePin(post)} style={btnStyle}>
                        📌
                      </button>
                      <button type="button" onClick={() => toggleHidden(post)} style={btnStyle}>
                        🚫
                      </button>
                      <button type="button" onClick={() => deleteOne(post.id)} style={{ ...btnStyle, background: DANGER, color: BG, border: 'none' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={btnStyle}>
          이전
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
          let num = i + 1
          if (totalPages > 7) {
            if (page <= 4) num = i + 1
            else if (page >= totalPages - 3) num = totalPages - 6 + i
            else num = page - 3 + i
          }
          return (
            <button
              key={num}
              type="button"
              onClick={() => setPage(num)}
              style={{
                ...btnStyle,
                background: page === num ? 'rgba(201,169,110,0.15)' : SURFACE,
                color: page === num ? GOLD : TEXT,
              }}
            >
              {num}
            </button>
          )
        })}
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={btnStyle}>
          다음
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width:768px) {
          .admin-posts-table { display: none !important; }
          .admin-posts-cards { display: flex !important; }
        }
      `}} />
    </div>
  )
}
