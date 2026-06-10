// components/community/AvatarEditor.tsx

'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Lock, Loader2 } from 'lucide-react'
import { COMMUNITY_COLORS } from './constants'
import { levelLabel } from './utils'
import type { ProfileMini } from './types'

type SectionKey = 'photo' | 'avatar' | 'frame' | 'badge' | 'title'

const AVATARS = [
  { id: 'mask', emoji: '🎭', minLevel: 1 },
  { id: 'fox', emoji: '🦊', minLevel: 1 },
  { id: 'wolf', emoji: '🐺', minLevel: 3 },
  { id: 'lion', emoji: '🦁', minLevel: 5 },
  { id: 'dragon', emoji: '🐉', minLevel: 7 },
]

const FRAMES = [
  { id: 'gold', label: '골드', style: '2px solid #C9A96E', premium: false },
  { id: 'silver', label: '실버', style: '2px solid rgba(255,255,255,0.55)', premium: false },
  { id: 'bronze', label: '브론즈', style: '2px solid #b87333', premium: false },
  { id: 'neon', label: '네온', style: '2px solid #7dd3fc', premium: true },
  { id: 'royal', label: '로얄', style: '2px solid #a78bfa', premium: true },
]

const BADGES = [
  { id: 'seed', label: '시드', minLevel: 1, auto: true },
  { id: 'sprout', label: '새싹', minLevel: 3, auto: true },
  { id: 'tree', label: '나무', minLevel: 5, auto: true },
  { id: 'forest', label: '숲', minLevel: 7, auto: true },
  { id: 'expert', label: '전문가', minLevel: 10, auto: true },
  { id: 'first_post', label: '첫글쓰기', minLevel: 1, auto: false },
  { id: 'comment_king', label: '댓글왕', minLevel: 3, auto: false },
  { id: 'hot_post', label: '인기글', minLevel: 5, auto: false },
]

