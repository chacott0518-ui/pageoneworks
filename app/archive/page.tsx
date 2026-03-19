'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { articles, categories } from '@/lib/data';

export default function ArchivePage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? articles.filter((a) => a.categorySlug === activeFilter)
    : articles;

  return (
    <>
      <Header />

      <main>
        {/* Header */}
        <section className="pt-28 md:pt-32 pb-10 md:pb-16 px-5 md:px-12 bg-[#0d0d0d]">
          <div className="max-w-[1600px] mx-auto">
            <p
              className="text-cream/40 mb-4 uppercase"
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
          </div>
        </section>

        {/* Filter bar */}
        <section className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5 px-5 md:px-12 py-3">
          <div className="max-w-[1600px] mx-auto flex gap-2 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveFilter(null)}
              className={`shrink-0 uppercase px-3 py-1.5 border transition-colors ${
                !activeFilter
                  ? 'border-cream text-cream'
                  : 'border-white/15 text-cream/40 hover:border-white/30'
              }`}
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.15em' }}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveFilter(cat.slug)}
                className={`shrink-0 uppercase px-3 py-1.5 border transition-colors ${
                  activeFilter === cat.slug
                    ? 'border-cream text-cream'
                    : 'border-white/15 text-cream/40 hover:border-white/30'
                }`}
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.15em' }}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </section>

        {/* Articles list */}
        <section className="py-10 md:py-20 px-5 md:px-12 bg-[#0a0a0a] min-h-[60vh]">
          <div className="max-w-[1600px] mx-auto">
            <ul className="divide-y divide-white/5">
              {filtered.map((article, i) => (
                <li key={article.id}>
                  <Link
                    href={`/article/${article.slug}`}
                    className="group flex items-center justify-between gap-3 py-4 md:py-8 hover:pl-1.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 md:gap-10 flex-1 min-w-0">
                      <span
                        className="opacity-25 group-hover:opacity-50 transition-opacity shrink-0"
                        style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-cream/40 mb-1 uppercase"
                          style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.12em' }}
                        >
                          {article.category}
                        </p>
                        <h3
                          className="font-light text-cream group-hover:italic transition-all leading-snug"
                          style={{
                            fontFamily: 'var(--font-cormorant)',
                            fontSize: 'clamp(0.95rem, 2vw, 1.5rem)',
                            wordBreak: 'keep-all',
                            lineHeight: '1.35',
                          }}
                        >
                          {article.titleKo}
                        </h3>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-6">
                      <span
                        className="text-cream/30"
                        style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}
                      >
                        {article.date}
                      </span>
                      <span
                        className="text-cream/30 hidden md:block"
                        style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.1em' }}
                      >
                        {article.readTime}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <p
                  className="text-cream/30 uppercase"
                  style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em' }}
                >
                  이 카테고리에 아티클이 없습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}