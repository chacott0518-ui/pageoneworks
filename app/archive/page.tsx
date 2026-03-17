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
        <section className="pt-32 pb-16 px-6 md:px-12 bg-[#0d0d0d]">
          <div className="max-w-[1600px] mx-auto">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/40 mb-5"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Archive · 아카이브
            </p>
            <h1
              className="text-5xl md:text-7xl font-light text-cream"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              전체 아티클
            </h1>
          </div>
        </section>

        {/* Filter bar */}
        <section className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4">
          <div className="max-w-[1600px] mx-auto flex gap-3 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveFilter(null)}
              className={`shrink-0 font-mono text-[8px] uppercase tracking-widest px-4 py-2 border transition-colors ${
                !activeFilter
                  ? 'border-cream text-cream'
                  : 'border-white/15 text-cream/40 hover:border-white/30'
              }`}
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveFilter(cat.slug)}
                className={`shrink-0 font-mono text-[8px] uppercase tracking-widest px-4 py-2 border transition-colors ${
                  activeFilter === cat.slug
                    ? 'border-cream text-cream'
                    : 'border-white/15 text-cream/40 hover:border-white/30'
                }`}
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </section>

        {/* Articles list */}
        <section className="py-16 md:py-20 px-6 md:px-12 bg-[#0a0a0a] min-h-[60vh]">
          <div className="max-w-[1600px] mx-auto">
            <ul className="divide-y divide-white/5">
              {filtered.map((article, i) => (
                <li key={article.id}>
                  <Link
                    href={`/article/${article.slug}`}
                    className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-8 hover:pl-2 transition-all duration-300"
                  >
                    <div className="flex items-start md:items-center gap-6 md:gap-10 flex-1 min-w-0">
                      <span
                        className="font-mono text-[9px] opacity-25 group-hover:opacity-50 transition-opacity shrink-0 pt-1 md:pt-0"
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-mono text-[8px] uppercase tracking-widest text-cream/40 mb-2"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          {article.category}
                        </p>
                        <h3
                          className="text-xl md:text-2xl font-light text-cream line-clamp-2 group-hover:italic transition-all"
                          style={{ fontFamily: 'var(--font-cormorant)', wordBreak: 'keep-all' }}
                        >
                          {article.titleKo}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 ml-10 md:ml-0">
                      <span
                        className="font-mono text-[8px] uppercase tracking-widest text-cream/30"
                        style={{ fontFamily: 'var(--font-space-mono)' }}
                      >
                        {article.date}
                      </span>
                      <span
                        className="font-mono text-[8px] uppercase tracking-widest text-cream/30 hidden md:block"
                        style={{ fontFamily: 'var(--font-space-mono)' }}
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
                <p className="font-mono text-[9px] uppercase tracking-widest text-cream/30">
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
