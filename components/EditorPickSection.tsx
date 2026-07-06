'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { articles } from '@/lib/data';
import type { Article } from '@/lib/data';
import { getSpotlightArticles } from '@/lib/article-selectors';
import { MANUAL_SPOTLIGHT_SLUGS } from '@/lib/editorPicks';

function getPicks(): Article[] {
  return getSpotlightArticles(articles, {
    count: 7,
    manualSlugs: MANUAL_SPOTLIGHT_SLUGS,
    // viewCounts: 클라이언트 일괄 조회 API 없음 → 1차 미반영, 함수 시그니처로 확장 가능
  });
}

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setV(true), delay); io.disconnect(); } },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return { ref, v };
}

function CardLarge({ a }: { a: Article }) {
  const { ref, v } = useReveal(0);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity .6s ease, transform .6s ease' }}>
      <Link href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 56, fontWeight: 300, lineHeight: 1, color: '#888', marginBottom: 10, userSelect: 'none' }}>01</div>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '56%', overflow: 'hidden', borderRadius: 1, marginBottom: 14 }}>
          <Image src={a.image} alt={a.titleKo} fill sizes="(max-width: 768px) 100vw, 50vw" quality={75} priority style={{ objectFit: 'cover', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: 'transform .6s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 55%)' }} />
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', background: '#c9b99a', fontFamily: 'DM Sans, sans-serif', fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#111' }}>주목 1위</div>
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: '#c9b99a', marginBottom: 8 }}>{a.category}</div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, Noto Serif KR, Georgia, serif', fontSize: 'clamp(17px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.4, wordBreak: 'keep-all', color: hov ? '#ede8e0' : '#c8c0b4', transition: 'color .2s' }}>{a.titleKo}</h3>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#666' }}>
          <span>{a.date}</span>
          {a.readTime && <><span>·</span><span>{a.readTime}</span></>}
        </div>
        <div style={{ height: 1.5, background: '#1a1a1a', marginTop: 14, borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#c9b99a', width: v ? '100%' : '0%', borderRadius: 1, transition: 'width 1.2s ease .4s' }} />
        </div>
      </Link>
    </div>
  );
}

function CardMedium({ a, rank, delay }: { a: Article; rank: number; delay: number }) {
  const { ref, v } = useReveal(delay);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity .5s ease, transform .5s ease' }}>
      <Link href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 26, fontWeight: 300, lineHeight: 1, color: '#777', marginBottom: 8, userSelect: 'none' }}>{String(rank).padStart(2, '0')}</div>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '65%', overflow: 'hidden', borderRadius: 1, marginBottom: 10 }}>
          <Image src={a.image} alt={a.titleKo} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} style={{ objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.3) 0%, transparent 60%)' }} />
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#777', marginBottom: 5 }}>{a.category}</div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, Noto Serif KR, Georgia, serif', fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 300, lineHeight: 1.45, wordBreak: 'keep-all', color: hov ? '#e8ddd0' : '#a09088', transition: 'color .2s' }}>{a.titleKo}</h3>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#666', marginTop: 6 }}>{a.date}</div>
      </Link>
    </div>
  );
}

function CardSmall({ a, rank, delay, isLast }: { a: Article; rank: number; delay: number; isLast: boolean }) {
  const { ref, v } = useReveal(delay);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{ flex: 1, borderBottom: isLast ? 'none' : '0.5px solid #222', opacity: v ? 1 : 0, transform: v ? 'translateX(0)' : 'translateX(14px)', transition: 'opacity .5s ease, transform .5s ease' }}>
      <Link href={`/article/${a.slug}`} style={{ display: 'flex', gap: 16, height: '100%', textDecoration: 'none', alignItems: 'center' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 17, fontWeight: 300, color: hov ? '#c9b99a' : '#777', minWidth: 24, flexShrink: 0, transition: 'color .2s' }}>{String(rank).padStart(2, '0')}</div>
        <div style={{ flex: '0 0 140px', height: 88, position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
          <Image src={a.image} alt={a.titleKo} fill sizes="140px" quality={75} style={{ objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .4s ease' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', color: '#666', marginBottom: 5 }}>{a.category}</div>
          <div style={{ fontFamily: 'Cormorant Garamond, Noto Serif KR, Georgia, serif', fontSize: 14, fontWeight: 300, color: hov ? '#e8ddd0' : '#b0a898', lineHeight: 1.4, wordBreak: 'keep-all', transition: 'color .2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.titleKo}</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#555', marginTop: 5 }}>{a.date}</div>
        </div>
      </Link>
    </div>
  );
}

