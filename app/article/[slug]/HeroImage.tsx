'use client';

import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
}

export function HeroImage({ src, alt }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover opacity-70"
      priority
      sizes="(max-width: 768px) 100vw, 1400px"
      quality={75}
      placeholder="empty"
      style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
      onLoad={(e) => {
        const img = e.currentTarget;
        img.style.opacity = '0.7';
      }}
    />
  );
}
