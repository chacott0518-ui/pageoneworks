'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { articles, categories } from '@/lib/data';
import { getLatestArticles } from '@/lib/article-selectors';

export default function ArchiveClient() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [shown, setShown] = useState(12);

  const filtered = activeFilter
    ? getLatestArticles(articles.filter((a) => a.categorySlug === activeFilter))
    : getLatestArticles(articles);

  const displayList = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;
  const progress = Math.round((displayList.length / filtered.length) * 100);

  const handleFilter = (slug: string | null) => {
    setActiveFilter(slug);
    setShown(12);
  };

  const handleLoadMore = () => {
    setShown((prev) => Math.min(prev + 12, filtered.length));
  };

  return (
    <>
      <Header />
      <main>

        {/* 상단 헤더 */}
        <section className="pt-28 md:pt-32 pb-8 md:pb-12 px-5 md:px-12 bg-[#0d0d0d]">
          <div className="max-w-[1600px] mx-auto">
            <p
              className="text-cream/40 mb-3 uppercase"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em' }}
            >
              Archive · 아카이브
            </p>
            <h1
              className="font-light text-cream"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.2rem, 8vw, 5rem)' }}
            >
              전체 아티클
            </h1>
            <p
              className="text-cream/25 mt-2 uppercase"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.2em' }}
            >
              총 {filtered.length}개 아티클
            </p>
          </div>
        </section>

        {/* 카테고리 필터 탭 — PC·모바일 좌우 스크롤 */}
        <section className="sticky top-0 z-30 bg-[#0d0d0d] border-b border-white/5 px-5 md:px-12 py-3">
          <div className="max-w-[1600px] mx-auto">
          <div style={{ position: 'relative' }}>
            <div
              style={{ display: 'flex', gap: '8px', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', userSelect: 'none', paddingRight: '48px', paddingBottom: '2px' }}
              onMouseDown={(e) => { const el = e.currentTarget; el.dataset.down = '1'; el.dataset.startX = String(e.pageX - el.offsetLeft); el.dataset.sl = String(el.scrollLeft); el.style.cursor = 'grabbing'; }}
              onMouseLeave={(e) => { e.currentTarget.dataset.down = '0'; e.currentTarget.style.cursor = 'grab'; }}
              onMouseUp={(e) => { e.currentTarget.dataset.down = '0'; e.currentTarget.style.cursor = 'grab'; }}
              onMouseMove={(e) => { const el = e.currentTarget; if (el.dataset.down !== '1') return; e.preventDefault(); el.scrollLeft = Number(el.dataset.sl) - (e.pageX - el.offsetLeft - Number(el.dataset.startX)); }}
            >
              <button onClick={() => handleFilter(null)} className={`shrink-0 uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${!activeFilter ? 'border-cream text-cream' : 'border-white/15 text-cream/40 hover:border-white/30 hover:text-cream/70'}`} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.15em' }}>ALL</button>
              {categories.filter((cat) => cat.slug !== 'archive').map((cat) => (
                <button key={cat.slug} onClick={() => handleFilter(cat.slug)} className={`shrink-0 uppercase px-3 py-1.5 border transition-colors whitespace-nowrap ${activeFilter === cat.slug ? 'border-cream text-cream' : 'border-white/15 text-cream/40 hover:border-white/30 hover:text-cream/70'}`} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.15em' }}>{cat.title}</button>
              ))}
              <span className="shrink-0 w-8" />
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to right, transparent, #0d0d0d)', pointerEvents: 'none' }} />
          </div>
          </div>
        </section>

        {/* 아티클 그리드 */}
        <section className="py-6 md:py-14 px-5 md:px-12 bg-[#0a0a0a] min-h-[60vh]">
          <div className="max-w-[1600px] mx-auto">

            <div className="flex items-center justify-between mb-5 md:mb-8">
              <p
                className="text-cream/25 uppercase"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.15em' }}
              >
                {displayList.length}개 표시 중 / 전체 {filtered.length}개
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p
                  className="text-cream/30 uppercase"
                  style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em' }}
                >
                  이 카테고리에 아티클이 없습니다.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-6">
                  {displayList.map((article) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group block active:opacity-80 transition-opacity"
                    >
                      <div
                        className="overflow-hidden mb-2 md:mb-3 bg-[#1a1a1a]"
                        style={{ aspectRatio: '4/3' }}
                      >
                        <img
                          src={article.image}
                          alt={article.titleKo}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <p
                        className="text-cream/35 group-hover:text-cream/70 mb-1 uppercase transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.12em' }}
                      >
                        {article.category}
                      </p>

                      <h3
                        className="font-light text-cream group-hover:italic transition-all duration-200 leading-snug line-clamp-2"
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)',
                          lineHeight: '1.35',
                          wordBreak: 'keep-all',
                        }}
                      >
                        {article.titleKo}
                      </h3>

                      <p
                        className="hidden md:block text-cream/30 mt-1.5 leading-relaxed line-clamp-2"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontWeight: 300,
                          fontSize: '0.78rem',
                          lineHeight: '1.6',
                        }}
                      >
                        {article.excerpt}
                      </p>

                      <p
                        className="mt-1.5 md:mt-2 uppercase"
                        style={{
                          fontFamily: 'var(--font-space-mono)',
                          fontSize: '7px',
                          letterSpacing: '0.08em',
                          color: 'rgba(245,242,237,0.22)',
                        }}
                      >
                        {article.date} · {article.readTime}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* 더 보기 */}
                <div className="flex flex-col items-center gap-3 mt-8 md:mt-10">
                  <p
                    className="text-cream/20 uppercase"
                    style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.15em' }}
                  >
                    {displayList.length} / {filtered.length} 아티클
                  </p>

                  <div style={{ width: '200px', height: '1px', background: 'rgba(255,255,255,0.18)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '1px', width: `${progress}%`, background: '#f5f2ed', transition: 'width 0.5s ease' }} />
                  </div>

                  {hasMore ? (
                    <button
                      onClick={handleLoadMore}
                      className="mt-2 border border-cream/20 text-cream/50 hover:border-cream/50 hover:text-cream uppercase transition-all w-full max-w-[280px] md:max-w-[240px] py-3.5 md:py-4"
                      style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em' }}
                    >
                      더 보기 →
                    </button>
                  ) : (
                    <p
                      className="mt-2 uppercase"
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '8px',
                        letterSpacing: '0.2em',
                        color: 'rgba(245,242,237,0.18)',
                      }}
                    >
                      모든 아티클을 확인했습니다
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}