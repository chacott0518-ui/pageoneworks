// app/api/admin/users/route.ts

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
    .from('profiles')
    .select('id, nickname, created_at, post_count, level, is_admin, is_banned', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search.trim()) query = query.ilike('nickname', `%${search.trim()}%`)

  const { data, count, error } = await query.range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    users: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    isSuperAdmin: session.isSuperAdmin,
    currentUserId: session.user.id,
  })
}
