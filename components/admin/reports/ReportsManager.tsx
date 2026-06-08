// components/admin/reports/ReportsManager.tsx

'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ADMIN_THEME } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'
import { SkeletonTable } from '@/components/admin/Skeleton'

const T = ADMIN_THEME
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

export function ReportsManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>('pending')
  const [reports, setReports] = useState<ReportRow[]>([])
  const [counts, setCounts] = useState<Record<TabKey, number>>({ pending: 0, reviewed: 0, dismissed: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<{ reports: ReportRow[]; counts: Record<TabKey, number> }>(`/api/admin/reports?tab=${tab}`)
      setReports(data.reports)
      setCounts(data.counts)
    } catch (e) {
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [tab, showToast])

  useEffect(() => { load() }, [load])

  const updateStatus = async (report: ReportRow, status: TabKey) => {
    const prev = reports
    setReports((r) => r.filter((x) => x.id !== report.id))
    setCounts((c) => ({ ...c, [tab]: Math.max(0, c[tab] - 1), [status]: c[status] + 1 }))
    try {
      await adminFetch(`/api/admin/reports/${report.id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      showToast(status === 'reviewed' ? '처리완료로 변경되었습니다' : '무시 처리되었습니다', 'success')
    } catch (e) {
      setReports(prev)
      load()
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const deletePost = (report: ReportRow) => {
    confirm({
      title: '글 삭제',
      message: '신고된 글을 즉시 삭제하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        const prev = reports
        setReports((r) => r.filter((x) => x.id !== report.id))
        try {
          await adminFetch(`/api/admin/reports/${report.id}`, { method: 'PATCH', body: JSON.stringify({ action: 'delete_post' }) })
          showToast('글이 삭제되었습니다', 'success')
          load()
        } catch (e) {
          setReports(prev)
          showToast(e instanceof Error ? e.message : '실패', 'error')
        }
      },
    })
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleString('ko-KR')
  const statusColor = (s: string) => (s === 'pending' ? T.warning : s === 'reviewed' ? T.success : T.meta)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: '0 0 24px' }}>신고 관리</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} style={{ ...btnStyle, background: tab === t.key ? 'rgba(201,169,110,0.15)' : T.surface, color: tab === t.key ? T.gold : T.text, display: 'flex', alignItems: 'center', gap: 8 }}>
            {t.label}
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: T.sub }}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto', border: T.border, borderRadius: 8, background: T.surface }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.meta, textAlign: 'left' }}>
              <th style={{ padding: 8, fontWeight: 500 }}>신고된 글</th>
              <th style={{ padding: 8, fontWeight: 500 }}>신고자</th>
              <th style={{ padding: 8, fontWeight: 500 }}>사유</th>
              <th style={{ padding: 8, fontWeight: 500 }}>일시</th>
              <th style={{ padding: 8, fontWeight: 500 }}>상태</th>
              <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <SkeletonTable rows={5} cols={6} /> : reports.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: T.meta }}>신고 내역이 없습니다</td></tr>
            ) : reports.map((r) => (
              <tr key={r.id} style={{ borderTop: T.border }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
                <td style={{ padding: 8 }}><Link href={`/community/${r.post_id}`} target="_blank" style={{ color: T.text, textDecoration: 'none', fontWeight: 500 }}>{r.postTitle}</Link></td>
                <td style={{ padding: 8, color: T.sub }}>{r.reporter}</td>
                <td style={{ padding: 8, color: T.sub }}>{r.reason}</td>
                <td style={{ padding: 8, color: T.meta }}>{formatDate(r.created_at)}</td>
                <td style={{ padding: 8 }}><span style={{ fontSize: 11, color: statusColor(r.status) }}>{r.status}</span></td>
                <td style={{ padding: 8 }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {tab === 'pending' && (
                      <>
                        <button type="button" onClick={() => updateStatus(r, 'reviewed')} style={{ ...btnStyle, color: T.success }}>✅ 처리</button>
                        <button type="button" onClick={() => updateStatus(r, 'dismissed')} style={{ ...btnStyle, color: T.meta }}>❌ 무시</button>
                      </>
                    )}
                    <button type="button" onClick={() => deletePost(r)} style={{ ...btnStyle, background: T.danger, color: T.bg, border: 'none' }}>🗑️ 글삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
