'use client';

import Image from 'next/image';
import { useState } from 'react';

const FALLBACK = '/images/og-default.jpg';

type Props = {
  src?: string | null;
  /** Decorative thumbs should prefer empty alt; never rely on alt as a visible fallback. */
  alt?: string;
  sizes: string;
  className?: string;
  quality?: number;
  unoptimized?: boolean;
};

/**
 * Fixed-aspect article thumbnails for cards/search.
 * On load failure, swaps to project og-default, then a neutral placeholder —
 * so browser alt text never floods the image frame.
 */
export default function SafeArticleThumb({
  src,
  alt = '',
  sizes,
  className = 'object-cover',
  quality = 70,
  unoptimized,
}: Props) {
  const trimmed = typeof src === 'string' ? src.trim() : '';
  const initial = trimmed || FALLBACK;
  const [current, setCurrent] = useState(initial);
  const [showPlaceholder, setShowPlaceholder] = useState(!trimmed);

  if (showPlaceholder) {
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

  return (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      className={className}
      unoptimized={unoptimized}
      onError={() => {
        if (current !== FALLBACK) {
          setCurrent(FALLBACK);
          return;
        }
        setShowPlaceholder(true);
      }}
    />
  );
}
