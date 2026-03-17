'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { articles } from '@/lib/data';

const tabs = [
  { label: '전체', value: '전체' },
  { label: 'VITALITY', value: 'VITALITY' },
  { label: 'PROPERTIES', value: 'PROPERTIES' },
  { label: 'DRIVE & TECH', value: 'DRIVE & TECH' },
  { label: 'LEGAL & FINANCE', value: 'LEGAL & FINANCE' },
  { label: 'LIFESTYLE & TRAVEL', value: 'LIFESTYLE & TRAVEL' },
  { label: 'ARCHIVE', value: 'ARCHIVE' },
];

export function MagazineGrid() {
  const [activeTab, setActiveTab] = useState('전체');

  const filtered = activeTab === '전체'
    ? articles
    : articles.filter((a) => a.category === activeTab);

  const displayList = filtered.length > 0 ? filtered : articles;
  const main = displayList[0];
  const side = displayList.slice(1, 3);
  const bottom = displayList.slice(3, 7);
  const mobileSwipe = displayList.slice(1, 3);

  return (
    <section className="py-12 md:py-24 px-5 md:px-8 bg-[#111]">
      <div className="max-w-[1600px] mx-auto">

        <div className="mb-6 md:mb-10">
          <div className="flex items-end justify-between mb-5 pb-5 border-b border-white/8">
            <div>
              <h2
                className="font-light text-cream"
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
              >
                최신 아티클
              </h2>
              <p
                className="text-cream/35 mt-1 uppercase"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em' }}
              >
                Latest from the magazine
              </p>
            </div>
            <Link
              href="/archive"
              className="hidden md:flex items-center gap-1.5 text-cream/45 hover:text-cream uppercase transition-colors"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
            >
              전체보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`shrink-0 uppercase px-3 py-2 border transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'border-cream text-cream bg-cream/5'
                    : 'border-white/15 text-cream/40 hover:border-white/35 hover:text-cream/65'
                }`}
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PC 레이아웃 */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Link
              href={`/article/${main.slug}`}
              className="col-span-2 group relative overflow-hidden bg-black"
              style={{ aspectRatio: '4/3' }}
            >
              <img src={main.image} alt={main.titleKo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-black/50 text-cream/85 px-3 py-1.5 uppercase backdrop-blur-sm" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
                  {main.category}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-cream font-light leading-snug group-hover:italic transition-all duration-300" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                  {main.titleKo}
                </h3>
                <p className="text-cream/50 mt-2 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
                  {main.date} · {main.readTime}
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-3">
              {side.length > 0 ? side.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group relative overflow-hidden bg-black flex-1">
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img src={article.image} alt={article.titleKo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/50 text-cream/75 px-2 py-1 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-cream font-light leading-snug group-hover:italic transition-all duration-300" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)' }}>
                        {article.titleKo}
                      </h3>
                      <p className="text-cream/40 mt-1 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>
                        {article.date}
                      </p>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="flex-1 flex items-center justify-center border border-white/5">
                  <p className="text-cream/25 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px' }}>준비 중</p>
                </div>
              )}
            </div>
          </div>

          {bottom.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {bottom.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group">
                  <div className="relative overflow-hidden mb-3 bg-black" style={{ aspectRatio: '4/3' }}>
                    <img src={article.image} alt={article.titleKo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-black/60 text-cream/75 px-2 py-1 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-cream font-light leading-snug group-hover:italic transition-all duration-300 line-clamp-2" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>
                    {article.titleKo}
                  </h3>
                  <p className="text-cream/35 mt-1.5 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>
                    {article.date} · {article.readTime}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20 border border-white/5">
              <p className="text-cream/30 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em' }}>
                해당 카테고리 아티클 준비 중입니다
              </p>
            </div>
          )}
        </div>

        {/* 모바일 레이아웃 */}
        <div className="md:hidden">
          <Link href={`/article/${main.slug}`} className="group block relative overflow-hidden bg-black mb-3" style={{ aspectRatio: '3/2' }}>
            <img src={main.image} alt={main.titleKo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="bg-black/50 text-cream/85 px-2 py-1 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>
                {main.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-cream font-light leading-snug" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', wordBreak: 'keep-all' }}>
                {main.titleKo}
              </h3>
              <p className="text-cream/40 mt-1.5 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>
                {main.date} · {main.readTime}
              </p>
            </div>
          </Link>

          {mobileSwipe.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-5">
              {mobileSwipe.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`} className="group relative overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
                  <img src={article.image} alt={article.titleKo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/60 text-cream/85 px-1.5 py-1 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.06em' }}>
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-cream font-light leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(0.95rem, 4vw, 1.1rem)', wordBreak: 'keep-all' }}>
                      {article.titleKo}
                    </h3>
                    <p className="text-cream/35 mt-1 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.06em' }}>
                      {article.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/archive"
            className="flex items-center justify-center gap-2 border border-cream/15 text-cream/45 hover:border-cream/40 hover:text-cream/75 transition-colors py-4 uppercase"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            전체 아티클 보기 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </section>
  );
}