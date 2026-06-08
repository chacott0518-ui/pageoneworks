// app/admin/layout.tsx

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { checkAdminAuth } from '@/lib/admin/auth'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await checkAdminAuth()

  if (!session) {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/login?next=/admin')
    redirect('/')
  }

  return (
    <AdminLayoutClient nickname={session.profile.nickname ?? 'Admin'} isSuperAdmin={session.isSuperAdmin}>
      {children}
    </AdminLayoutClient>
  )
}
