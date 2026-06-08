// app/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { forbiddenResponse, requireAdmin } from '@/lib/admin/auth'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  const body = await req.json()
  const targetId = params.id
  const isSelf = targetId === session.user.id

  if (isSelf && session.isSuperAdmin) {
    if (body.is_admin === false || body.is_banned === true) {
      return forbiddenResponse('슈퍼어드민 본인 계정은 정지/권한해제할 수 없습니다')
    }
  }

  if (body.is_admin !== undefined) {
    if (!session.isSuperAdmin) {
      return forbiddenResponse('슈퍼어드민만 어드민 권한을 변경할 수 있습니다')
    }
  }

  const patch: Record<string, unknown> = {}
  if (typeof body.is_admin === 'boolean') patch.is_admin = body.is_admin
  if (typeof body.is_banned === 'boolean') patch.is_banned = body.is_banned
  if (typeof body.level === 'number' && body.level >= 1 && body.level <= 10) patch.level = body.level

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: '변경할 필드가 없습니다' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from('profiles').update(patch).eq('id', targetId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
