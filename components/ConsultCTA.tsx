'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/site.config';

const ConsultModal = dynamic(() => import('@/components/ConsultModal'), { ssr: false });

const GOLD = '#C9A96E';

interface Props {
  categorySlug?: string;
  articleTitle?: string;
  category?: string;
}

export default function ConsultCTA({ articleTitle, category }: Props) {
  const [open, setOpen] = useState(false);
  const topic = articleTitle ?? category;

  return (
    <>
      <aside
        aria-label="PAGEONEWORKS 검색·AI 컨설팅 안내"
        className="my-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1018]
          px-5 py-8 md:px-11 md:py-12"
        style={{ boxSizing: 'border-box' }}
      >
        {/* 라벨 */}
        <p
          className="text-[11px] uppercase tracking-[0.22em]"
          style={{ fontFamily: 'var(--font-space-mono)', color: GOLD }}
        >
          PAGEONEWORKS SEARCH &amp; AI CONSULTING
        </p>

        {/* 제목 */}
        <h3 className="mt-4 text-[20px] font-semibold leading-snug text-white md:text-[26px]">
          ChatGPT·네이버·구글에서 우리 업체를 찾아보셨나요?
        </h3>

        {/* 강조 문장 */}
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/85 md:text-[16px]">
          찾아도 나오지 않거나 경쟁사만 보인다면 검색과 AI 노출 구조부터 점검해야 합니다.
        </p>

        {/* 설명 */}
        <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-white/55 md:text-[15px]">
          PAGEONEWORKS는 SEO·AEO·GEO·LLMEO, 콘텐츠와 Entity 구조를 함께 진단해 고객이 브랜드를 발견할 수 있는
          개선 순서를 설계합니다.
        </p>

        {/* 신뢰 문구 */}
        <p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-white/38">
          특정 순위와 AI 인용을 보장하지 않으며 현재 상태를 먼저 객관적으로 진단합니다.
        </p>

        {/* 버튼 영역 */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* 상담예약: 모든 화면 */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl px-7
              text-[15px] font-semibold text-[#0B1018] outline-none
              transition-transform hover:-translate-y-0.5 active:translate-y-0
              focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-offset-[#0B1018] focus-visible:ring-[#C9A96E]
              motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            style={{ background: GOLD }}
          >
            상담예약 하기
          </button>

          {/* 전화상담: 모바일 전용(md 이상 DOM에서 숨김). 전화번호 숫자 미노출. */}
          <a
            href={siteConfig.phone.href}
            aria-label="전화상담 연결"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl
              border border-white/20 px-7 text-[15px] font-medium text-white/85 outline-none
              transition-colors hover:border-white/40 hover:text-white
              focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50
              md:hidden"
          >
            <svg
              width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3
                a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91
                a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7
                A2 2 0 0 1 22 16.92z" />
            </svg>
            전화상담
          </a>
        </div>
      </aside>

      {open && <ConsultModal onClose={() => setOpen(false)} topic={topic} />}
    </>
  );
}
