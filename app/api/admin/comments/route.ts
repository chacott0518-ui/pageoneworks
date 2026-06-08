// app/api/admin/comments/route.ts

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
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('community_comments')
    .select(
      'id, content, created_at, post_id, is_hidden, profiles(nickname), community_posts(title)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  if (search.trim()) query = query.ilike('content', `%${search.trim()}%`)

  const { data, count, error } = await query.range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const comments = (data ?? []).map((c) => {
    const prof = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
    const post = Array.isArray(c.community_posts) ? c.community_posts[0] : c.community_posts
    return {
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      post_id: c.post_id,
      is_hidden: c.is_hidden ?? null,
      author: (prof as { nickname?: string } | null)?.nickname ?? '회원',
      postTitle: (post as { title?: string } | null)?.title ?? '(삭제된 글)',
    }
  })

  return NextResponse.json({ comments, total: count ?? 0, page, pageSize: PAGE_SIZE })
}
