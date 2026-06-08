// app/api/admin/comments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  if (typeof body.is_hidden !== 'boolean') {
    return NextResponse.json({ error: 'is_hidden이 필요합니다' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('community_comments')
    .update({ is_hidden: body.is_hidden })
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const supabase = createServerSupabaseClient()
  const { data: comment } = await supabase
    .from('community_comments')
    .select('id, post_id')
    .eq('id', params.id)
    .maybeSingle()

  if (!comment) return NextResponse.json({ error: '댓글을 찾을 수 없습니다' }, { status: 404 })

  const { error } = await supabase.from('community_comments').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: post } = await supabase
    .from('community_posts')
    .select('id, comment_count')
    .eq('id', comment.post_id)
    .maybeSingle()

  if (post) {
    const nextCount = Math.max(0, (post.comment_count ?? 1) - 1)
    await supabase.from('community_posts').update({ comment_count: nextCount }).eq('id', comment.post_id)
  }

  return NextResponse.json({ ok: true })
}
