// components/admin/dashboard/DashboardView.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ADMIN_THEME } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'
import { SkeletonList, SkeletonStatGrid } from '@/components/admin/Skeleton'
import { StatCard } from './StatCard'
import { StatusBadge } from './StatusBadge'

const T = ADMIN_THEME

type Stats = {
  todayPosts: number
  yesterdayPosts: number
  todayComments: number
  yesterdayComments: number
  totalMembers: number
  yesterdayMembers: number
  totalPosts: number
  yesterdayTotalPosts: number
}

type ReportRow = { id: string; reason: string; status: string; created_at: string; post_id: string; postTitle: string }
type MemberRow = { id: string; nickname: string; created_at: string; post_count: number | null }
type PostRow = {
  id: string
  title: string
  category_slug: string
  created_at: string
  view_count: number | null
  is_hidden: boolean | null
  author: string
}

export function DashboardView() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [reports, setReports] = useState<ReportRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [posts, setPosts] = useState<PostRow[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<{
        stats: Stats
        reports: ReportRow[]
        members: MemberRow[]
        posts: PostRow[]
      }>('/api/admin/dashboard')
      setStats(data.stats)
      setReports(data.reports)
      setMembers(data.members)
      setPosts(data.posts)
    } catch (e) {
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  const toggleBlind = async (post: PostRow) => {
    const next = !post.is_hidden
    const prev = posts
    setPosts((p) => p.map((x) => (x.id === post.id ? { ...x, is_hidden: next } : x)))
    try {
      await adminFetch(`/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_hidden: next }),
      })
      showToast(next ? '블라인드 처리되었습니다' : '블라인드가 해제되었습니다', 'success')
    } catch (e) {
      setPosts(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const deletePost = (post: PostRow) => {
    confirm({
      title: '글 삭제',
      message: '삭제하면 복구할 수 없습니다. 계속하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        const prev = posts
        setPosts((p) => p.filter((x) => x.id !== post.id))
        try {
          await adminFetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' })
          showToast('글이 삭제되었습니다', 'success')
        } catch (e) {
          setPosts(prev)
          showToast(e instanceof Error ? e.message : '실패', 'error')
        }
      },
    })
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: '0 0 24px' }}>대시보드</h1>

      {loading ? (
        <SkeletonStatGrid />
      ) : (
        <div className="admin-dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          <StatCard label="오늘 새글" value={stats?.todayPosts ?? 0} delta={(stats?.todayPosts ?? 0) - (stats?.yesterdayPosts ?? 0)} />
          <StatCard label="오늘 댓글" value={stats?.todayComments ?? 0} delta={(stats?.todayComments ?? 0) - (stats?.yesterdayComments ?? 0)} />
          <StatCard label="총 회원수" value={stats?.totalMembers ?? 0} delta={stats?.yesterdayMembers ?? 0} />
          <StatCard label="총 게시글" value={stats?.totalPosts ?? 0} delta={stats?.yesterdayTotalPosts ?? 0} />
        </div>
      )}

      <div className="admin-dash-mid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <section style={{ border: T.border, borderRadius: 8, background: T.surface, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: 0 }}>최근 신고</h2>
            <Link href="/admin/reports" style={{ fontSize: 12, color: T.gold, textDecoration: 'none' }}>전체보기</Link>
          </div>
          {loading ? (
            <SkeletonList count={3} />
          ) : reports.length === 0 ? (
            <p style={{ fontSize: 12, color: T.meta }}>신고 내역이 없습니다</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {reports.map((r) => (
                <li key={r.id} style={{ padding: '12px 0', borderBottom: T.border }}>
                  <Link href={`/community/${r.post_id}`} target="_blank" style={{ fontSize: 13, fontWeight: 500, color: T.text, textDecoration: 'none' }}>
                    {r.postTitle}
                  </Link>
                  <p style={{ fontSize: 11, color: T.sub, margin: '4px 0' }}>{r.reason}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: T.meta }}>{formatDate(r.created_at)}</span>
                    <StatusBadge status={r.status} />
                    <Link href="/admin/reports" style={{ marginLeft: 'auto', fontSize: 11, color: T.gold, textDecoration: 'none', padding: '4px 8px', border: T.border, borderRadius: 4 }}>
                      처리하기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: T.border, borderRadius: 8, background: T.surface, padding: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: '0 0 16px' }}>최근 가입 회원</h2>
          {loading ? (
            <SkeletonList count={3} />
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {members.map((m) => (
                <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: T.border }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,169,110,0.15)', color: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500 }}>
                    {(m.nickname ?? '?')[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: T.text, margin: 0 }}>{m.nickname}</p>
                    <p style={{ fontSize: 11, color: T.meta, margin: '2px 0 0' }}>{formatDate(m.created_at)} · 글 {m.post_count ?? 0}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section style={{ marginTop: 24, border: T.border, borderRadius: 8, background: T.surface, padding: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: '0 0 16px' }}>최근 글</h2>
        {loading ? (
          <SkeletonList count={4} itemHeight={40} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ color: T.meta, textAlign: 'left' }}>
                  <th style={{ padding: 8, fontWeight: 500 }}>제목</th>
                  <th style={{ padding: 8, fontWeight: 500 }}>카테고리</th>
                  <th style={{ padding: 8, fontWeight: 500 }}>작성자</th>
                  <th style={{ padding: 8, fontWeight: 500 }}>날짜</th>
                  <th style={{ padding: 8, fontWeight: 500 }}>조회</th>
                  <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} style={{ borderTop: T.border }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                    <td style={{ padding: 8, color: T.text }}>
                      <Link href={`/community/${p.id}`} target="_blank" style={{ color: T.text, textDecoration: 'none' }}>{p.title}</Link>
                    </td>
                    <td style={{ padding: 8, color: T.sub }}>{p.category_slug}</td>
                    <td style={{ padding: 8, color: T.sub }}>{p.author}</td>
                    <td style={{ padding: 8, color: T.meta }}>{formatDate(p.created_at)}</td>
                    <td style={{ padding: 8, color: T.meta }}>{p.view_count ?? 0}</td>
                    <td style={{ padding: 8 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" onClick={() => toggleBlind(p)} style={{ padding: '4px 8px', fontSize: 11, border: T.border, borderRadius: 4, background: T.surface, color: T.warning, cursor: 'pointer' }}>
                          {p.is_hidden ? '해제' : '블라인드'}
                        </button>
                        <button type="button" onClick={() => deletePost(p)} style={{ padding: '4px 8px', fontSize: 11, border: 'none', borderRadius: 4, background: T.danger, color: T.bg, cursor: 'pointer' }}>
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `@media (max-width:768px){.admin-dash-mid{grid-template-columns:1fr!important}}` }} />
    </div>
  )
}
