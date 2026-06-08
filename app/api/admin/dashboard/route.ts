// app/api/admin/dashboard/route.ts

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'
import { getKstTodayStartISO, getKstYesterdayStartISO } from '@/lib/admin/dates'

export async function GET() {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const supabase = createServerSupabaseClient()
  const todayStart = getKstTodayStartISO()
  const yesterdayStart = getKstYesterdayStartISO()

  const [
    todayPostsRes,
    yesterdayPostsRes,
    todayCommentsRes,
    yesterdayCommentsRes,
    totalMembersRes,
    yesterdayMembersRes,
    totalPostsRes,
    yesterdayTotalPostsRes,
    reportsRes,
    membersRes,
    postsRes,
  ] = await Promise.all([
    supabase.from('community_posts').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase
      .from('community_posts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', todayStart),
    supabase.from('community_comments').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase
      .from('community_comments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', todayStart),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', todayStart),
    supabase.from('community_posts').select('id', { count: 'exact', head: true }),
    supabase
      .from('community_posts')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', todayStart),
    supabase
      .from('reports')
      .select('id, post_id, reason, status, created_at, community_posts(title), profiles(nickname)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('profiles')
      .select('id, nickname, created_at, post_count')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('community_posts')
      .select('id, title, category_slug, created_at, view_count, is_hidden, is_pinned, profiles(nickname)')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const mapReport = (r: Record<string, unknown>) => {
    const post = Array.isArray(r.community_posts) ? r.community_posts[0] : r.community_posts
    return {
      id: r.id,
      post_id: r.post_id,
      reason: r.reason,
      status: r.status ?? 'pending',
      created_at: r.created_at,
      postTitle: (post as { title?: string } | null)?.title ?? '(삭제된 글)',
    }
  }

  const mapPost = (p: Record<string, unknown>) => {
    const prof = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles
    return {
      id: p.id,
      title: p.title,
      category_slug: p.category_slug,
      created_at: p.created_at,
      view_count: p.view_count,
      is_hidden: p.is_hidden,
      is_pinned: p.is_pinned,
      author: (prof as { nickname?: string } | null)?.nickname ?? '회원',
    }
  }

  return NextResponse.json({
    stats: {
      todayPosts: todayPostsRes.count ?? 0,
      yesterdayPosts: yesterdayPostsRes.count ?? 0,
      todayComments: todayCommentsRes.count ?? 0,
      yesterdayComments: yesterdayCommentsRes.count ?? 0,
      totalMembers: totalMembersRes.count ?? 0,
      yesterdayMembers: yesterdayMembersRes.count ?? 0,
      totalPosts: totalPostsRes.count ?? 0,
      yesterdayTotalPosts: yesterdayTotalPostsRes.count ?? 0,
    },
    reports: (reportsRes.data ?? []).map(mapReport),
    members: membersRes.data ?? [],
    posts: (postsRes.data ?? []).map(mapPost),
  })
}
