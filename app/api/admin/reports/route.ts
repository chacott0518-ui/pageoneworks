// app/api/admin/reports/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET(req: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const tab = req.nextUrl.searchParams.get('tab') ?? 'pending'
  const supabase = createServerSupabaseClient()

  const [pendingCount, reviewedCount, dismissedCount] = await Promise.all([
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .or('status.eq.pending,status.is.null'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'reviewed'),
    supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'dismissed'),
  ])

  let query = supabase
    .from('reports')
    .select('id, post_id, reason, status, created_at, community_posts(title), profiles(nickname)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (tab === 'pending') query = query.or('status.eq.pending,status.is.null')
  else query = query.eq('status', tab)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const reports = (data ?? []).map((r) => {
    const post = Array.isArray(r.community_posts) ? r.community_posts[0] : r.community_posts
    const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
    return {
      id: r.id,
      post_id: r.post_id,
      reason: r.reason,
      status: r.status ?? 'pending',
      created_at: r.created_at,
      postTitle: (post as { title?: string } | null)?.title ?? '(삭제된 글)',
      reporter: (prof as { nickname?: string } | null)?.nickname ?? '회원',
    }
  })

  return NextResponse.json({
    reports,
    counts: {
      pending: pendingCount.count ?? 0,
      reviewed: reviewedCount.count ?? 0,
      dismissed: dismissedCount.count ?? 0,
    },
  })
}
