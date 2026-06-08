// app/api/admin/notices/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET() {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('community_notices')
    .select('id, title, content, is_active, display_order, created_at, updated_at')
    .order('display_order', { ascending: true })

  if (error) {
    return NextResponse.json({ notices: [], tableMissing: true, error: error.message })
  }

  return NextResponse.json({ notices: data ?? [], tableMissing: false })
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const title = String(body.title ?? '').trim().slice(0, 200)
  const content = String(body.content ?? '').trim().slice(0, 1000)
  const is_active = Boolean(body.is_active ?? true)

  if (!title) return NextResponse.json({ error: '제목이 필요합니다' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data: maxOrder } = await supabase
    .from('community_notices')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const display_order = (maxOrder?.display_order ?? -1) + 1

  const { data, error } = await supabase
    .from('community_notices')
    .insert({ title, content, is_active, display_order, updated_at: new Date().toISOString() })
    .select('id, title, content, is_active, display_order, created_at, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message, tableMissing: true }, { status: 500 })
  return NextResponse.json({ notice: data })
}
