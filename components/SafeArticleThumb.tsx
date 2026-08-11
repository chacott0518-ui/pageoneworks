'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const FALLBACK = '/images/og-default.jpg';

type Props = {
  src?: string | null;
  /** Decorative thumbs should prefer empty alt; never rely on alt as a visible fallback. */
  alt?: string;
  sizes: string;
  className?: string;
  quality?: number;
  /**
   * Default true — production previously hit Vercel Image Optimization 402s.
   * Article thumbs must load the src URL directly; only real img onError uses fallback.
   */
  unoptimized?: boolean;
};

/**
 * Fixed-aspect article thumbnails for cards/search.
 * Renders the real src first. Fallback only after a genuine onError.
 * Does not preflight / HEAD-check remote URLs.
 */
export default function SafeArticleThumb({
  src,
  alt = '',
  sizes,
  className = 'object-cover',
  quality = 70,
  unoptimized = true,
}: Props) {
  const trimmed = typeof src === 'string' ? src.trim() : '';
  const [failed, setFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setFailed(false);
    setUseFallback(false);
  }, [trimmed]);

  if (!trimmed || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-[#EFEAE1]"
        aria-hidden
      >
        <span
          className="uppercase"
          style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: 'rgba(26,26,26,0.3)',
          }}
        >
          PAGEONEWORKS
        </span>
      </div>
    );
  }

  const displaySrc = useFallback ? FALLBACK : trimmed;

  return (
    <Image
      key={displaySrc}
      src={displaySrc}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      className={className}
      unoptimized={unoptimized}
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
