// components/admin/notices/NoticesManager.tsx

'use client'

import { useCallback, useEffect, useState } from 'react'
import { ADMIN_THEME, NOTICES_SQL } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'
import { SkeletonList } from '@/components/admin/Skeleton'

const T = ADMIN_THEME

type Notice = {
  id: string
  title: string
  content: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
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

export function NoticesManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [notices, setNotices] = useState<Notice[]>([])
  const [tableMissing, setTableMissing] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formActive, setFormActive] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<{ notices: Notice[]; tableMissing?: boolean }>('/api/admin/notices')
      setNotices(data.notices)
      setTableMissing(Boolean(data.tableMissing))
    } catch (e) {
      setTableMissing(true)
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setFormTitle('')
    setFormContent('')
    setFormActive(true)
    setEditingId(null)
    setFormOpen(false)
  }

  const startEdit = (n: Notice) => {
    setEditingId(n.id)
    setFormTitle(n.title)
    setFormContent(n.content ?? '')
    setFormActive(n.is_active)
    setFormOpen(false)
  }

  const saveNew = async () => {
    if (!formTitle.trim()) {
      showToast('제목을 입력하세요', 'warning')
      return
    }
    try {
      const data = await adminFetch<{ notice: Notice }>('/api/admin/notices', {
        method: 'POST',
        body: JSON.stringify({ title: formTitle, content: formContent, is_active: formActive }),
      })
      setNotices((prev) => [...prev, data.notice].sort((a, b) => a.display_order - b.display_order))
      resetForm()
      showToast('공지가 추가되었습니다', 'success')
    } catch (e) {
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const saveEdit = async (id: string) => {
    const prev = notices
    setNotices((n) => n.map((x) => (x.id === id ? { ...x, title: formTitle, content: formContent, is_active: formActive } : x)))
    setEditingId(null)
    try {
      await adminFetch(`/api/admin/notices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: formTitle, content: formContent, is_active: formActive }),
      })
      showToast('공지가 수정되었습니다', 'success')
    } catch (e) {
      setNotices(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const toggleActive = async (n: Notice) => {
    const next = !n.is_active
    const prev = notices
    setNotices((list) => list.map((x) => (x.id === n.id ? { ...x, is_active: next } : x)))
    try {
      await adminFetch(`/api/admin/notices/${n.id}`, { method: 'PATCH', body: JSON.stringify({ is_active: next }) })
      showToast(next ? '공지가 활성화되었습니다' : '공지가 비활성화되었습니다', 'success')
    } catch (e) {
      setNotices(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
    }
  }

  const move = async (id: string, action: 'move_up' | 'move_down') => {
    const idx = notices.findIndex((n) => n.id === id)
    if (idx < 0) return
    const target = action === 'move_up' ? idx - 1 : idx + 1
    if (target < 0 || target >= notices.length) return
    const next = [...notices]
    const tmp = next[idx]
    next[idx] = next[target]
    next[target] = tmp
    setNotices(next)
    try {
      await adminFetch(`/api/admin/notices/${id}`, { method: 'PATCH', body: JSON.stringify({ action }) })
      load()
    } catch (e) {
      load()
      showToast(e instanceof Error ? e.message : '순서 변경 실패', 'error')
    }
  }

  const remove = (n: Notice) => {
    confirm({
      title: '공지 삭제',
      message: '이 공지를 삭제하시겠습니까?',
      confirmText: '삭제',
      onConfirm: async () => {
        const prev = notices
        setNotices((list) => list.filter((x) => x.id !== n.id))
        try {
          await adminFetch(`/api/admin/notices/${n.id}`, { method: 'DELETE' })
          showToast('공지가 삭제되었습니다', 'success')
        } catch (e) {
          setNotices(prev)
          showToast(e instanceof Error ? e.message : '실패', 'error')
        }
      },
    })
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: 0 }}>공지 관리</h1>
        <button type="button" onClick={() => { resetForm(); setFormOpen((v) => !v) }} style={{ ...btnStyle, color: T.gold, background: 'rgba(201,169,110,0.1)' }}>
          공지 추가
        </button>
      </div>

      {tableMissing && (
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, border: T.border, background: T.surface }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: T.warning, margin: '0 0 8px' }}>이 SQL을 Supabase SQL Editor에서 먼저 실행하세요</p>
          <pre style={{ fontSize: 11, color: T.sub, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{NOTICES_SQL}</pre>
        </div>
      )}

      {formOpen && (
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, border: T.border, background: T.surface }}>
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value.slice(0, 200))} placeholder="제목 (최대 200자)" style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 13, marginBottom: 8 }} />
          <textarea value={formContent} onChange={(e) => setFormContent(e.target.value.slice(0, 1000))} placeholder="내용 (최대 1000자)" rows={4} style={{ width: '100%', padding: 12, borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 13, marginBottom: 8, resize: 'vertical' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.sub, marginBottom: 12 }}>
            <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
            활성 공지로 등록
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={saveNew} style={{ ...btnStyle, color: T.gold }}>저장</button>
            <button type="button" onClick={resetForm} style={btnStyle}>취소</button>
          </div>
        </div>
      )}

      {loading ? (
        <SkeletonList count={3} />
      ) : notices.length === 0 ? (
        <p style={{ fontSize: 13, color: T.meta }}>등록된 공지가 없습니다</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {notices.map((n, i) => (
            <li key={n.id} style={{ border: T.border, borderRadius: 8, background: T.surface, padding: 16, marginBottom: 8 }}>
              {editingId === n.id ? (
                <div>
                  <input value={formTitle} onChange={(e) => setFormTitle(e.target.value.slice(0, 200))} style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: T.border, background: T.bg, color: T.text, fontSize: 13, marginBottom: 8 }} />
                  <textarea value={formContent} onChange={(e) => setFormContent(e.target.value.slice(0, 1000))} rows={3} style={{ width: '100%', padding: 12, borderRadius: 8, border: T.border, background: T.bg, color: T.text, fontSize: 13, marginBottom: 8 }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.sub, marginBottom: 8 }}>
                    <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
                    활성
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => saveEdit(n.id)} style={{ ...btnStyle, color: T.gold }}>저장</button>
                    <button type="button" onClick={() => setEditingId(null)} style={btnStyle}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: '0 0 4px' }}>{n.title}</p>
                      <p style={{ fontSize: 12, color: T.sub, margin: '0 0 8px', lineHeight: 1.5 }}>{(n.content ?? '').slice(0, 80)}{(n.content && n.content.length > 80) ? '…' : ''}</p>
                      <p style={{ fontSize: 11, color: T.meta, margin: 0 }}>
                        순서 {i + 1} · {formatDate(n.created_at)} · {n.is_active ? <span style={{ color: T.success }}>활성</span> : <span style={{ color: T.meta }}>비활성</span>}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <button type="button" disabled={i === 0} onClick={() => move(n.id, 'move_up')} style={btnStyle}>↑</button>
                      <button type="button" disabled={i === notices.length - 1} onClick={() => move(n.id, 'move_down')} style={btnStyle}>↓</button>
                      <button type="button" onClick={() => toggleActive(n)} style={btnStyle}>{n.is_active ? '비활성' : '활성'}</button>
                      <button type="button" onClick={() => startEdit(n)} style={btnStyle}>수정</button>
                      <button type="button" onClick={() => remove(n)} style={{ ...btnStyle, color: T.danger }}>삭제</button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