export default function AvatarEditor({
  profile,
  userId,
  initialAvatarEmoji,
  initialFrame,
  initialBadge,
}: {
  profile: ProfileMini
  userId: string
  initialAvatarEmoji?: string | null
  initialFrame?: string | null
  initialBadge?: string | null
}) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const fileRef = useRef<HTMLInputElement>(null)

  const [section, setSection] = useState<SectionKey>('photo')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [selectedEmoji, setSelectedEmoji] = useState(initialAvatarEmoji ?? '🎭')
  const [selectedFrame, setSelectedFrame] = useState(initialFrame ?? 'gold')
  const [selectedBadge, setSelectedBadge] = useState(initialBadge ?? 'seed')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const lv = levelLabel(profile.level)
  const frameStyle = FRAMES.find((f) => f.id === selectedFrame)?.style ?? FRAMES[0].style

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('최대 5MB까지 업로드 가능합니다.')
      return
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      showToast('jpg, png, webp만 업로드 가능합니다.')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('community-images')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setUploading(false)
      showToast(`업로드 실패: ${uploadError.message}`)
      return
    }

    const { data: publicData } = supabase.storage.from('community-images').getPublicUrl(path)
    const publicUrl = publicData.publicUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    setUploading(false)
    if (updateError) {
      showToast(`프로필 업데이트 실패: ${updateError.message}`)
      return
    }

    setAvatarUrl(publicUrl)
    showToast('사진이 업로드되었습니다.')
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: Record<string, string> = {
      selected_avatar: selectedEmoji,
      selected_frame: selectedFrame,
      selected_badge: selectedBadge,
    }
    if (avatarUrl) payload.avatar_url = avatarUrl

    let { error } = await supabase.from('profiles').update(payload).eq('id', userId)

    if (error) {
      const fallback = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
      error = fallback.error
    }

    setSaving(false)
    if (error) {
      showToast(`저장 실패: ${error.message}`)
      return
    }
    showToast('저장되었습니다')
    router.refresh()
  }

  const sections: { key: SectionKey; label: string }[] = [
    { key: 'photo', label: '프로필사진' },
    { key: 'avatar', label: '아바타' },
    { key: 'frame', label: '테두리' },
    { key: 'badge', label: '뱃지' },
    { key: 'title', label: '칭호' },
  ]

  return (
    <div className="min-h-screen pt-[60px]" style={{ background: '#0a0a0c', fontFamily: 'Inter, Pretendard, sans-serif' }}>
      <div className="max-w-[1100px] mx-auto px-4 py-6">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-[13px] font-medium mb-5 transition-opacity hover:opacity-80"
          style={{ color: COMMUNITY_COLORS.sub }}
        >
          <ArrowLeft className="w-4 h-4" />
          커뮤니티로 돌아가기
        </Link>

        <h1 className="text-[22px] font-medium mb-1" style={{ color: COMMUNITY_COLORS.text }}>
          아바타 꾸미기
        </h1>
        <p className="text-[13px] font-normal mb-6" style={{ color: COMMUNITY_COLORS.sub }}>
          {profile.nickname} · {lv.emoji} Lv.{profile.level} {lv.short}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 프리뷰 패널 */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `0.5px solid ${COMMUNITY_COLORS.border}`,
              boxShadow: '0 0 40px rgba(201,169,110,0.06)',
            }}
          >
            <div className="avatar-particles pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative flex flex-col items-center justify-center py-10">
              <div
                className="relative w-[120px] h-[120px] rounded-full overflow-hidden flex items-center justify-center text-[48px]"
                style={{ border: frameStyle, boxShadow: '0 0 24px rgba(201,169,110,0.18)' }}
              >
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="avatar" fill className="object-cover" sizes="120px" quality={75} loading="lazy" />
                ) : (
                  <span>{selectedEmoji}</span>
                )}
              </div>
              <p className="mt-4 text-[14px] font-medium" style={{ color: COMMUNITY_COLORS.text }}>
                {profile.nickname}
              </p>
              <p className="text-[12px] font-normal mt-1" style={{ color: COMMUNITY_COLORS.gold }}>
                {BADGES.find((b) => b.id === selectedBadge)?.label ?? '시드'} · {FRAMES.find((f) => f.id === selectedFrame)?.label ?? '골드'} 프레임
              </p>
            </div>
          </div>

          {/* 선택 패널 */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: `0.5px solid ${COMMUNITY_COLORS.border}` }}
          >
            <div className="flex gap-1 overflow-x-auto mb-4" style={{ scrollbarWidth: 'none' }}>
              {sections.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSection(s.key)}
                  className="shrink-0 px-3 py-1.5 text-[12px] font-medium whitespace-nowrap"
                  style={{
                    borderRadius: '6px',
                    color: section === s.key ? COMMUNITY_COLORS.gold : COMMUNITY_COLORS.sub,
                    background: section === s.key ? 'rgba(201,169,110,0.10)' : 'transparent',
                    border: `0.5px solid ${section === s.key ? 'rgba(201,169,110,0.25)' : COMMUNITY_COLORS.border}`,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {section === 'photo' && (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleUpload(f)
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2"
                  style={{
                    border: `0.5px solid ${COMMUNITY_COLORS.gold}`,
                    color: COMMUNITY_COLORS.gold,
                    background: 'rgba(201,169,110,0.06)',
                  }}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  사진 업로드
                </button>
                <p className="text-[11px] font-normal mt-2" style={{ color: COMMUNITY_COLORS.meta }}>
                  최대 5MB · jpg/png/webp · 모바일 카메라/사진첩 지원
                </p>
                {avatarUrl && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden" style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}` }}>
                      <Image src={avatarUrl} alt="preview" fill className="object-cover" sizes="56px" quality={75} loading="lazy" />
                    </div>
                    <span className="text-[12px] font-normal" style={{ color: COMMUNITY_COLORS.sub }}>
                      업로드된 사진 미리보기
                    </span>
                  </div>
                )}
              </div>
            )}

            {section === 'avatar' && (
              <div className="grid grid-cols-5 gap-3">
                {AVATARS.map((a) => {
                  const locked = profile.level < a.minLevel
                  const selected = selectedEmoji === a.emoji
                  return (
                    <button
                      key={a.id}
                      type="button"
                      disabled={locked}
                      title={locked ? `Lv.${a.minLevel} 달성시 해금` : a.emoji}
                      onClick={() => setSelectedEmoji(a.emoji)}
                      className="relative w-10 h-10 rounded-full flex items-center justify-center text-[22px] mx-auto"
                      style={{
                        border: selected ? `2px solid ${COMMUNITY_COLORS.gold}` : `0.5px solid ${COMMUNITY_COLORS.border}`,
                        opacity: locked ? 0.35 : 1,
                        boxShadow: selected ? '0 0 12px rgba(201,169,110,0.25)' : undefined,
                      }}
                    >
                      {a.emoji}
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-[12px]">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {section === 'frame' && (
              <div className="grid grid-cols-3 gap-3">
                {FRAMES.map((f) => {
                  const selected = selectedFrame === f.id
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        if (f.premium) {
                          alert('준비 중')
                          return
                        }
                        setSelectedFrame(f.id)
                      }}
                      className="relative rounded-xl p-3 text-center"
                      style={{
                        border: selected ? `0.5px solid rgba(201,169,110,0.35)` : `0.5px solid ${COMMUNITY_COLORS.border}`,
                        background: selected ? 'rgba(201,169,110,0.08)' : COMMUNITY_COLORS.surface,
                      }}
                    >
                      <div className="w-10 h-10 rounded-full mx-auto mb-2" style={{ border: f.style }} />
                      <p className="text-[11px] font-medium" style={{ color: COMMUNITY_COLORS.text }}>
                        {f.label}
                      </p>
                      {f.premium && (
                        <span className="absolute top-2 right-2 text-[10px]" style={{ color: COMMUNITY_COLORS.meta }}>
                          🔒
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {section === 'badge' && (
              <div className="grid grid-cols-2 gap-2">
                {BADGES.map((b) => {
                  const locked = profile.level < b.minLevel
                  const selected = selectedBadge === b.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      disabled={locked && b.auto}
                      onClick={() => !locked && setSelectedBadge(b.id)}
                      className="px-3 py-2 rounded-lg text-left"
                      style={{
                        border: selected ? `0.5px solid rgba(201,169,110,0.35)` : `0.5px solid ${COMMUNITY_COLORS.border}`,
                        background: selected ? 'rgba(201,169,110,0.08)' : COMMUNITY_COLORS.surface,
                        opacity: locked && b.auto ? 0.4 : 1,
                      }}
                    >
                      <p className="text-[12px] font-medium" style={{ color: COMMUNITY_COLORS.text }}>
                        {b.label}
                      </p>
                      <p className="text-[10px] font-normal mt-0.5" style={{ color: COMMUNITY_COLORS.meta }}>
                        {b.auto ? `Lv.${b.minLevel}+` : '특별 활동'}
                      </p>
                    </button>
                  )
                })}
              </div>
            )}

            {section === 'title' && (
              <div className="space-y-2">
                {['입문자', '활동가', '전문가 지망'].map((t) => (
                  <div
                    key={t}
                    className="px-3 py-2 rounded-lg text-[12px] font-medium"
                    style={{ border: `0.5px solid ${COMMUNITY_COLORS.border}`, color: COMMUNITY_COLORS.sub, background: COMMUNITY_COLORS.surface }}
                  >
                    {t} <span className="text-[10px] font-normal" style={{ color: COMMUNITY_COLORS.meta }}>· 추후 업데이트</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-5 py-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2"
              style={{ background: COMMUNITY_COLORS.gold, color: '#0a0a0c' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              저장
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('준비 중')}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(520px,calc(100%-32px))] py-3 rounded-xl text-[12px] font-medium"
          style={{
            border: `0.5px solid ${COMMUNITY_COLORS.gold}`,
            color: COMMUNITY_COLORS.gold,
            background: 'rgba(10,10,12,0.92)',
            boxShadow: '0 0 24px rgba(201,169,110,0.12)',
          }}
        >
          🔒 프리미엄 아이템 — 아이템 상점 →
        </button>
      </div>

      {toast && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-[12px] font-medium z-[300]"
          style={{ background: 'rgba(20,20,22,0.95)', border: `0.5px solid ${COMMUNITY_COLORS.border}`, color: COMMUNITY_COLORS.text }}
        >
          {toast}
        </div>
      )}

      <style jsx>{`
        .avatar-particles {
          background-image:
            radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.08) 0, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(201, 169, 110, 0.06) 0, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0, transparent 55%);
        }
      `}</style>
    </div>
  )
}
