'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const categoryLinks = [
  { label: 'VITALITY', href: '/category/vitality' },
  { label: 'PROPERTIES', href: '/category/properties' },
  { label: 'DRIVE & TECH', href: '/category/drive-tech' },
  { label: 'LEGAL & FINANCE', href: '/category/legal-finance' },
  { label: 'LIFESTYLE', href: '/category/lifestyle' },
  { label: 'CULTURE', href: '/category/culture' },
  { label: 'TRAVEL', href: '/category/travel' },
  { label: 'ARCHIVE', href: '/archive' },
];

const siteLinks = [
  { label: '커뮤니티', href: '/community' },
  { label: '멤버십 신청', href: '/community#membership' },
  { label: '광고·제휴 문의', href: '/advertise' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
];

function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 md:hidden"
      >
        <span
          className="text-cream/40 text-[8px] uppercase tracking-[0.25em]"
          style={{ fontFamily: 'var(--font-space-mono)' }}
        >
          {title}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-cream/30 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 모바일: 아코디언 */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        {children}
      </div>

      {/* PC: 항상 보임 */}
      <div className="hidden md:block">
        <p
          className="text-cream/30 text-[8px] uppercase tracking-[0.25em] mb-5"
          style={{ fontFamily: 'var(--font-space-mono)' }}
        >
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#080808] text-cream pt-14 md:pt-20 pb-10 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">

        {/* 상단: 브랜드 */}
        <div className="mb-10 md:mb-14">
          <Link href="/">
            <h2
              className="text-3xl md:text-4xl font-light uppercase tracking-[0.15em] hover:opacity-70 transition-opacity"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              PAGEONEWORKS
            </h2>
          </Link>
          <p
            className="text-cream/25 text-[7px] uppercase tracking-[0.25em] mt-1.5 mb-4"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            Premium Magazine
          </p>
          <p
            className="text-cream/35 text-sm leading-relaxed max-w-sm"
            style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
          >
            의료·부동산·기술·금융·라이프스타일을 아우르는 프리미엄 웹매거진.
          </p>
        </div>

        {/* 링크 그리드 */}
        <div className="md:grid md:grid-cols-3 md:gap-12 mb-10">

          {/* 카테고리 */}
          <AccordionSection title="Categories">
            <ul className="flex flex-col gap-2.5">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/40 hover:text-cream text-[9px] uppercase tracking-[0.15em] transition-colors"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* 링크 */}
          <AccordionSection title="Links">
            <ul className="flex flex-col gap-2.5">
              {siteLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-cream/40 hover:text-cream text-[9px] uppercase tracking-[0.15em] transition-colors"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* 뉴스레터 */}
          <div className="mt-4 md:mt-0">
            <p
              className="hidden md:block text-cream/30 text-[8px] uppercase tracking-[0.25em] mb-5"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Newsletter
            </p>
            <p
              className="text-cream/40 text-xs leading-relaxed mb-4"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
            >
              프리미엄 인사이트를 가장 먼저 받아보세요.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center border border-cream/20 text-cream/50 hover:border-cream/50 hover:text-cream text-[8px] uppercase tracking-[0.18em] px-4 py-2.5 transition-all"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              구독 신청 →
            </Link>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-6 border-t border-white/5">
          <p
            className="text-cream/20 text-[7px] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            © {new Date().getFullYear()} PAGEONEWORKS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Cookie'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-cream/20 hover:text-cream/50 text-[7px] uppercase tracking-widest transition-colors"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}