'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const FALLBACK = '/images/og-default.jpg';

interface Props {
  src: string;
  alt: string;
}

export function HeroImage({ src, alt }: Props) {
  const trimmed = typeof src === 'string' ? src.trim() : '';
  const [useFallback, setUseFallback] = useState(false);
  const [failed, setFailed] = useState(!trimmed);

  useEffect(() => {
    setUseFallback(false);
    setFailed(!trimmed);
  }, [trimmed]);

  if (failed || !trimmed) {
    return <div className="absolute inset-0 bg-[#1a1a1a]" aria-hidden />;
  }

  const displaySrc = useFallback ? FALLBACK : trimmed;

  return (
    <Image
      key={displaySrc}
      src={displaySrc}
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
        if (!useFallback) {
          setUseFallback(true);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
