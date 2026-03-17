'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const plans = [
  {
    tier: 'FREE',
    title: '무료 구독',
    desc: '주간 뉴스레터 + 아카이브 기본 접근',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&q=70',
    highlight: false,
  },
  {
    tier: 'PREMIUM',
    title: '프리미엄',
    desc: '전체 아티클 + 전문가 상담 + 이벤트',
    image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=200&q=70',
    highlight: true,
  },
  {
    tier: 'ENTERPRISE',
    title: '기업 구독',
    desc: '팀 계정 + 맞춤 리포트 + 광고 집행',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=70',
    highlight: false,
  },
];

export function CommunityCTA() {
  return (
    <section className="py-16 md:py-24 px-5 md:px-10 bg-ink text-cream border-t border-white/5">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* 좌측 */}
          <div>
            <p className="text-cream/30 text-[8px] uppercase tracking-[0.3em] mb-4" style={{ fontFamily: 'var(--font-space-mono)' }}>
              Community · 커뮤니티
            </p>
            <h2
              className="font-light leading-[1.15] mb-4"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              프리미엄 인사이트를
              <br />
              <em>가장 먼저</em> 받아보세요.
            </h2>
            <p className="text-cream/40 text-sm leading-relaxed max-w-md mb-8" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}>
              PAGEONEWORKS 멤버십은 의료·부동산·기술·금융 분야의 검증된 전문가 콘텐츠와 프라이빗 네트워킹 기회를 제공합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/community"
                className="inline-flex items-center justify-center gap-2 bg-cream text-ink px-6 py-3 text-[8px] uppercase tracking-[0.18em] hover:bg-cream/85 transition-colors"
                style={{ fontFamily: 'var(--font-space-mono)' }}>
                멤버십 신청 <ArrowRight className="w-3 h-3" />
              </Link>
              <Link href="/archive"
                className="inline-flex items-center justify-center gap-2 border border-cream/20 text-cream/60 px-6 py-3 text-[8px] uppercase tracking-[0.18em] hover:border-cream/40 hover:text-cream transition-all"
                style={{ fontFamily: 'var(--font-space-mono)' }}>
                아카이브 보기
              </Link>
            </div>
          </div>

          {/* 우측: 플랜 카드 — 가로형 컴팩트 */}
          <div className="flex flex-col gap-2.5">
            {plans.map((plan) => (
              <div key={plan.tier}
                className={`flex items-center gap-4 p-4 border transition-colors ${plan.highlight ? 'border-gold/40 bg-gold/5' : 'border-white/8 hover:border-white/15'}`}>

                {/* 썸네일 */}
                <div className="shrink-0 w-14 h-14 overflow-hidden">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" />
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-cream/35 text-[7px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-mono)' }}>
                      {plan.tier}
                    </p>
                    {plan.highlight && (
                      <span className="text-gold border border-gold/40 text-[6px] uppercase tracking-widest px-1.5 py-0.5" style={{ fontFamily: 'var(--font-space-mono)' }}>
                        추천
                      </span>
                    )}
                  </div>
                  <p className="text-cream text-base font-light leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {plan.title}
                  </p>
                  <p className="text-cream/35 text-[10px] leading-relaxed mt-0.5 line-clamp-1" style={{ fontFamily: 'var(--font-inter)' }}>
                    {plan.desc}
                  </p>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-cream/20 shrink-0" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}