import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import PostDetail from './PostDetail'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
  const { data: post } = await supabase
    .from('community_posts')
    .select('title, content')
    .eq('id', params.id)
    .single()

  if (!post) return {}
  return {
    title: `${post.title} | PAGEONEWORKS 커뮤니티`,
    description: post.content?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content?.slice(0, 160),
      type: 'article',
    },
  }
}

export default async function PostPage({ params }: Props) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )

  const { data: post } = await supabase
    .from('community_posts')
    .select('*, profiles(nickname, avatar_url, level)')
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  await supabase.rpc('increment_view_count', { post_id: params.id })

  const { data: { user } } = await supabase.auth.getUser()

  return <PostDetail post={post} currentUser={user} />
}