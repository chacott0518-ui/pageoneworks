'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/data';

export function CategoryShowcase() {
  const mainCats = categories.slice(0, 8);
  const archiveCat = categories[8];

  return (
    <section
      className="py-14 md:py-24 px-5 md:px-8 bg-[#f8f7f4]"
      aria-labelledby="category-section-title"
    >
      <div className="max-w-[1600px] mx-auto">

        <div className="mb-8 md:mb-12">
          <p
            className="text-ink/35 text-[8px] uppercase tracking-[0.3em] mb-2"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            Explore by Category
          </p>
          <h2
            id="category-section-title"
            className="text-3xl md:text-4xl font-light text-ink"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            카테고리별 탐색
          </h2>
        </div>

        {/* PC: 01~08 2열 × 4행 */}
        <div className="hidden md:grid md:grid-cols-2 gap-3">
          {mainCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden h-[220px]"
              aria-label={`${cat.title} — ${cat.descKo}`}
            >
              <img
                src={cat.image}
                alt={`${cat.titleKo} | ${cat.descKo} — PAGEONEWORKS 프리미엄 매거진`}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
                width={800}
                height={220}
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

        {/* PC: 09 ARCHIVE 풀와이드 */}
        {archiveCat && (
          <div className="hidden md:block mt-3">
            <Link
              href="/archive"
              className="group relative overflow-hidden h-[220px] w-full block"
              aria-label="ARCHIVE — 전체 아티클 저장소"
            >
              <img
                src={archiveCat.image}
                alt="PAGEONEWORKS 전체 아티클 아카이브 — 프리미엄 매거진 콘텐츠 모음"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
                width={1600}
                height={160}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20 group-hover:from-black/55 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="flex items-baseline gap-5">
                  <p
                    className="text-cream/40 text-[7px] uppercase tracking-[0.28em]"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {archiveCat.id}
                  </p>
                  <div>
                    <h3
                      className="text-cream text-xl md:text-2xl font-medium tracking-tight leading-tight"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {archiveCat.title}
                    </h3>
                    <p
                      className="text-cream/45 text-[10px] mt-0.5"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {archiveCat.descKo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-cream/60 group-hover:text-cream transition-colors duration-300">
                  <span
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    전체 보기
                  </span>
                  <div className="w-8 h-8 rounded-full border border-cream/30 flex items-center justify-center group-hover:border-cream group-hover:bg-cream/10 transition-all duration-300">
                    <ArrowRight className="w-3 h-3 text-cream" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 모바일: 01~08 2열 × 4행 */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {mainCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-sm"
              style={{ aspectRatio: '4/3' }}
              aria-label={`${cat.title} — ${cat.titleKo}`}
            >
              <img
                src={cat.image}
                alt={`${cat.titleKo} | ${cat.descKo} — PAGEONEWORKS`}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
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

        {/* 모바일: 09 ARCHIVE 풀와이드 */}
        {archiveCat && (
          <div className="md:hidden mt-2">
            <Link
              href="/archive"
              className="group relative overflow-hidden rounded-sm block w-full"
              style={{ aspectRatio: '4/3' }}
              aria-label="ARCHIVE — 전체 아티클"
            >
              <img
                src={archiveCat.image}
                alt="PAGEONEWORKS 전체 아티클 아카이브"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
                width={800}
                height={300}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <div>
                  <p
                    className="text-cream/40 text-[6px] uppercase tracking-[0.2em] mb-0.5"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {archiveCat.id}
                  </p>
                  <h3
                    className="text-cream text-sm font-medium leading-tight"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {archiveCat.title}
                  </h3>
                  <p
                    className="text-cream/50 text-[8px] mt-0.5"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {archiveCat.descKo}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full border border-cream/30 flex items-center justify-center group-hover:border-cream group-hover:bg-cream/10 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 text-cream" />
                </div>
              </div>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}