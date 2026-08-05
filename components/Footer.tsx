'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/site.config';

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

        {/* 사업자 정보 — PC: 한 줄 / 모바일: 두 줄 */}
        <div className="pt-6 pb-4 border-t border-white/5">
  <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-1.5 md:gap-x-6">
    <p
      className="text-[7px] uppercase tracking-wider leading-relaxed"
      style={{ fontFamily: 'var(--font-space-mono)', color: 'rgba(245,242,237,0.18)' }}
    >
      USENAD Co., Ltd. &nbsp;|&nbsp; CEO : Kim Se-jun &nbsp;|&nbsp; 
      Business Reg. No. 206-31-95055 &nbsp;|&nbsp; 
      TEL : {siteConfig.phone.display} &nbsp;|&nbsp;
      chacott0518@gmail.com
    </p>
    <p
      className="text-[7px] uppercase tracking-wider leading-relaxed"
      style={{ fontFamily: 'var(--font-space-mono)', color: 'rgba(245,242,237,0.18)' }}
    >
      7F, Ewha Bldg, 463-2 Jangan-dong, Dongdaemun-gu, Seoul, Republic of Korea
    </p>
  </div>
</div>

        {/* 하단 바 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-5 border-t border-white/5">
          <p
            className="text-cream/20 text-[7px] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            © {new Date().getFullYear()} USENAD Co., Ltd. All Rights Reserved. &nbsp;|&nbsp; Operated by PAGEONEWORKS
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