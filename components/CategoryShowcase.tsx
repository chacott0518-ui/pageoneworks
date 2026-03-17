'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

export function CategoryShowcase() {
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-14 md:py-24 px-5 md:px-8 bg-[#f8f7f4]">
      <div className="max-w-[1600px] mx-auto">

        <div className="mb-8 md:mb-12">
          <p
            className="text-ink/35 text-[8px] uppercase tracking-[0.3em] mb-2"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            Explore by Category
          </p>
          <h2
            className="text-3xl md:text-4xl font-light text-ink"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            카테고리별 탐색
          </h2>
        </div>

        {/* PC: 2열 그리드 */}
        <div className="hidden md:grid md:grid-cols-2 gap-3">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug === 'archive' ? '/archive' : `/category/${cat.slug}`}
              className="group relative overflow-hidden h-[220px]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p
                      className="text-cream/45 text-[7px] uppercase tracking-[0.22em] mb-1.5"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      {cat.id} — {cat.titleKo}
                    </p>
                    <h3
                      className="text-cream text-xl md:text-2xl font-medium tracking-tight leading-tight"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {cat.title}
                    </h3>
                    <p
                      className="text-cream/50 text-[10px] mt-1"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {cat.descKo}
                    </p>
                  </div>
                  <div className="shrink-0 ml-3 w-8 h-8 rounded-full border border-cream/30 flex items-center justify-center group-hover:border-cream group-hover:bg-cream/10 transition-all duration-300">
                    <ArrowRight className="w-3 h-3 text-cream" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 모바일: 2열 작은 카드 */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.slug === 'archive' ? '/archive' : `/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-sm"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <p
                  className="text-cream/40 text-[6px] uppercase tracking-[0.2em] mb-0.5"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {cat.id}
                </p>
                <h3
                  className="text-cream text-sm font-medium leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {cat.title}
                </h3>
                <p
                  className="text-cream/50 text-[8px] mt-0.5 leading-tight"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {cat.titleKo}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}