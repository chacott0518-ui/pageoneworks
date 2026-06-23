// app/community/write/page.tsx

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import WriteForm from '@/components/community/WriteForm'

export const metadata: Metadata = {
  title: '글쓰기 | PAGEONEWORKS 커뮤니티',
  description: 'PAGEONEWORKS 프리미엄 커뮤니티에 새 글을 작성하세요.',
  robots: { index: false, follow: false },
}

export default async function CommunityWritePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/community/write')
  }

  return (
    <div style={{ background: '#0d0d0f', minHeight: '100vh' }}>
      <WriteForm userId={user.id} />
    </div>
  )
}
