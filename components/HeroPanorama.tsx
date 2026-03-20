'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const slides = [
  {
    category: 'VITALITY',
    categoryKo: '\uc758\ub8cc\xb7\uc548\ud2f0\uc5d0\uc774\uc9d5',
    headline: 'The Future of',
    headlineEm: 'Longevity',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1920&q=85',
  },
  {
    category: 'PROPERTIES',
    categoryKo: '\ud504\ub9ac\ubbf8\uc5c4 \ubd80\ub3d9\uc0b0',
    headline: 'Spaces That',
    headlineEm: 'Define You',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85',
  },
  {
    category: 'DRIVE & TECH',
    categoryKo: '\ubaa8\ube4c\ub9ac\ud2f0\xb7AI',
    headline: 'Moving Into',
    headlineEm: 'The Future',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85',
  },
  {
    category: 'LIFESTYLE',
    categoryKo: '\ub77c\uc774\ud504\uc2a4\ud0c0\uc77c',
    headline: 'Curating',
    headlineEm: 'Excellence',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85',
  },
];

export function HeroPanorama() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHasEntered(true), 150);
    return () => clearTimeout(t);
  }, []);

  const advance = useCallback(() => {
    setCurrent((c) => {
      setPrev(c);
      return (c + 1) % slides.length;
    });
    setTimeout(() => setPrev(null), 1300);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 5500);
  }, [advance]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goTo = useCallback((idx: number) => {
    if (idx === current || prev !== null) return;
    setPrev(current);
    setCurrent(idx);
    setTimeout(() => setPrev(null), 1300);
    startTimer();
  }, [current, prev, startTimer]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black" aria-label="\ud788\uc5b4\ub85c \uc139\uc158">

      <div ref={parallaxRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === current ? 1 : i === prev ? 0 : 0,
              transform: 'scale(1.05)',
              transition: 'opacity 1.2s ease-in-out',
              zIndex: i === current ? 2 : i === prev ? 1 : 0,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Left vertical category */}
      <div className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-cream/20" />
        <span
          className="text-cream/35 text-[8px] uppercase"
          style={{ fontFamily: 'var(--font-space-mono)', writingMode: 'vertical-rl', letterSpacing: '0.28em' }}
        >
          {slide.category}
        </span>
        <div className="w-px h-16 bg-cream/20" />
      </div>

      {/* Right slide indicators */}
      <div className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        <span className="text-cream/25 text-[8px]" style={{ fontFamily: 'var(--font-space-mono)' }}>
          {String(current + 1).padStart(2, '0')}
        </span>
        <div className="flex flex-col gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`\uc2ac\ub77c\uc774\ub4dc ${i + 1}`}
              className="cursor-pointer transition-all duration-500 w-px"
              style={{
                height: i === current ? '32px' : '10px',
                background: i === current ? 'rgba(245,242,237,0.85)' : 'rgba(245,242,237,0.18)',
              }}
            />
          ))}
        </div>
        <span className="text-cream/15 text-[8px]" style={{ fontFamily: 'var(--font-space-mono)' }}>
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Main copy */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-end px-8 md:px-16 lg:px-20 pb-20 md:pb-24"
        style={{ opacity: hasEntered ? 1 : 0, transition: 'opacity 1s ease' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px bg-cream/35" />
          <span className="text-cream/45 text-[8px] uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-space-mono)' }}>
            {slide.categoryKo}
          </span>
        </div>

        <h1
          key={`headline-${current}`}
          className="text-cream leading-[1.02] tracking-[-0.025em]"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(3.2rem, 8.5vw, 7.5rem)',
            fontWeight: 300,
            animation: 'heroFadeUp 0.85s cubic-bezier(0.33,1,0.68,1) both',
          }}
        >
          {slide.headline}
          <br />
          <em style={{ fontStyle: 'italic' }}>{slide.headlineEm}</em>
        </h1>

        <div
          className="flex items-center gap-5 mt-8 pt-5 border-t border-cream/10"
          style={{ animation: 'heroFadeUp 0.85s 0.2s cubic-bezier(0.33,1,0.68,1) both' }}
        >
          <span className="text-cream/25 text-[8px] uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-space-mono)' }}>
            PAGEONEWORKS
          </span>
          <div className="flex-1 h-px bg-cream/8" />
          <span className="text-cream/25 text-[8px] uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-space-mono)' }}>
            Vol.01 &middot; 2026
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
<div
  className="absolute z-20 flex flex-col items-center gap-2"
  style={{
    bottom: 'clamp(12px, 3vh, 28px)',
    left: '50%',
    transform: 'translateX(-50%)',
  }}
>
  <div
    className="rounded-full border border-cream/12 flex items-center justify-center"
    style={{ width: '36px', height: '36px' }}
  >
    <span
  style={{
    fontFamily: 'var(--font-space-mono)',
    fontSize: '8px',
    letterSpacing: '0.08em',
    color: 'rgba(245,242,237,0.35)',
    textTransform: 'uppercase',
    transform: 'scale(0.6)',
    display: 'inline-block',
  }}
>
  Scroll
</span>
  </div>
  <div
    className="w-px h-5 bg-gradient-to-b from-cream/25 to-transparent"
    style={{ animation: 'heroPulse 2s ease-in-out infinite' }}
  />
</div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
