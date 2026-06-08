// app/api/admin/posts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const patch: Record<string, boolean> = {}
  if (typeof body.is_hidden === 'boolean') patch.is_hidden = body.is_hidden
  if (typeof body.is_pinned === 'boolean') patch.is_pinned = body.is_pinned
  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: '변경할 필드가 없습니다' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('community_posts').update(patch).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const supabase = createServerSupabaseClient()
  await supabase.from('community_comments').delete().eq('post_id', params.id)
  const { error } = await supabase.from('community_posts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
