'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown } from 'lucide-react';

const mainNav = [
  { label: 'VITALITY', slug: 'vitality', ko: '의료·안티에이징·병원' },
  { label: 'PROPERTIES', slug: 'properties', ko: '프리미엄 부동산' },
  { label: 'DRIVE & TECH', slug: 'drive-tech', ko: '모빌리티·AI' },
  { label: 'LEGAL & FINANCE', slug: 'legal-finance', ko: '세무·법률·자산' },
  { label: 'LIFESTYLE & TRAVEL', slug: 'lifestyle-travel', ko: '라이프·여행·미식·골프' },
  { label: 'ARCHIVE', slug: 'archive', ko: '전체 아티클' },
];

const extraNav = [
  { label: 'COMMUNITY', slug: 'community', ko: '커뮤니티' },
  { label: 'NOTICE', slug: 'notice', ko: '공지사항' },
  { label: 'ABOUT', slug: 'about', ko: '소개' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black/60 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between gap-4">

          {/* 로고 */}
          <Link href="/" className="flex flex-col leading-none group shrink-0">
            <span
              className="text-cream font-semibold uppercase group-hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', letterSpacing: '0.18em' }}
            >
              PAGEONEWORKS
            </span>
            <span
              className="text-cream/40 mt-0.5 uppercase"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em' }}
            >
              Premium Magazine
            </span>
          </Link>

          {/* PC 네비 */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 flex-1 justify-center">
            {mainNav.map((item) => (
              <Link
                key={item.slug}
                href={getHref(item.slug)}
                className="text-cream/65 hover:text-cream font-medium uppercase transition-colors whitespace-nowrap"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.08em' }}
              >
                {item.label}
              </Link>
            ))}

            <span className="text-cream/15 text-sm">|</span>

            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="flex items-center gap-1 text-cream/65 hover:text-cream font-medium uppercase transition-colors whitespace-nowrap"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.08em' }}
              >
                MORE
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 shadow-xl z-50">
                  {extraNav.map((item) => (
                    <Link
                      key={item.slug}
                      href={getHref(item.slug)}
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <span className="text-cream/85" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px' }}>
                        {item.label}
                      </span>
                      <span className="text-cream/30 mt-0.5" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px' }}>
                        {item.ko}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* 우측 */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/community"
              className="hidden md:inline-flex items-center border border-cream/25 text-cream/65 hover:border-cream/60 hover:text-cream uppercase transition-all whitespace-nowrap px-3 py-1.5"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
            >
              구독하기
            </Link>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
              className="flex flex-col justify-center gap-[5px] w-8 h-8 lg:hidden"
            >
              <span className="block w-5 h-px bg-cream" />
              <span className="block w-5 h-px bg-cream" />
              <span className="block w-3.5 h-px bg-cream" />
            </button>
          </div>
        </div>
      </header>

      {/* 딤 */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-[49] bg-black/50 transition-opacity duration-300 lg:hidden ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 모바일 드로어 */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[51] w-[80vw] max-w-[320px] bg-[#1c1c1c] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 shrink-0">
          <span
            className="text-cream/50 uppercase tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px' }}
          >
            Menu
          </span>
          <button onClick={() => setDrawerOpen(false)} className="text-cream/50 hover:text-cream transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-cream/30 uppercase tracking-[0.25em] mb-4" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px' }}>
            Categories
          </p>
          {mainNav.map((item, i) => (
            <Link
              key={item.slug}
              href={getHref(item.slug)}
              onClick={() => setDrawerOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-white/8"
            >
              <div className="flex items-center gap-3">
                <span className="text-cream/25 w-5 shrink-0" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-cream font-light group-hover:italic transition-all duration-200" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '18px' }}>
                    {item.label}
                  </p>
                  <p className="text-cream/35 mt-0.5" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px' }}>
                    {item.ko}
                  </p>
                </div>
              </div>
              <span className="text-cream/25 text-sm group-hover:text-cream/60 transition-colors">→</span>
            </Link>
          ))}

          <div className="my-5 border-t border-white/10" />

          <p className="text-cream/30 uppercase tracking-[0.25em] mb-4" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px' }}>
            More
          </p>
          {extraNav.map((item) => (
            <Link
              key={item.slug}
              href={getHref(item.slug)}
              onClick={() => setDrawerOpen(false)}
              className="group flex items-center justify-between py-4 border-b border-white/8"
            >
              <div>
                <p className="text-cream/85 font-light group-hover:italic transition-all duration-200" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '17px' }}>
                  {item.label}
                </p>
                <p className="text-cream/30 mt-0.5" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px' }}>
                  {item.ko}
                </p>
              </div>
              <span className="text-cream/25 text-sm group-hover:text-cream/60 transition-colors">→</span>
            </Link>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-white/10 shrink-0">
          <Link
            href="/community"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center justify-center w-full border border-cream/25 text-cream/65 uppercase py-3.5 hover:border-cream/50 hover:text-cream transition-all"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.18em' }}
          >
            구독하기
          </Link>
          <p className="text-cream/20 uppercase tracking-widest text-center mt-3" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px' }}>
            © 2026 PAGEONEWORKS
          </p>
        </div>
      </div>
    </>
  );
}