function MobileHero({ a }: { a: Article }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 16 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingBottom: '55%', overflow: 'hidden' }}>
          <Image src={a.image} alt={a.titleKo} fill sizes="(max-width: 768px) 100vw, 1600px" quality={75} priority style={{ objectFit: 'cover', transform: hov ? 'scale(1.03)' : 'scale(1)', transition: 'transform .5s ease' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.15) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{ padding: '2px 8px', background: '#c9b99a', fontFamily: 'DM Sans, sans-serif', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', color: '#111' }}>주목 1위</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(201,185,154,.8)' }}>{a.category}</span>
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Noto Serif KR, Georgia, serif', fontSize: 18, fontWeight: 300, color: '#ede8e0', lineHeight: 1.4, wordBreak: 'keep-all' }}>{a.titleKo}</h3>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,.4)', marginTop: 6 }}>{a.date}{a.readTime ? ` · ${a.readTime}` : ''}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MobileCard({ a, rank }: { a: Article; rank: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/article/${a.slug}`} style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: 'relative', paddingBottom: '68%', overflow: 'hidden', borderRadius: 2, marginBottom: 8 }}>
        <Image src={a.image} alt={a.titleKo} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} style={{ objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .4s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.35) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 7, left: 8, fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,.9)', userSelect: 'none' }}>{String(rank).padStart(2, '0')}</div>
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: '#666', marginBottom: 4 }}>{a.category}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, Noto Serif KR, Georgia, serif', fontSize: 13, fontWeight: 300, color: hov ? '#e8ddd0' : '#aaa098', lineHeight: 1.5, wordBreak: 'keep-all', transition: 'color .2s', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{a.titleKo}</div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#555', marginTop: 5 }}>{a.date}</div>
    </Link>
  );
}

export function EditorPickSection() {
  const picks = getPicks();
  if (picks.length === 0) return null;

  const [p1, p2, p3, p4, p5, p6, p7] = picks;

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerV, setHeaderV] = useState(false);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderV(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="ep-sec" style={{ position: 'relative', borderTop: '0.5px solid #1a1a1a', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,185,154,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,80px)' }}>

        <div ref={headerRef} style={{
          display: 'flex', flexWrap: 'wrap' as const,
          alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
          marginBottom: 'clamp(28px,4vw,44px)',
          paddingBottom: 'clamp(20px,2.5vw,28px)',
          borderBottom: '0.5px solid #1a1a1a',
          opacity: headerV ? 1 : 0,
          transform: headerV ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity .5s ease, transform .5s ease',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#666' }}>주목</span>
              <div style={{ width: 28, height: 0.5, background: '#2e2e2e' }} />
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Noto Serif KR, Georgia, serif', fontSize: 'clamp(22px,3vw,34px)', fontWeight: 300, lineHeight: 1.2, color: '#ede8e0', wordBreak: 'keep-all' }}>
              <em style={{ fontStyle: 'italic', color: '#c9b99a' }}>지금 주목할 아티클</em>
            </h2>
          </div>
          <div style={{ textAlign: 'right' as const }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 300, color: '#555', lineHeight: 1.75 }}>
              최신성·다양성·수동 추천을 반영해 선정<br />매일 업데이트됩니다
            </p>
            <Link href="/archive" className="ep-more-btn">전체 아티클 보기 →</Link>
          </div>
        </div>

        {/* PC */}
        <div className="ep-desk" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'stretch' }}>
          <div style={{ paddingRight: 'clamp(24px,3.5vw,56px)', borderRight: '0.5px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: 'clamp(20px,2.5vw,36px)' }}>
            {p1 && <CardLarge a={p1} />}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px,2vw,28px)' }}>
              {p2 && <CardMedium a={p2} rank={2} delay={100} />}
              {p3 && <CardMedium a={p3} rank={3} delay={180} />}
            </div>
          </div>
          <div style={{ paddingLeft: 'clamp(24px,3.5vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            {([p4, p5, p6, p7] as (Article | undefined)[]).map((a, i) =>
              a ? <CardSmall key={a.id} a={a} rank={i + 4} delay={i * 70} isLast={i === 3} /> : null
            )}
          </div>
        </div>

        {/* 모바일 */}
        <div className="ep-mob">
          {p1 && <MobileHero a={p1} />}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 14px', marginTop: 4 }}>
            {([p2, p3, p4, p5, p6, p7] as (Article | undefined)[]).map((a, i) =>
              a ? <MobileCard key={a.id} a={a} rank={i + 2} /> : null
            )}
          </div>
          <Link href="/archive" className="ep-more-mob">전체 아티클 보기 →</Link>
        </div>

      </div>
    </section>
  );
}