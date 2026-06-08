// app/admin/page.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { getKstTodayStartISO } from '@/components/community/utils'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'

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

function getKstYesterdayStartISO() {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET_MS)
  kstNow.setUTCHours(0, 0, 0, 0)
  const todayUtc = new Date(kstNow.getTime() - KST_OFFSET_MS)
  const yesterdayUtc = new Date(todayUtc.getTime() - 24 * 60 * 60 * 1000)
  return yesterdayUtc.toISOString()
}

function getKstYesterdayEndISO() {
  return getKstTodayStartISO()
}

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

type ReportRow = {
  id: string
  reason: string
  status: string
  created_at: string
  post_id: string
  postTitle: string
}

type MemberRow = {
  id: string
  nickname: string
  created_at: string
  post_count: number | null
}

type PostRow = {
  id: string
  title: string
  category_slug: string
  created_at: string
  view_count: number | null
  is_hidden: boolean | null
  is_pinned: boolean | null
  author: string
}

function SkeletonBlock({ h = 80 }: { h?: number }) {
  return (
    <div
      style={{
        height: h,
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.04)',
        animation: 'admin-pulse 1.2s ease-in-out infinite',
      }}
    />
  )
}

function StatCard({
  label,
  value,
  delta,
  loading,
}: {
  label: string
  value: number
  delta: number
  loading: boolean
}) {
  const deltaText = delta === 0 ? '전일과 동일' : delta > 0 ? `+${delta} 전일대비` : `${delta} 전일대비`
  const deltaColor = delta > 0 ? SUCCESS : delta < 0 ? DANGER : SUB
  return (
    <div style={{ padding: '16px', borderRadius: '8px', border: BORDER, background: SURFACE }}>
      {loading ? (
        <SkeletonBlock h={56} />
      ) : (
        <>
          <p style={{ fontSize: '24px', fontWeight: 500, color: GOLD, margin: 0 }}>{value.toLocaleString()}</p>
          <p style={{ fontSize: '12px', fontWeight: 400, color: SUB, margin: '4px 0 0' }}>{label}</p>
          <p style={{ fontSize: '11px', fontWeight: 400, color: deltaColor, margin: '8px 0 0' }}>{deltaText}</p>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pending: { label: '미처리', color: WARNING },
    reviewed: { label: '처리완료', color: SUCCESS },
    dismissed: { label: '무시', color: META },
  }
  const s = map[status] ?? { label: status, color: SUB }
  return (
    <span style={{ fontSize: '11px', fontWeight: 500, color: s.color, padding: '2px 8px', borderRadius: '4px', border: BORDER }}>
      {s.label}
    </span>
  )
}

export default function AdminDashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)
  const [reports, setReports] = useState<ReportRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [posts, setPosts] = useState<PostRow[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    const todayStart = getKstTodayStartISO()
    const yesterdayStart = getKstYesterdayStartISO()
    const yesterdayEnd = getKstYesterdayEndISO()

    try {
      const [
        todayPostsRes,
        yesterdayPostsRes,
        todayCommentsRes,
        yesterdayCommentsRes,
        totalMembersRes,
        yesterdayMembersRes,
        totalPostsRes,
        yesterdayTotalPostsRes,
        reportsRes,
        membersRes,
        postsRes,
      ] = await Promise.all([
        supabase.from('community_posts').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
        supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterdayStart)
          .lt('created_at', yesterdayEnd),
        supabase.from('community_comments').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
        supabase
          .from('community_comments')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterdayStart)
          .lt('created_at', yesterdayEnd),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterdayStart)
          .lt('created_at', yesterdayEnd),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', yesterdayStart)
          .lt('created_at', yesterdayEnd),
        supabase
          .from('reports')
          .select('id, post_id, reason, status, created_at, community_posts(title), profiles(nickname)')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('profiles')
          .select('id, nickname, created_at, post_count')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('community_posts')
          .select('id, title, category_slug, created_at, view_count, is_hidden, is_pinned, profiles(nickname)')
          .order('created_at', { ascending: false })
          .limit(10),
      ])

      setStats({
        todayPosts: todayPostsRes.count ?? 0,
        yesterdayPosts: yesterdayPostsRes.count ?? 0,
        todayComments: todayCommentsRes.count ?? 0,
        yesterdayComments: yesterdayCommentsRes.count ?? 0,
        totalMembers: totalMembersRes.count ?? 0,
        yesterdayMembers: yesterdayMembersRes.count ?? 0,
        totalPosts: totalPostsRes.count ?? 0,
        yesterdayTotalPosts: yesterdayTotalPostsRes.count ?? 0,
      })

      const reportRows: ReportRow[] = (reportsRes.data ?? []).map((r) => {
        const post = Array.isArray(r.community_posts) ? r.community_posts[0] : r.community_posts
        return {
          id: r.id,
          reason: r.reason,
          status: r.status ?? 'pending',
          created_at: r.created_at,
          post_id: r.post_id,
          postTitle: (post as { title?: string } | null)?.title ?? '(삭제된 글)',
        }
      })
      setReports(reportRows)
      setMembers((membersRes.data ?? []) as MemberRow[])
      setPosts(
        (postsRes.data ?? []).map((p) => {
          const prof = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
          return {
            id: p.id,
            title: p.title,
            category_slug: p.category_slug,
            created_at: p.created_at,
            view_count: p.view_count,
            is_hidden: p.is_hidden,
            is_pinned: p.is_pinned,
            author: (prof as { nickname?: string } | null)?.nickname ?? '회원',
          }
        })
      )
    } catch {
      showToast('대시보드 데이터를 불러오지 못했습니다', 'error')
    } finally {
      setLoading(false)
    }
  }, [supabase, showToast])

  useEffect(() => {
    load()
  }, [load])

  const toggleBlind = async (post: PostRow) => {
    const next = !post.is_hidden
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, is_hidden: next } : p)))
    const { error } = await supabase.from('community_posts').update({ is_hidden: next }).eq('id', post.id)
    if (error) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, is_hidden: post.is_hidden } : p)))
      showToast('블라인드 처리에 실패했습니다', 'error')
    } else {
      showToast(next ? '블라인드 처리되었습니다' : '블라인드가 해제되었습니다', 'success')
    }
  }

  const deletePost = (post: PostRow) => {
    confirm({
      title: '글 삭제',
      message: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmLabel: '삭제',
      onConfirm: async () => {
        const prev = posts
        setPosts((p) => p.filter((x) => x.id !== post.id))
        await supabase.from('community_comments').delete().eq('post_id', post.id)
        const { error } = await supabase.from('community_posts').delete().eq('id', post.id)
        if (error) {
          setPosts(prev)
          showToast('삭제에 실패했습니다', 'error')
        } else {
          showToast('글이 삭제되었습니다', 'success')
        }
      },
    })
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .admin-dash-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .admin-dash-mid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px; }
        @media (max-width:768px) { .admin-dash-mid { grid-template-columns:1fr; } }
      `}} />
      <h1 style={{ fontSize: '20px', fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>대시보드</h1>

      <div className="admin-dash-grid">
        <StatCard
          label="오늘 새글"
          value={stats?.todayPosts ?? 0}
          delta={(stats?.todayPosts ?? 0) - (stats?.yesterdayPosts ?? 0)}
          loading={loading}
        />
        <StatCard
          label="오늘 댓글"
          value={stats?.todayComments ?? 0}
          delta={(stats?.todayComments ?? 0) - (stats?.yesterdayComments ?? 0)}
          loading={loading}
        />
        <StatCard
          label="총 회원수"
          value={stats?.totalMembers ?? 0}
          delta={(stats?.yesterdayMembers ?? 0)}
          loading={loading}
        />
        <StatCard
          label="총 게시글"
          value={stats?.totalPosts ?? 0}
          delta={(stats?.yesterdayTotalPosts ?? 0)}
          loading={loading}
        />
      </div>

      <div className="admin-dash-mid">
        <section style={{ border: BORDER, borderRadius: '8px', background: SURFACE, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 500, color: TEXT, margin: 0 }}>최근 신고</h2>
            <Link href="/admin/reports" style={{ fontSize: '12px', color: GOLD, textDecoration: 'none' }}>
              전체보기
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} h={48} />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <p style={{ fontSize: '12px', color: META }}>신고 내역이 없습니다</p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {reports.map((r) => (
                <li
                  key={r.id}
                  style={{
                    padding: '12px 0',
                    borderBottom: BORDER,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <Link
                    href={`/community/${r.post_id}`}
                    target="_blank"
                    style={{ fontSize: '13px', fontWeight: 500, color: TEXT, textDecoration: 'none' }}
                  >
                    {r.postTitle}
                  </Link>
                  <span style={{ fontSize: '11px', color: SUB }}>{r.reason}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: META }}>{formatDate(r.created_at)}</span>
                    <StatusBadge status={r.status} />
                    <Link
                      href="/admin/reports"
                      style={{
                        marginLeft: 'auto',
                        fontSize: '11px',
                        color: GOLD,
                        textDecoration: 'none',
                        padding: '4px 8px',
                        border: BORDER,
                        borderRadius: '4px',
                      }}
                    >
                      처리하기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ border: BORDER, borderRadius: '8px', background: SURFACE, padding: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 500, color: TEXT, margin: '0 0 16px' }}>최근 가입 회원</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} h={48} />
              ))}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {members.map((m) => (
                <li
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: BORDER,
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(201,169,110,0.15)',
                      color: GOLD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {(m.nickname ?? '?')[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: TEXT, margin: 0 }}>{m.nickname}</p>
                    <p style={{ fontSize: '11px', color: META, margin: '2px 0 0' }}>
                      {formatDate(m.created_at)} · 글 {m.post_count ?? 0}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section style={{ marginTop: '24px', border: BORDER, borderRadius: '8px', background: SURFACE, padding: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 500, color: TEXT, margin: '0 0 16px' }}>최근 글</h2>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBlock key={i} h={40} />
            ))}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ color: META, textAlign: 'left' }}>
                  <th style={{ padding: '8px', fontWeight: 500 }}>제목</th>
                  <th style={{ padding: '8px', fontWeight: 500 }}>카테고리</th>
                  <th style={{ padding: '8px', fontWeight: 500 }}>작성자</th>
                  <th style={{ padding: '8px', fontWeight: 500 }}>날짜</th>
                  <th style={{ padding: '8px', fontWeight: 500 }}>조회</th>
                  <th style={{ padding: '8px', fontWeight: 500 }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr
                    key={p.id}
                    style={{ borderTop: BORDER }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <td style={{ padding: '8px', color: TEXT, maxWidth: '200px' }}>
                      <Link href={`/community/${p.id}`} target="_blank" style={{ color: TEXT, textDecoration: 'none' }}>
                        {p.title}
                      </Link>
                    </td>
                    <td style={{ padding: '8px', color: SUB }}>{p.category_slug}</td>
                    <td style={{ padding: '8px', color: SUB }}>{p.author}</td>
                    <td style={{ padding: '8px', color: META }}>{formatDate(p.created_at)}</td>
                    <td style={{ padding: '8px', color: META }}>{p.view_count ?? 0}</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => toggleBlind(p)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            border: BORDER,
                            borderRadius: '4px',
                            background: SURFACE,
                            color: WARNING,
                            cursor: 'pointer',
                            transition: '150ms',
                          }}
                        >
                          {p.is_hidden ? '해제' : '블라인드'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePost(p)}
                          style={{
                            padding: '4px 8px',
                            fontSize: '11px',
                            border: 'none',
                            borderRadius: '4px',
                            background: DANGER,
                            color: BG,
                            cursor: 'pointer',
                            transition: '150ms',
                          }}
                        >
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
    </div>
  )
}
