// app/api/community/views/[id]/route.ts

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const postId = params.id
  if (!postId) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  const { data: post, error: fetchError } = await supabase
    .from('community_posts')
    .select('view_count')
    .eq('id', postId)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const nextCount = (post.view_count ?? 0) + 1

  const { error: updateError } = await supabase
    .from('community_posts')
    .update({ view_count: nextCount })
    .eq('id', postId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ view_count: nextCount })
}
