// app/community/avatar/page.tsx

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AvatarEditor from '@/components/community/AvatarEditor'
import type { ProfileMini } from '@/components/community/types'

export const metadata: Metadata = {
  title: '아바타 꾸미기 | PAGEONEWORKS 커뮤니티',
  description: '프로필 사진, 아바타, 테두리, 뱃지를 꾸며 나만의 커뮤니티 프로필을 완성하세요.',
  robots: { index: false, follow: false },
}

export default async function CommunityAvatarPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/community/avatar')
  }

  const { data: profileRow } = await supabase
    .from('profiles')
    .select('id,nickname,avatar_url,level,post_count,is_admin')
    .eq('id', user.id)
    .maybeSingle()

  const profile: ProfileMini = profileRow ?? {
    id: user.id,
    nickname: user.email?.split('@')[0] ?? '회원',
    avatar_url: null,
    level: 1,
    post_count: 0,
    is_admin: false,
  }

  return (
    <AvatarEditor
      profile={profile}
      userId={user.id}
      initialAvatarEmoji={null}
      initialFrame={null}
      initialBadge={null}
    />
  )
}
