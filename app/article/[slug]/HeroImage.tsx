'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK = '/images/og-default.jpg';

interface Props {
  src: string;
  alt: string;
}

export function HeroImage({ src, alt }: Props) {
  const trimmed = typeof src === 'string' ? src.trim() : '';
  const [current, setCurrent] = useState(trimmed || FALLBACK);
  const [failed, setFailed] = useState(!trimmed);

  if (failed) {
    return <div className="absolute inset-0 bg-[#1a1a1a]" aria-hidden />;
  }

  return (
    <Image
      src={current}
      alt={alt}
      fill
      className="object-cover opacity-70"
      priority
      sizes="(max-width: 768px) 100vw, 1400px"
      quality={75}
      placeholder="empty"
      unoptimized
      style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
      onLoad={(e) => {
        const img = e.currentTarget;
        img.style.opacity = '0.7';
      }}
      onError={() => {
        if (current !== FALLBACK) {
          setCurrent(FALLBACK);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
