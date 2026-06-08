// app/admin/users/page.tsx

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/admin/Toast'
import { useConfirm } from '@/components/admin/ConfirmModal'

const PAGE_SIZE = 20
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const GOLD = '#C9A96E'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const DANGER = 'rgba(255,70,70,0.9)'
const SUCCESS = 'rgba(70,200,100,0.9)'
const BG = '#0a0a0c'

type UserRow = {
  id: string
  nickname: string
  created_at: string
  post_count: number | null
  level: number
  is_admin: boolean | null
  is_banned: boolean | null
}

function useDebounce<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return debounced
}

export default function AdminUsersPage() {
  const supabase = useMemo(() => createClient(), [])
  const { showToast } = useToast()
  const { confirm } = useConfirm()

  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const load = useCallback(async () => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('profiles')
      .select('id, nickname, created_at, post_count, level, is_admin, is_banned', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (debouncedSearch.trim()) {
      query = query.ilike('nickname', `%${debouncedSearch.trim()}%`)
    }

    const { data, count, error } = await query.range(from, to)

    if (error) {
      showToast('회원 목록을 불러오지 못했습니다', 'error')
      setLoading(false)
      return
    }

    setTotal(count ?? 0)
    setUsers((data ?? []) as UserRow[])
    setLoading(false)
  }, [supabase, page, debouncedSearch, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const updateUser = async (id: string, patch: Partial<UserRow>, dbPatch: Record<string, unknown>) => {
    const prev = users
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    const { error } = await supabase.from('profiles').update(dbPatch).eq('id', id)
    if (error) {
      setUsers(prev)
      showToast('처리에 실패했습니다', 'error')
      return false
    }
    return true
  }

  const toggleAdmin = (user: UserRow) => {
    const next = !user.is_admin
    if (next) {
      confirm({
        title: '어드민 권한 부여',
        message: '어드민 권한을 부여하시겠습니까?',
        confirmLabel: '부여',
        confirmColor: GOLD,
        onConfirm: async () => {
          const ok = await updateUser(user.id, { is_admin: true }, { is_admin: true })
          if (ok) showToast('어드민 권한이 부여되었습니다', 'success')
        },
      })
    } else {
      updateUser(user.id, { is_admin: false }, { is_admin: false }).then((ok) => {
        if (ok) showToast('어드민 권한이 해제되었습니다', 'success')
      })
    }
  }

  const toggleBan = async (user: UserRow) => {
    const next = !user.is_banned
    const ok = await updateUser(user.id, { is_banned: next }, { is_banned: next })
    if (ok) showToast(next ? '회원이 정지되었습니다' : '정지가 해제되었습니다', 'success')
  }

  const changeLevel = async (user: UserRow, level: number) => {
    const ok = await updateUser(user.id, { level }, { level })
    if (ok) showToast('레벨이 변경되었습니다', 'success')
  }

  const statusLabel = (user: UserRow) => {
    if (user.is_admin) return { text: '어드민', color: GOLD }
    if (user.is_banned) return { text: '정지', color: DANGER }
    return { text: '정상', color: SUCCESS }
  }

  const inputStyle: React.CSSProperties = {
    height: 40,
    padding: '0 12px',
    borderRadius: 8,
    border: BORDER,
    background: SURFACE,
    color: TEXT,
    fontSize: 13,
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
  }

  const btnStyle: React.CSSProperties = {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 8,
    border: BORDER,
    background: SURFACE,
    color: TEXT,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: '150ms',
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>회원 관리</h1>
      <input
        type="search"
        placeholder="닉네임 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <div className="admin-users-table" style={{ overflowX: 'auto', border: BORDER, borderRadius: 8, background: SURFACE }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ color: META, textAlign: 'left' }}>
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
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} style={{ padding: 8 }}>
                    <div style={{ height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: META }}>
                  회원이 없습니다
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const status = statusLabel(user)
                return (
                  <tr
                    key={user.id}
                    style={{ borderTop: BORDER }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <td style={{ padding: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(201,169,110,0.15)',
                            color: GOLD,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {(user.nickname ?? '?')[0]}
                        </div>
                        <span style={{ color: TEXT, fontWeight: 500 }}>{user.nickname}</span>
                      </div>
                    </td>
                    <td style={{ padding: 8, color: META }}>—</td>
                    <td style={{ padding: 8, color: META }}>{formatDate(user.created_at)}</td>
                    <td style={{ padding: 8, color: SUB }}>{user.post_count ?? 0}</td>
                    <td style={{ padding: 8, color: SUB }}>Lv.{user.level}</td>
                    <td style={{ padding: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: status.color }}>{status.text}</span>
                    </td>
                    <td style={{ padding: 8 }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <button type="button" onClick={() => toggleAdmin(user)} style={btnStyle} title="어드민">
                          👑
                        </button>
                        <select
                          value={user.level}
                          onChange={(e) => changeLevel(user, Number(e.target.value))}
                          style={{
                            height: 36,
                            borderRadius: 8,
                            border: BORDER,
                            background: SURFACE,
                            color: TEXT,
                            fontSize: 12,
                          }}
                        >
                          {Array.from({ length: 10 }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Lv.{i + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => toggleBan(user)}
                          style={{ ...btnStyle, color: user.is_banned ? SUCCESS : DANGER }}
                          title="정지"
                        >
                          🚫
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-users-cards" style={{ display: 'none', flexDirection: 'column', gap: 8 }}>
        {!loading &&
          users.map((user) => {
            const status = statusLabel(user)
            return (
              <div key={user.id} style={{ border: BORDER, borderRadius: 8, background: SURFACE, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'rgba(201,169,110,0.15)',
                      color: GOLD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {(user.nickname ?? '?')[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: TEXT, margin: 0 }}>{user.nickname}</p>
                    <p style={{ fontSize: 11, color: META, margin: '4px 0 0' }}>
                      {formatDate(user.created_at)} · 글 {user.post_count ?? 0} · <span style={{ color: status.color }}>{status.text}</span>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => toggleAdmin(user)} style={btnStyle}>
                    👑 어드민
                  </button>
                  <select
                    value={user.level}
                    onChange={(e) => changeLevel(user, Number(e.target.value))}
                    style={{ height: 36, borderRadius: 8, border: BORDER, background: SURFACE, color: TEXT, fontSize: 12 }}
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Lv.{i + 1}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={() => toggleBan(user)} style={btnStyle}>
                    🚫 {user.is_banned ? '해제' : '정지'}
                  </button>
                </div>
              </div>
            )
          })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={btnStyle}>
          이전
        </button>
        <span style={{ fontSize: 12, color: SUB, alignSelf: 'center' }}>
          {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={btnStyle}>
          다음
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width:768px) {
          .admin-users-table { display: none !important; }
          .admin-users-cards { display: flex !important; }
        }
      `}} />
    </div>
  )
}
