// components/admin/ads/AdsManager.tsx

'use client'

import { useCallback, useEffect, useState } from 'react'
import { ADMIN_THEME, NOTICES_SQL } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useToast } from '@/components/admin/Toast'
import { SkeletonList } from '@/components/admin/Skeleton'

const T = ADMIN_THEME

type AdSlot = {
  id: string
  slot_name: string
  image_url: string
  link_url: string
  is_active: boolean
}

const SLOT_LABELS: Record<string, string> = {
  pc_sidebar: 'PC 우측 사이드바 160×300',
  mobile_inline: '모바일 인라인 320×100',
}

const btnStyle: React.CSSProperties = {
  minHeight: 44,
  padding: '0 16px',
  borderRadius: 8,
  border: T.border,
  background: T.surface,
  color: T.text,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  transition: '150ms',
}

export function AdsManager() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [slots, setSlots] = useState<AdSlot[]>([])
  const [tableMissing, setTableMissing] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<{ slots: AdSlot[]; tableMissing?: boolean }>('/api/admin/ads')
      setSlots(data.slots)
      setTableMissing(Boolean(data.tableMissing))
    } catch (e) {
      setTableMissing(true)
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  const updateSlot = (slotName: string, patch: Partial<AdSlot>) => {
    setSlots((s) => s.map((x) => (x.slot_name === slotName ? { ...x, ...patch } : x)))
  }

  const saveSlot = async (slot: AdSlot) => {
    setSaving(slot.slot_name)
    try {
      await adminFetch('/api/admin/ads', {
        method: 'PUT',
        body: JSON.stringify({
          slot_name: slot.slot_name,
          image_url: slot.image_url,
          link_url: slot.link_url,
          is_active: slot.is_active,
        }),
      })
      showToast('저장되었습니다', 'success')
    } catch (e) {
      showToast(e instanceof Error ? e.message : '저장 실패', 'error')
      load()
    } finally {
      setSaving(null)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: '0 0 8px' }}>광고 관리</h1>
      <p style={{ fontSize: 12, color: T.sub, margin: '0 0 24px' }}>광고 슬롯을 관리합니다.</p>

      {tableMissing && (
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, border: T.border, background: T.surface }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: T.warning, margin: '0 0 8px' }}>이 SQL을 Supabase SQL Editor에서 먼저 실행하세요</p>
          <pre style={{ fontSize: 11, color: T.sub, whiteSpace: 'pre-wrap', margin: 0 }}>{NOTICES_SQL}</pre>
        </div>
      )}

      {loading ? (
        <SkeletonList count={2} itemHeight={160} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {slots.map((slot) => (
            <div key={slot.slot_name} style={{ border: T.border, borderRadius: 8, background: T.surface, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: 0 }}>{SLOT_LABELS[slot.slot_name] ?? slot.slot_name}</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.sub, cursor: 'pointer' }}>
                  <input type="checkbox" checked={slot.is_active} onChange={(e) => updateSlot(slot.slot_name, { is_active: e.target.checked })} />
                  <span style={{ color: slot.is_active ? T.success : T.meta }}>{slot.is_active ? '활성' : '비활성'}</span>
                </label>
              </div>
              <label style={{ fontSize: 11, color: T.meta, display: 'block', marginBottom: 4 }}>이미지 URL</label>
              <input type="url" value={slot.image_url} onChange={(e) => updateSlot(slot.slot_name, { image_url: e.target.value })} placeholder="https://..." style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 13, marginBottom: 8 }} />
              <label style={{ fontSize: 11, color: T.meta, display: 'block', marginBottom: 4 }}>링크 URL</label>
              <input type="url" value={slot.link_url} onChange={(e) => updateSlot(slot.slot_name, { link_url: e.target.value })} placeholder="https://..." style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 13, marginBottom: 8 }} />
              {slot.image_url && (
                <img src={slot.image_url} alt="" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: T.border, objectFit: 'contain', marginBottom: 16 }} />
              )}
              <button type="button" onClick={() => saveSlot(slot)} disabled={saving === slot.slot_name} style={{ ...btnStyle, background: 'rgba(201,169,110,0.15)', color: T.gold, opacity: saving === slot.slot_name ? 0.6 : 1 }}>
                {saving === slot.slot_name ? '저장 중...' : '저장'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
