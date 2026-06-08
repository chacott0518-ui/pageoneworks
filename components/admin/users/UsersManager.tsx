// components/admin/users/UsersManager.tsx

'use client'

import { useCallback, useEffect, useState } from 'react'
import { ADMIN_THEME, PAGE_SIZE } from '@/lib/admin/constants'
import { adminFetch } from '@/lib/admin/client'
import { useDebounce } from '@/components/admin/hooks/useDebounce'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'
import { SkeletonTable, SkeletonCards } from '@/components/admin/Skeleton'
import { Pagination } from '@/components/admin/Pagination'

const T = ADMIN_THEME

type UserRow = {
  id: string
  nickname: string
  created_at: string
  post_count: number | null
  level: number
  is_admin: boolean | null
  is_banned: boolean | null
}

const btnStyle: React.CSSProperties = {
  minHeight: 36,
  padding: '0 12px',
  borderRadius: 8,
  border: T.border,
  background: T.surface,
  color: T.text,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  transition: '150ms',
}

export function UsersManager() {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const qs = new URLSearchParams({ page: String(page), search: debouncedSearch })
      const data = await adminFetch<{ users: UserRow[]; total: number; isSuperAdmin: boolean; currentUserId: string }>(`/api/admin/users?${qs}`)
      setUsers(data.users)
      setTotal(data.total)
      setIsSuperAdmin(data.isSuperAdmin)
      setCurrentUserId(data.currentUserId)
    } catch (e) {
      showToast(e instanceof Error ? e.message : '로드 실패', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, showToast])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(1) }, [debouncedSearch])

  const patchUser = async (id: string, patch: Partial<UserRow>, body: Record<string, unknown>) => {
    const prev = users
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    try {
      await adminFetch(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
      return true
    } catch (e) {
      setUsers(prev)
      showToast(e instanceof Error ? e.message : '실패', 'error')
      return false
    }
  }

  const grantAdmin = (user: UserRow) => {
    confirm({
      title: '어드민 권한 부여',
      message: '어드민 권한을 부여하시겠습니까? 슈퍼어드민만 해제할 수 있습니다.',
      confirmText: '부여',
      confirmColor: T.gold,
      onConfirm: async () => {
        const ok = await patchUser(user.id, { is_admin: true }, { is_admin: true })
        if (ok) showToast('어드민 권한이 부여되었습니다', 'success')
      },
    })
  }

  const revokeAdmin = (user: UserRow) => {
    confirm({
      title: '어드민 권한 해제',
      message: '어드민 권한을 해제하시겠습니까?',
      confirmText: '해제',
      onConfirm: async () => {
        const ok = await patchUser(user.id, { is_admin: false }, { is_admin: false })
        if (ok) showToast('어드민 권한이 해제되었습니다', 'success')
      },
    })
  }

  const toggleBan = async (user: UserRow) => {
    const next = !user.is_banned
    const ok = await patchUser(user.id, { is_banned: next }, { is_banned: next })
    if (ok) showToast(next ? '회원이 정지되었습니다' : '정지가 해제되었습니다', 'success')
  }

  const changeLevel = async (user: UserRow, level: number) => {
    const ok = await patchUser(user.id, { level }, { level })
    if (ok) showToast('레벨이 변경되었습니다', 'success')
  }

  const statusLabel = (user: UserRow) => {
    if (user.is_admin) return { text: '어드민', color: T.gold }
    if (user.is_banned) return { text: '정지', color: T.danger }
    return { text: '정상', color: T.success }
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')
  const isSelfSuper = (user: UserRow) => isSuperAdmin && user.id === currentUserId

  const actionRow = (user: UserRow, disabled: boolean) => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {isSuperAdmin && !disabled && (
        user.is_admin ? (
          <button type="button" onClick={() => revokeAdmin(user)} style={btnStyle}>👑 해제</button>
        ) : (
          <button type="button" onClick={() => grantAdmin(user)} style={btnStyle}>👑 임명</button>
        )
      )}
      <select value={user.level} disabled={disabled} onChange={(e) => changeLevel(user, Number(e.target.value))} style={{ height: 36, borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 12 }}>
        {Array.from({ length: 10 }).map((_, i) => <option key={i + 1} value={i + 1}>Lv.{i + 1}</option>)}
      </select>
      <button type="button" disabled={disabled} onClick={() => toggleBan(user)} style={{ ...btnStyle, color: user.is_banned ? T.success : T.danger }}>🚫</button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: T.text, margin: '0 0 24px' }}>회원 관리</h1>
      <input type="search" placeholder="닉네임 검색" value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: 40, padding: '0 12px', borderRadius: 8, border: T.border, background: T.surface, color: T.text, fontSize: 13, width: '100%', maxWidth: 400, marginBottom: 16 }} />

      <div className="admin-users-table" style={{ overflowX: 'auto', border: T.border, borderRadius: 8, background: T.surface }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: T.meta, textAlign: 'left' }}>
              <th style={{ padding: 8, fontWeight: 500 }}>회원</th>
              <th style={{ padding: 8, fontWeight: 500 }}>이메일</th>
              <th style={{ padding: 8, fontWeight: 500 }}>가입일</th>
              <th style={{ padding: 8, fontWeight: 500 }}>글수</th>
              <th style={{ padding: 8, fontWeight: 500 }}>레벨</th>
              <th style={{ padding: 8, fontWeight: 500 }}>상태</th>
              <th style={{ padding: 8, fontWeight: 500 }}>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <SkeletonTable rows={5} cols={7} /> : users.map((user) => {
              const status = statusLabel(user)
              const disabled = isSelfSuper(user)
              return (
                <tr key={user.id} style={{ borderTop: T.border, background: user.is_banned ? 'rgba(255,70,70,0.06)' : 'transparent' }} onMouseEnter={(e) => { if (!user.is_banned) e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }} onMouseLeave={(e) => { e.currentTarget.style.background = user.is_banned ? 'rgba(255,70,70,0.06)' : 'transparent' }}>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,169,110,0.15)', color: T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>{(user.nickname ?? '?')[0]}</div>
                      <span style={{ color: T.text, fontWeight: 500 }}>{user.nickname}</span>
                    </div>
                  </td>
                  <td style={{ padding: 8, color: T.meta }}>—</td>
                  <td style={{ padding: 8, color: T.meta }}>{formatDate(user.created_at)}</td>
                  <td style={{ padding: 8, color: T.sub }}>{user.post_count ?? 0}</td>
                  <td style={{ padding: 8, color: T.sub }}>Lv.{user.level}</td>
                  <td style={{ padding: 8 }}><span style={{ fontSize: 11, fontWeight: 500, color: status.color }}>{status.text}</span></td>
                  <td style={{ padding: 8 }}>{actionRow(user, disabled)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-users-cards" style={{ display: 'none' }}>
        {!loading && users.map((user) => {
          const status = statusLabel(user)
          const disabled = isSelfSuper(user)
          return (
            <div key={user.id} style={{ border: T.border, borderRadius: 8, background: user.is_banned ? 'rgba(255,70,70,0.06)' : T.surface, padding: 16, marginBottom: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: T.text, margin: 0 }}>{user.nickname}</p>
              <p style={{ fontSize: 11, color: T.meta, margin: '4px 0 8px' }}>{formatDate(user.created_at)} · 글 {user.post_count ?? 0} · <span style={{ color: status.color }}>{status.text}</span></p>
              {actionRow(user, disabled)}
            </div>
          )
        })}
      </div>

      <Pagination currentPage={page} pageSize={PAGE_SIZE} totalCount={total} onPageChange={setPage} />
      <style dangerouslySetInnerHTML={{ __html: `@media(max-width:768px){.admin-users-table{display:none!important}.admin-users-cards{display:block!important}}` }} />
    </div>
  )
}
