// app/admin/ads/page.tsx

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/admin/Toast'

const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const SUCCESS = 'rgba(70,200,100,0.9)'

type AdSlot = {
  id: string
  slot_name: string
  image_url: string
  link_url: string
  is_active: boolean
}

const SLOT_DEFS = [
  { slot_name: 'pc_sidebar_1', label: 'PC 우측 사이드바 160×300 #1' },
  { slot_name: 'pc_sidebar_2', label: 'PC 우측 사이드바 160×300 #2' },
  { slot_name: 'pc_sidebar_3', label: 'PC 우측 사이드바 160×300 #3' },
  { slot_name: 'mobile_inline_1', label: '모바일 인라인 320×100 #1' },
  { slot_name: 'mobile_inline_2', label: '모바일 인라인 320×100 #2' },
  { slot_name: 'mobile_inline_3', label: '모바일 인라인 320×100 #3' },
]

export default function AdminAdsPage() {
  const supabase = useMemo(() => createClient(), [])
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [slots, setSlots] = useState<AdSlot[]>([])
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ad_banners')
      .select('id, slot_name, image_url, link_url, is_active')
      .order('slot_name', { ascending: true })

    if (error) {
      const defaults: AdSlot[] = SLOT_DEFS.map((s) => ({
        id: s.slot_name,
        slot_name: s.slot_name,
        image_url: '',
        link_url: '',
        is_active: false,
      }))
      setSlots(defaults)
      setLoading(false)
      return
    }

    const map = new Map((data ?? []).map((d) => [d.slot_name, d as AdSlot]))
    const merged = SLOT_DEFS.map((s) => {
      const existing = map.get(s.slot_name)
      return (
        existing ?? {
          id: s.slot_name,
          slot_name: s.slot_name,
          image_url: '',
          link_url: '',
          is_active: false,
        }
      )
    })
    setSlots(merged)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    load()
  }, [load])

  const updateSlot = (slotName: string, patch: Partial<AdSlot>) => {
    setSlots((s) => s.map((x) => (x.slot_name === slotName ? { ...x, ...patch } : x)))
  }

  const saveSlot = async (slot: AdSlot) => {
    setSaving(slot.slot_name)
    const payload = {
      slot_name: slot.slot_name,
      image_url: slot.image_url,
      link_url: slot.link_url,
      is_active: slot.is_active,
    }

    const { data: existing } = await supabase
      .from('ad_banners')
      .select('id')
      .eq('slot_name', slot.slot_name)
      .maybeSingle()

    let error
    if (existing?.id) {
      const res = await supabase.from('ad_banners').update(payload).eq('id', existing.id)
      error = res.error
    } else {
      const res = await supabase.from('ad_banners').insert(payload)
      error = res.error
    }

    setSaving(null)
    if (error) {
      showToast('저장에 실패했습니다', 'error')
      load()
    } else {
      showToast('저장되었습니다', 'success')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 40,
    padding: '0 12px',
    borderRadius: 8,
    border: BORDER,
    background: SURFACE,
    color: TEXT,
    fontSize: 13,
    marginBottom: 8,
  }

  const btnStyle: React.CSSProperties = {
    minHeight: 44,
    padding: '0 16px',
    borderRadius: 8,
    border: BORDER,
    background: SURFACE,
    color: TEXT,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: '150ms',
  }

  const labelFor = (slotName: string) => SLOT_DEFS.find((s) => s.slot_name === slotName)?.label ?? slotName

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>광고 관리</h1>
      <p style={{ fontSize: 12, color: SUB, margin: '0 0 24px' }}>광고 슬롯 6개를 관리합니다.</p>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 160, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {slots.map((slot) => (
            <div key={slot.slot_name} style={{ border: BORDER, borderRadius: 8, background: SURFACE, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 500, color: TEXT, margin: 0 }}>{labelFor(slot.slot_name)}</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: SUB, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={slot.is_active}
                    onChange={(e) => updateSlot(slot.slot_name, { is_active: e.target.checked })}
                  />
                  <span style={{ color: slot.is_active ? SUCCESS : META }}>{slot.is_active ? '활성' : '비활성'}</span>
                </label>
              </div>
              <label style={{ fontSize: 11, color: META, display: 'block', marginBottom: 4 }}>이미지 URL</label>
              <input
                type="url"
                value={slot.image_url}
                onChange={(e) => updateSlot(slot.slot_name, { image_url: e.target.value })}
                placeholder="https://..."
                style={inputStyle}
              />
              <label style={{ fontSize: 11, color: META, display: 'block', marginBottom: 4 }}>링크 URL</label>
              <input
                type="url"
                value={slot.link_url}
                onChange={(e) => updateSlot(slot.slot_name, { link_url: e.target.value })}
                placeholder="https://..."
                style={inputStyle}
              />
              {slot.image_url && (
                <div style={{ marginBottom: 16 }}>
                  <img
                    src={slot.image_url}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      maxHeight: 120,
                      borderRadius: 8,
                      border: BORDER,
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => saveSlot(slot)}
                disabled={saving === slot.slot_name}
                style={{
                  ...btnStyle,
                  background: 'rgba(201,169,110,0.15)',
                  color: GOLD,
                  opacity: saving === slot.slot_name ? 0.6 : 1,
                }}
              >
                {saving === slot.slot_name ? '저장 중...' : '저장'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
