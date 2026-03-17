'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';
import { categories, articles } from '@/lib/data';

interface OverlayMenuProps {
  onClose: () => void;
}

export function OverlayMenu({ onClose }: OverlayMenuProps) {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const latestArticles = articles.slice(0, 3);
  const hoveredCategory = categories.find((c) => c.slug === hoveredCat);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-cream text-ink overflow-y-auto overflow-x-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      {hoveredCategory && (
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.08 }}>
          <img src={hoveredCategory.image} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col pt-28 md:pt-32 pb-8 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* 카테고리 */}
          <nav className="lg:col-span-7 flex flex-col justify-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40 mb-8" style={{ fontFamily: 'var(--font-space-mono)' }}>
              Categories
            </p>
            <ul className="flex flex-col gap-3 md:gap-4">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={handleClose}
                    onMouseEnter={() => setHoveredCat(cat.slug)}
                    onMouseLeave={() => setHoveredCat(null)}
                    className="group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-5 w-fit"
                  >
                    <div className="flex items-baseline gap-3 md:gap-5">
                      <span className="font-mono text-[9px] opacity-30 group-hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-space-mono)' }}>
                        {cat.id}
                      </span>
                      <span className="text-2xl md:text-3xl lg:text-[2.5rem] font-medium tracking-tight leading-tight group-hover:italic transition-all duration-300 text-ink" style={{ fontFamily: 'var(--font-cormorant)' }}>
                        {cat.title}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm italic opacity-50 group-hover:opacity-80 transition-opacity ml-8 md:ml-0" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {cat.titleKo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 우측 */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-8 md:gap-10">

            {/* 최신 아티클 */}
            <div>
              <div className="flex justify-between items-center mb-5 border-b border-ink/10 pb-3">
                <h3 className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-50" style={{ fontFamily: 'var(--font-space-mono)' }}>
                  Latest Articles
                </h3>
                <Link href="/archive" onClick={handleClose} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-space-mono)' }}>
                  전체보기 <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <ul className="flex flex-col gap-4">
                {latestArticles.map((article) => (
                  <li key={article.id}>
                    <Link href={`/article/${article.slug}`} onClick={handleClose} className="group flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium tracking-tight group-hover:italic transition-all duration-300 truncate" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem' }}>
                          {article.titleKo}
                        </p>
                        <p className="font-mono text-[8px] uppercase tracking-widest opacity-40 mt-1" style={{ fontFamily: 'var(--font-space-mono)' }}>
                          {article.category}
                        </p>
                      </div>
                      <span className="font-mono text-[8px] uppercase tracking-widest opacity-40 shrink-0 mt-1" style={{ fontFamily: 'var(--font-space-mono)' }}>
                        {article.date.slice(5)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 커뮤니티 CTA */}
            <div className="border border-ink/10 p-6 bg-white/60 backdrop-blur-sm">
              <p className="font-mono text-[8px] uppercase tracking-[0.25em] opacity-40 mb-3" style={{ fontFamily: 'var(--font-space-mono)' }}>
                Community
              </p>
              <h4 className="text-xl md:text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                프라이빗 커뮤니티
              </h4>
              <p className="text-xs opacity-60 leading-relaxed mb-5" style={{ fontFamily: 'var(--font-inter)' }}>
                PAGEONEWORKS 멤버십에 가입하고 프리미엄 인사이트를 가장 먼저 받아보세요.
              </p>
              <Link href="/community" onClick={handleClose} className="inline-flex items-center gap-2 bg-ink text-cream text-[9px] font-mono tracking-widest uppercase px-5 py-3 hover:bg-ink/80 transition-colors" style={{ fontFamily: 'var(--font-space-mono)' }}>
                멤버십 신청 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-10 pt-6 border-t border-ink/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-5 font-mono text-[9px] uppercase tracking-widest opacity-50">
            {['Cookie', 'Terms', 'Privacy'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} onClick={handleClose} className="hover:opacity-100 transition-opacity">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="p-2 border border-ink/10 rounded-full hover:bg-ink hover:text-cream transition-colors">
              <Instagram className="w-3 h-3" />
            </a>
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest opacity-30" style={{ fontFamily: 'var(--font-space-mono)' }}>
            &copy;{new Date().getFullYear()} PAGEONEWORKS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}