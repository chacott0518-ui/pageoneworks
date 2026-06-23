// lib/admin/auth.ts

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { SUPER_ADMIN_EMAIL } from './constants'

export type AdminProfile = {
  id: string
  nickname: string
  is_admin: boolean
}

export type AdminSession = {
  user: { id: string; email: string | undefined }
  profile: AdminProfile
  isSuperAdmin: boolean
}

export async function checkAdminAuth(): Promise<AdminSession | null> {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) return null

  return {
    user: { id: user.id, email: user.email },
    profile: profile as AdminProfile,
    isSuperAdmin: user.email === SUPER_ADMIN_EMAIL,
  }
}

export function isSuperAdmin(email: string | undefined | null): boolean {
  return email === SUPER_ADMIN_EMAIL
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
}

export function forbiddenResponse(message = '권한이 없습니다') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export async function requireAdmin(): Promise<AdminSession | NextResponse> {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 비로그인 → 401
  if (!user) return unauthorizedResponse()

  // 서버에서 현재 로그인 사용자의 user id로 직접 is_admin 검증 (요청 body/query 신뢰 안 함)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nickname, is_admin')
    .eq('id', user.id)
    .maybeSingle()

  // 로그인했으나 관리자가 아님 → 403 (상세 DB 정보 노출 없음)
  if (!profile?.is_admin) return forbiddenResponse()

  return {
    user: { id: user.id, email: user.email },
    profile: profile as AdminProfile,
    isSuperAdmin: user.email === SUPER_ADMIN_EMAIL,
  }
}

export async function requireSuperAdmin(): Promise<AdminSession | NextResponse> {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session
  if (!session.isSuperAdmin) return forbiddenResponse('슈퍼어드민만 가능합니다')
  return session
}
