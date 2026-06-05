// components/community/AvatarCard.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { COMMUNITY_COLORS } from './constants'
import { levelLabel } from './utils'
import type { ProfileMini } from './types'

export function AvatarCard({ profile }: { profile: ProfileMini }) {
  const lv = levelLabel(profile.level)

  return (
    <div
      className="rounded-xl p-3 mb-5"
      style={{
        background: COMMUNITY_COLORS.surface,
        border: `0.5px solid ${COMMUNITY_COLORS.border}`,
        fontFamily: 'Inter, Pretendard, sans-serif',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden"
          style={{
            border: `0.5px solid rgba(201,169,110,0.35)`,
            background: 'linear-gradient(135deg, rgba(201,169,110,0.35), rgba(201,169,110,0.08))',
          }}
        >
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.nickname}
              fill
              className="object-cover"
              sizes="44px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[16px]">
              {profile.nickname?.[0] ?? '?'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium truncate" style={{ color: COMMUNITY_COLORS.text }}>
            {profile.nickname}
          </p>
          <p className="text-[11px] font-medium mt-0.5" style={{ color: COMMUNITY_COLORS.gold }}>
            {lv.emoji} Lv.{profile.level} {lv.short}
          </p>
        </div>
      </div>
      <Link
        href="/community/avatar"
        className="block mt-3 text-[11px] font-medium transition-opacity hover:opacity-80"
        style={{ color: COMMUNITY_COLORS.gold }}
      >
        아바타 꾸미기 →
      </Link>
    </div>
  )
}
