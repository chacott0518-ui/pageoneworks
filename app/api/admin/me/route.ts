// app/api/admin/me/route.ts

import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/admin/auth'

export async function GET() {
  const session = await checkAdminAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    id: session.user.id,
    nickname: session.profile.nickname,
    isSuperAdmin: session.isSuperAdmin,
  })
}
