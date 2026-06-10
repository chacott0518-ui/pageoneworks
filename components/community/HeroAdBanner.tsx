// components/community/HeroAdBanner.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { COMMUNITY_COLORS } from './constants'

export type HeroAdData = {
  slot_name: string
  image_url: string | null
  link_url: string | null
  is_active: boolean | null
}

const PLACEHOLDER = '광고 문의: chacott0518@gmail.com'

export function PcHeroAd({ ad }: { ad: HeroAdData | null }) {
  const hasImage = Boolean(ad?.image_url && ad.is_active)

  const inner = hasImage ? (
    <div style={{ position: 'relative', width: '100%', height: 90 }}>
      <Image
        src={ad!.image_url!}
        alt="광고"
        fill
        sizes="(min-width: 1200px) 100vw, 0px"
        quality={75}
        priority
        style={{ objectFit: 'contain' }}
      />
    </div>
  ) : (
    <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.2)' }}>{PLACEHOLDER}</span>
  )

  const boxStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    height: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 16,
  }

  if (hasImage && ad?.link_url) {
    return (
      <Link href={ad.link_url} target="_blank" rel="noopener noreferrer" className="hidden min-[1200px]:block" style={{ ...boxStyle, textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }

  return (
    <div className="hidden min-[1200px]:flex" style={boxStyle}>
      {inner}
    </div>
  )
}

export function MobileHeroAd({ ad }: { ad: HeroAdData | null }) {
  const hasImage = Boolean(ad?.image_url && ad.is_active)

  const inner = hasImage ? (
    <div style={{ position: 'relative', width: '100%', height: 50 }}>
      <Image
        src={ad!.image_url!}
        alt="광고"
        fill
        sizes="(max-width: 768px) 100vw, 1600px"
        quality={75}
        priority
        style={{ objectFit: 'contain' }}
      />
    </div>
  ) : (
    <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.2)' }}>{PLACEHOLDER}</span>
  )

  const boxStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '0 16px 8px',
  }

  if (hasImage && ad?.link_url) {
    return (
      <Link href={ad.link_url} target="_blank" rel="noopener noreferrer" className="min-[1200px]:hidden" style={{ ...boxStyle, textDecoration: 'none' }}>
        {inner}
      </Link>
    )
  }

  return (
    <div className="min-[1200px]:hidden" style={boxStyle}>
      {inner}
    </div>
  )
}
