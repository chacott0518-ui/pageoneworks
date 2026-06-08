// app/api/admin/notices/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const supabase = createServerSupabaseClient()

  if (body.action === 'move_up' || body.action === 'move_down') {
    const { data: all } = await supabase
      .from('community_notices')
      .select('id, display_order')
      .order('display_order', { ascending: true })

    if (!all?.length) return NextResponse.json({ error: '공지가 없습니다' }, { status: 404 })

    const idx = all.findIndex((n) => n.id === params.id)
    if (idx < 0) return NextResponse.json({ error: '공지를 찾을 수 없습니다' }, { status: 404 })

    const swapIdx = body.action === 'move_up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= all.length) return NextResponse.json({ ok: true })

    const a = all[idx]
    const b = all[swapIdx]
    await supabase.from('community_notices').update({ display_order: b.display_order }).eq('id', a.id)
    await supabase.from('community_notices').update({ display_order: a.display_order }).eq('id', b.id)
    return NextResponse.json({ ok: true })
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.title === 'string') patch.title = body.title.trim().slice(0, 200)
  if (typeof body.content === 'string') patch.content = body.content.trim().slice(0, 1000)
  if (typeof body.is_active === 'boolean') patch.is_active = body.is_active

  const { data, error } = await supabase
    .from('community_notices')
    .update(patch)
    .eq('id', params.id)
    .select('id, title, content, is_active, display_order, created_at, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ notice: data })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('community_notices').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
