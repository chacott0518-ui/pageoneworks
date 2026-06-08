// app/api/admin/ads/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

const SLOT_NAMES = ['pc_sidebar', 'mobile_inline'] as const

export async function GET() {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('ad_banners')
    .select('id, slot_name, image_url, link_url, is_active, created_at')
    .in('slot_name', [...SLOT_NAMES])

  if (error) {
    const defaults = SLOT_NAMES.map((slot_name) => ({
      id: slot_name,
      slot_name,
      image_url: '',
      link_url: '',
      is_active: false,
      created_at: null,
    }))
    return NextResponse.json({ slots: defaults, tableMissing: true })
  }

  const map = new Map((data ?? []).map((d) => [d.slot_name, d]))
  const slots = SLOT_NAMES.map(
    (slot_name) =>
      map.get(slot_name) ?? {
        id: slot_name,
        slot_name,
        image_url: '',
        link_url: '',
        is_active: false,
        created_at: null,
      }
  )

  return NextResponse.json({ slots, tableMissing: false })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const { slot_name, image_url, link_url, is_active } = body as {
    slot_name: string
    image_url: string
    link_url: string
    is_active: boolean
  }

  if (!SLOT_NAMES.includes(slot_name as (typeof SLOT_NAMES)[number])) {
    return NextResponse.json({ error: '잘못된 슬롯입니다' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const payload = {
    slot_name,
    image_url: image_url ?? '',
    link_url: link_url ?? '',
    is_active: Boolean(is_active),
  }

  const { data: existing } = await supabase
    .from('ad_banners')
    .select('id')
    .eq('slot_name', slot_name)
    .maybeSingle()

  let error
  if (existing?.id) {
    const res = await supabase.from('ad_banners').update(payload).eq('id', existing.id)
    error = res.error
  } else {
    const res = await supabase.from('ad_banners').insert(payload)
    error = res.error
  }

  if (error) return NextResponse.json({ error: error.message, tableMissing: true }, { status: 500 })
  return NextResponse.json({ ok: true })
}
