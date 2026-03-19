'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const categoryNav = [
  { label: 'VITALITY', slug: 'vitality', ko: '의료·안티에이징·병원' },
  { label: 'PROPERTIES', slug: 'properties', ko: '프리미엄 부동산' },
  { label: 'DRIVE & TECH', slug: 'drive-tech', ko: '모빌리티·AI·IT' },
  { label: 'LEGAL & FINANCE', slug: 'legal-finance', ko: '세무·법률·자산' },
  { label: 'LIFESTYLE & TRAVEL', slug: 'lifestyle-travel', ko: '라이프·여행·골프' },
  { label: 'BEAUTY & WELLNESS', slug: 'beauty-wellness', ko: '뷰티·피부·성형' },
  { label: 'FOOD & DINING', slug: 'food-dining', ko: '미식·레스토랑·와인' },
  { label: 'EDUCATION', slug: 'education', ko: '교육·유학·자격증' },
  { label: 'ARCHIVE', slug: 'archive', ko: '전체 아티클' },
];

const moreNav = [
  { label: 'COMMUNITY', slug: 'community', ko: '커뮤니티' },
  { label: 'NOTICE', slug: 'notice', ko: '공지사항' },
  { label: 'ABOUT', slug: 'about', ko: '소개' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const getHref = (slug: string) => {
    if (['community', 'notice', 'about', 'archive'].includes(slug)) return `/${slug}`;
    return `/category/${slug}`;
  };

  const isActive = (slug: string) => {
    if (slug === 'archive') return pathname === '/archive';
    if (['community', 'notice', 'about'].includes(slug)) return pathname === `/${slug}`;
    return pathname === `/category/${slug}`;
  };

  return (
    <>
      {/* 헤더 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-black/70 backdrop-blur-sm'
        }`}
      >
        <div
          className="max-w-[1600px] mx-auto flex items-center justify-between"
          style={{ padding: '0 48px', height: '56px' }}
        >
          {/* 로고 */}
          <Link href="/" className="flex flex-col leading-none group shrink-0">
            <span
              className="text-cream uppercase group-hover:opacity-70 transition-opacity"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(13px, 1.5vw, 16px)',
                fontWeight: 500,
                letterSpacing: '0.18em',
                lineHeight: 1.2,
              }}
            >
              PAGEONEWORKS
            </span>
            <span
              className="text-cream/40 uppercase mt-1"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                lineHeight: 1,
              }}
            >
              Premium Magazine
            </span>
          </Link>

          {/* 우측 */}
          <div className="flex items-center" style={{ gap: '12px' }}>
            <Link
              href="/community"
              className="hidden md:inline-flex items-center border border-cream/25 text-cream/65 hover:border-cream/60 hover:text-cream uppercase transition-all"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '11px',
                letterSpacing: '0.12em',
                padding: '7px 14px',
                lineHeight: 1,
              }}
            >
              구독하기
            </Link>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
              className="flex flex-col items-end justify-center"
              style={{ gap: '5px', width: '32px', height: '32px' }}
            >
              <span className="block bg-cream" style={{ width: '20px', height: '1px' }} />
              <span className="block bg-cream" style={{ width: '20px', height: '1px' }} />
              <span className="block bg-cream" style={{ width: '14px', height: '1px' }} />
            </button>
          </div>
        </div>
      </header>

      {/* 딤 오버레이 */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[49] bg-black/60 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 드로어 */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[51] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: 'clamp(280px, 80vw, 360px)',
          backgroundColor: '#141414',
        }}
      >
        {/* 드로어 헤더 */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{
            padding: '0 24px',
            height: '56px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            className="text-cream/40 uppercase"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.28em',
              lineHeight: 1,
            }}
          >
            Menu
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-cream/40 hover:text-cream transition-colors"
            style={{ padding: '4px' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* 드로어 콘텐츠 */}
        <nav
          className="flex-1 overflow-y-auto"
          style={{ padding: '20px 24px' }}
        >
          {/* 카테고리 레이블 */}
          <p
            className="text-cream/30 uppercase"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.28em',
              lineHeight: 1,
              marginBottom: '12px',
            }}
          >
            Categories
          </p>

          {/* 카테고리 목록 */}
          {categoryNav.map((item, i) => {
            const active = isActive(item.slug);
            return (
              <Link
                key={item.slug}
                href={getHref(item.slug)}
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center justify-between transition-all duration-200"
                style={{
                  padding: 'clamp(10px, 1.5vh, 14px) 0',
                  paddingLeft: active ? '12px' : '0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: active ? '2px solid #1a1aff' : '2px solid transparent',
                }}
              >
                <div className="flex items-center" style={{ gap: '12px' }}>
                  <span
                    className="shrink-0"
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '9px',
                      color: 'rgba(245,242,237,0.2)',
                      width: '18px',
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p
                      className="group-hover:italic transition-all duration-200"
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: 'clamp(15px, 2vw, 18px)',
                        fontWeight: 300,
                        color: active ? '#f5f2ed' : 'rgba(245,242,237,0.75)',
                        lineHeight: 1.2,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '9px',
                        color: 'rgba(245,242,237,0.3)',
                        lineHeight: 1,
                        letterSpacing: '0.08em',
                        marginTop: '4px',
                      }}
                    >
                      {item.ko}
                    </p>
                  </div>
                </div>
                <span
                  className="group-hover:text-cream/60 transition-colors"
                  style={{
                    color: 'rgba(245,242,237,0.2)',
                    fontSize: '13px',
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
              </Link>
            );
          })}

          {/* 구분선 */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

          {/* MORE 레이블 */}
          <p
            className="text-cream/30 uppercase"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.28em',
              lineHeight: 1,
              marginBottom: '12px',
            }}
          >
            More
          </p>

          {/* MORE 목록 */}
          {moreNav.map((item) => {
            const active = isActive(item.slug);
            return (
              <Link
                key={item.slug}
                href={getHref(item.slug)}
                onClick={() => setDrawerOpen(false)}
                className="group flex items-center justify-between transition-all duration-200"
                style={{
                  padding: 'clamp(8px, 1.2vh, 12px) 0',
                  paddingLeft: active ? '12px' : '0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: active ? '2px solid #1a1aff' : '2px solid transparent',
                }}
              >
                <div>
                  <p
                    className="group-hover:italic transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: 'clamp(13px, 1.8vw, 15px)',
                      fontWeight: 300,
                      color: active ? '#f5f2ed' : 'rgba(245,242,237,0.55)',
                      lineHeight: 1.2,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '9px',
                      color: 'rgba(245,242,237,0.25)',
                      lineHeight: 1,
                      letterSpacing: '0.08em',
                      marginTop: '3px',
                    }}
                  >
                    {item.ko}
                  </p>
                </div>
                <span
                  className="group-hover:text-cream/50 transition-colors"
                  style={{
                    color: 'rgba(245,242,237,0.18)',
                    fontSize: '12px',
                  }}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* 드로어 하단 */}
        <div
          className="shrink-0"
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Link
            href="/community"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center w-full uppercase transition-all hover:border-cream/50 hover:text-cream"
            style={{
              border: '1px solid rgba(245,242,237,0.22)',
              color: 'rgba(245,242,237,0.6)',
              fontFamily: 'var(--font-space-mono)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              padding: '13px',
              lineHeight: 1,
            }}
          >
            구독하기
          </Link>
          <p
            className="text-center uppercase"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.18)',
              marginTop: '12px',
              lineHeight: 1,
            }}
          >
            © 2026 PAGEONEWORKS
          </p>
        </div>
      </div>
    </>
  );
}