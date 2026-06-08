// app/admin/reports/page.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'

const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const DANGER = 'rgba(255,70,70,0.9)'
const WARNING = 'rgba(255,180,0,0.9)'
const SUCCESS = 'rgba(70,200,100,0.9)'
const BG = '#0a0a0c'

type TabKey = 'pending' | 'reviewed' | 'dismissed'

type ReportRow = {
  id: string
  post_id: string
  reason: string
  status: string
  created_at: string
  postTitle: string
  reporter: string
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: '미처리' },
  { key: 'reviewed', label: '처리완료' },
  { key: 'dismissed', label: '무시' },
]

export default function AdminReportsPage() {
  const supabase = useMemo(() => createClient(), [])
  const { showToast } = useToast()
  const { confirm } = useConfirm()

  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>('pending')
  const [reports, setReports] = useState<ReportRow[]>([])
  const [counts, setCounts] = useState<Record<TabKey, number>>({ pending: 0, reviewed: 0, dismissed: 0 })

  const loadCounts = useCallback(async () => {
    const pendingQuery = supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .or('status.eq.pending,status.is.null')
    const reviewedQuery = supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'reviewed')
    const dismissedQuery = supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'dismissed')
    const results = await Promise.all([
      pendingQuery.then(({ count }) => ({ key: 'pending' as TabKey, count: count ?? 0 })),
      reviewedQuery.then(({ count }) => ({ key: 'reviewed' as TabKey, count: count ?? 0 })),
      dismissedQuery.then(({ count }) => ({ key: 'dismissed' as TabKey, count: count ?? 0 })),
    ])
    const next = { pending: 0, reviewed: 0, dismissed: 0 }
    results.forEach((r) => {
      next[r.key] = r.count
    })
    setCounts(next)
  }, [supabase])

  const load = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('reports')
      .select('id, post_id, reason, status, created_at, community_posts(title), profiles(nickname)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (tab === 'pending') {
      query = query.or('status.eq.pending,status.is.null')
    } else {
      query = query.eq('status', tab)
    }

    const { data, error } = await query

    if (error) {
      showToast('신고 목록을 불러오지 못했습니다', 'error')
      setLoading(false)
      return
    }

    setReports(
      (data ?? []).map((r) => {
        const post = Array.isArray(r.community_posts) ? r.community_posts[0] : r.community_posts
        const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
        return {
          id: r.id,
          post_id: r.post_id,
          reason: r.reason,
          status: r.status ?? 'pending',
          created_at: r.created_at,
          postTitle: (post as { title?: string } | null)?.title ?? '(삭제된 글)',
          reporter: (prof as { nickname?: string } | null)?.nickname ?? '회원',
        }
      })
    )
    setLoading(false)
    loadCounts()
  }, [supabase, tab, showToast, loadCounts])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = async (report: ReportRow, status: TabKey) => {
    const prev = reports
    setReports((r) => r.filter((x) => x.id !== report.id))
    setCounts((c) => ({
      ...c,
      [tab]: Math.max(0, c[tab] - 1),
      [status]: c[status] + 1,
    }))
    const { error } = await supabase.from('reports').update({ status }).eq('id', report.id)
    if (error) {
      setReports(prev)
      loadCounts()
      showToast('처리에 실패했습니다', 'error')
    } else {
      const msg = status === 'reviewed' ? '처리완료로 변경되었습니다' : '무시 처리되었습니다'
      showToast(msg, 'success')
    }
  }

  const deletePost = (report: ReportRow) => {
    confirm({
      title: '글 삭제',
      message: '신고된 글을 즉시 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      confirmLabel: '삭제',
      onConfirm: async () => {
        const prev = reports
        setReports((r) => r.filter((x) => x.id !== report.id))
        await supabase.from('community_comments').delete().eq('post_id', report.post_id)
        const { error: delErr } = await supabase.from('community_posts').delete().eq('id', report.post_id)
        if (delErr) {
          setReports(prev)
          showToast('글 삭제에 실패했습니다', 'error')
          return
        }
        await supabase.from('reports').update({ status: 'reviewed' }).eq('id', report.id)
        loadCounts()
        showToast('글이 삭제되었습니다', 'success')
      },
    })
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

  const formatDate = (iso: string) => new Date(iso).toLocaleString('ko-KR')

  const statusColor = (s: string) => {
    if (s === 'pending') return WARNING
    if (s === 'reviewed') return SUCCESS
    return META
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>신고 관리</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              ...btnStyle,
              background: tab === t.key ? 'rgba(201,169,110,0.15)' : SURFACE,
              color: tab === t.key ? GOLD : TEXT,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {t.label}
            <span
              style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                color: SUB,
              }}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto', border: BORDER, borderRadius: 8, background: SURFACE }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: META, textAlign: 'left' }}>
              <th style={{ padding: 8, fontWeight: 500 }}>신고된 글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>신고자</th>
              <th style={{ padding: 8, fontWeight: 500 }}>사유</th>
              <th style={{ padding: 8, fontWeight: 500 }}>일시</th>
              <th style={{ padding: 8, fontWeight: 500 }}>상태</th>
              <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} style={{ padding: 8 }}>
                    <div style={{ height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
                  </td>
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: META }}>
                  신고 내역이 없습니다
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderTop: BORDER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <td style={{ padding: 8, maxWidth: 200 }}>
                    <Link href={`/community/${r.post_id}`} target="_blank" style={{ color: TEXT, textDecoration: 'none', fontWeight: 500 }}>
                      {r.postTitle}
                    </Link>
                  </td>
                  <td style={{ padding: 8, color: SUB }}>{r.reporter}</td>
                  <td style={{ padding: 8, color: SUB }}>{r.reason}</td>
                  <td style={{ padding: 8, color: META }}>{formatDate(r.created_at)}</td>
                  <td style={{ padding: 8 }}>
                    <span style={{ fontSize: 11, color: statusColor(r.status) }}>{r.status}</span>
                  </td>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {tab === 'pending' && (
                        <>
                          <button type="button" onClick={() => updateStatus(r, 'reviewed')} style={{ ...btnStyle, color: SUCCESS }}>
                            ✅ 처리
                          </button>
                          <button type="button" onClick={() => updateStatus(r, 'dismissed')} style={{ ...btnStyle, color: META }}>
                            ❌ 무시
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => deletePost(r)}
                        style={{ ...btnStyle, background: DANGER, color: BG, border: 'none' }}
                      >
                        🗑️ 글삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
