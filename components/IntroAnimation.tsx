'use client';

import { useEffect, useRef, useState } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    import('gsap').then(({ gsap }) => {
      if (!containerRef.current || !circleRef.current || !textRef.current) return;

      gsap.set(circleRef.current, { scale: 0, borderRadius: '50%' });
      gsap.set(textRef.current, { scale: 1.4, opacity: 0, filter: 'blur(20px)' });

      tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('pow_intro', 'true');
          onCompleteRef.current();
          setUnmounted(true);
        },
      });

      // 1: blue circle expands to fill screen
      tl.to(circleRef.current, {
        scale: 1,
        borderRadius: '0%',
        duration: 0.8,
        ease: 'power3.inOut',
      });

      // 2: text zooms in from blurred large to crisp
      tl.to(
        textRef.current,
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power4.out',
        },
        0.8,
      );

      // 3: hold (1.8 → 2.4)
      tl.to({}, { duration: 0.6 });

      // 4: fade everything out
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    });

    return () => {
      tl?.kill();
    };
  }, []);

  if (unmounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999]"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="absolute inset-0 bg-white" />

      <div
        ref={circleRef}
        className="absolute inset-0"
        style={{
          backgroundColor: '#1a1aff',
          transformOrigin: 'center center',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          ref={textRef}
          className="text-white select-none"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          PAGEONEWORKS.
        </span>
      </div>
    </div>
  );
}
