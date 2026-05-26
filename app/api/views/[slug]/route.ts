import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: { slug: string }
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('article_views')
    .select('view_count')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return NextResponse.json({ viewCount: 0 })
  }

  return NextResponse.json({ viewCount: data.view_count })
}

export async function POST(_req: Request, { params }: RouteParams) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  await supabase.rpc('increment_article_view', { p_slug: slug })

  const { data } = await supabase
    .from('article_views')
    .select('view_count')
    .eq('slug', slug)
    .single()

  return NextResponse.json({ viewCount: data?.view_count ?? 1 })
}
