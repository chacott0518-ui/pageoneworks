// app/api/admin/reports/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const supabase = createServerSupabaseClient()

  if (body.action === 'delete_post') {
    const { data: report } = await supabase
      .from('reports')
      .select('id, post_id')
      .eq('id', params.id)
      .maybeSingle()
    if (!report) return NextResponse.json({ error: '신고를 찾을 수 없습니다' }, { status: 404 })

    await supabase.from('community_comments').delete().eq('post_id', report.post_id)
    const { error: delErr } = await supabase.from('community_posts').delete().eq('id', report.post_id)
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 })

    await supabase.from('reports').update({ status: 'reviewed' }).eq('id', params.id)
    return NextResponse.json({ ok: true })
  }

  if (body.status === 'reviewed' || body.status === 'dismissed') {
    const { error } = await supabase.from('reports').update({ status: body.status }).eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 })
}
