// app/api/admin/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'
import { PAGE_SIZE } from '@/lib/admin/constants'

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const sp = req.nextUrl.searchParams
  const page = Math.max(1, Number(sp.get('page') ?? '1'))
  const search = sp.get('search') ?? ''
  const category = sp.get('category') ?? 'all'
  const status = sp.get('status') ?? 'all'
  const sort = sp.get('sort') ?? 'latest'
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('community_posts')
    .select(
      'id, title, category_slug, created_at, view_count, comment_count, is_hidden, is_pinned, profiles(nickname)',
      { count: 'exact' }
    )

  if (search.trim()) query = query.ilike('title', `%${search.trim()}%`)
  if (category !== 'all') query = query.eq('category_slug', category)
  if (status === 'hidden') query = query.eq('is_hidden', true)
  else if (status === 'pinned') query = query.eq('is_pinned', true)
  else if (status === 'normal') {
    query = query.or('is_hidden.is.null,is_hidden.eq.false').or('is_pinned.is.null,is_pinned.eq.false')
  }

  if (sort === 'popular') query = query.order('view_count', { ascending: false, nullsFirst: false })
  else if (sort === 'comment') query = query.order('comment_count', { ascending: false, nullsFirst: false })
  else query = query.order('created_at', { ascending: false })

  const { data, count, error } = await query.range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const posts = (data ?? []).map((p) => {
    const prof = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
    return {
      id: p.id,
      title: p.title,
      category_slug: p.category_slug,
      created_at: p.created_at,
      view_count: p.view_count,
      comment_count: p.comment_count,
      is_hidden: p.is_hidden,
      is_pinned: p.is_pinned,
      author: (prof as { nickname?: string } | null)?.nickname ?? '회원',
    }
  })

  return NextResponse.json({ posts, total: count ?? 0, page, pageSize: PAGE_SIZE })
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const { action, ids } = body as { action: string; ids: string[] }
  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: 'ids가 필요합니다' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  if (action === 'hide') {
    const { error } = await supabase.from('community_posts').update({ is_hidden: true }).in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete') {
    for (const id of ids) {
      await supabase.from('community_comments').delete().eq('post_id', id)
    }
    const { error } = await supabase.from('community_posts').delete().in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: '알 수 없는 action' }, { status: 400 })
}
