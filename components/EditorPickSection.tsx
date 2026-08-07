'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { articles } from '@/lib/data';
import type { Article } from '@/lib/data';
import { getSpotlightArticles } from '@/lib/article-selectors';
import { MANUAL_SPOTLIGHT_SLUGS } from '@/lib/editorPicks';
import './EditorPickSection.css';

function getPicks(): Article[] {
  return getSpotlightArticles(articles, {
    count: 7,
    manualSlugs: MANUAL_SPOTLIGHT_SLUGS,
  });
}

function useReveal(delay = 0, slide = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setV(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return { ref, v, cls: `epick-reveal${slide ? ' epick-reveal--slide' : ''}${v ? ' epick-reveal--on' : ''}` };
}

function PickMeta({ a, dark }: { a: Article; dark?: boolean }) {
  return (
    <p className={`epick-meta${dark ? ' epick-meta--dark' : ''}`}>
      <span>{a.category}</span>
      <span className="epick-meta-dot">·</span>
      <time dateTime={a.date.replace(/\./g, '-')}>{a.date}</time>
      {a.readTime && (
        <>
          <span className="epick-meta-dot">·</span>
          <span>{a.readTime}</span>
        </>
      )}
    </p>
  );
}

function CardLarge({ a }: { a: Article }) {
  const { ref, cls } = useReveal(0);
  return (
    <div ref={ref} className={cls}>
      <Link href={`/article/${a.slug}`} className="epick-card-link">
        <span className="epick-rank">01</span>
        <div className="epick-media epick-media--featured">
          <Image
            src={a.heroImage ?? a.image}
            alt={a.titleKo}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
            priority
            unoptimized={a.image.startsWith('https://')}
            className="epick-img"
          />
          <div className="epick-overlay" />
          <span className="epick-badge">NEW</span>
          <div className="epick-body">
            <PickMeta a={a} />
            <h3 className="epick-title-featured">{a.titleKo}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CardMedium({ a, rank, delay }: { a: Article; rank: number; delay: number }) {
  const { ref, cls } = useReveal(delay);
  return (
    <div ref={ref} className={cls}>
      <Link href={`/article/${a.slug}`} className="epick-card-link">
        <span className="epick-rank epick-rank--md">{String(rank).padStart(2, '0')}</span>
        <div className="epick-media epick-media--medium">
          <Image
            src={a.image}
            alt={a.titleKo}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            quality={75}
            unoptimized={a.image.startsWith('https://')}
            className="epick-img"
          />
          <div className="epick-overlay" />
          <div className="epick-body">
            <span className="epick-cat-sm">{a.category}</span>
            <h3 className="epick-title-medium">{a.titleKo}</h3>
            <time className="epick-date-sm" dateTime={a.date.replace(/\./g, '-')}>
              {a.date}
            </time>
          </div>
        </div>
      </Link>
    </div>
  );
}

function CardSmall({ a, rank, delay, isLast }: { a: Article; rank: number; delay: number; isLast: boolean }) {
  const { ref, cls } = useReveal(delay, true);
  return (
    <div ref={ref} className={`epick-list-item ${cls}${isLast ? ' epick-list-item--last' : ''}`}>
      <Link href={`/article/${a.slug}`} className="epick-list-link">
        <span className="epick-rank epick-rank--gold">{String(rank).padStart(2, '0')}</span>
        <div className="epick-list-thumb">
          <Image src={a.image} alt={a.titleKo} fill sizes="160px" quality={75} unoptimized={a.image.startsWith('https://')} className="epick-img" />
        </div>
        <div className="epick-list-text">
          <PickMeta a={a} dark />
          <h3 className="epick-title-list">{a.titleKo}</h3>
        </div>
      </Link>
    </div>
  );
}

function MobileFeatured({ a }: { a: Article }) {
  return (
    <Link href={`/article/${a.slug}`} className="epick-mob-featured">
      <div className="epick-media epick-media--mob">
        <Image
          src={a.heroImage ?? a.image}
          alt={a.titleKo}
          fill
          sizes="100vw"
          quality={80}
          priority
          unoptimized={a.image.startsWith('https://')}
          className="epick-img"
        />
        <div className="epick-overlay" />
        <span className="epick-badge">NEW</span>
        <div className="epick-body">
          <PickMeta a={a} />
          <h3 className="epick-mob-title">{a.titleKo}</h3>
        </div>
      </div>
    </Link>
  );
}

function MobileListItem({ a, rank }: { a: Article; rank: number }) {
  return (
    <Link href={`/article/${a.slug}`} className="epick-mob-list-link">
      <span className="epick-rank epick-rank--gold">{String(rank).padStart(2, '0')}</span>
      <div className="epick-mob-thumb">
        <Image src={a.image} alt={a.titleKo} fill sizes="96px" quality={75} unoptimized={a.image.startsWith('https://')} className="epick-img" />
      </div>
      <div className="epick-mob-list-text">
        <span className="epick-cat-sm">{a.category}</span>
        <h3 className="epick-mob-title-list">{a.titleKo}</h3>
        <p className="epick-mob-meta">
          <time dateTime={a.date.replace(/\./g, '-')}>{a.date}</time>
          {a.readTime ? ` · ${a.readTime}` : ''}
        </p>
      </div>
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
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderV(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="ep-sec" aria-label="이번 주 꼭 읽어야 할 아티클" style={{ position: 'relative', borderTop: '0.5px solid #1a1a1a', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,185,154,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="epick-inner">
        <header
          ref={headerRef}
          className="epick-header"
          style={{
            opacity: headerV ? 1 : 0,
            transform: headerV ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <p className="epick-kicker">Editor&apos;s Pick</p>
            <h2 className="epick-heading">이번 주 꼭 읽어야 할 아티클</h2>
          </div>
          <Link href="/archive" className="epick-more-btn epick-header-more">
            더 많은 아티클 보기
          </Link>
        </header>

        <div className="ep-desk epick-desk">
          <div className="epick-desk-left">
            {p1 && <CardLarge a={p1} />}
            <div className="epick-desk-mid">
              {p2 && <CardMedium a={p2} rank={2} delay={100} />}
              {p3 && <CardMedium a={p3} rank={3} delay={180} />}
            </div>
          </div>
          <div className="epick-desk-right">
            {([p4, p5, p6, p7] as (Article | undefined)[]).map((a, i) =>
              a ? <CardSmall key={a.id} a={a} rank={i + 4} delay={i * 70} isLast={i === 3} /> : null,
            )}
          </div>
        </div>

        <div className="ep-mob epick-mob-body">
          {p1 && <MobileFeatured a={p1} />}
          <div>
            {([p4, p5, p6, p7] as (Article | undefined)[]).map((a, i) =>
              a ? <MobileListItem key={a.id} a={a} rank={i + 4} /> : null,
            )}
          </div>
          <Link href="/archive" className="epick-more-mob">
            더 많은 아티클 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
