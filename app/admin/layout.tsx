// app/admin/layout.tsx

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id,nickname,is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    redirect('/')
  }

  return (
    <AdminLayoutClient nickname={profile.nickname ?? 'Admin'}>
      {children}
    </AdminLayoutClient>
  )
}
