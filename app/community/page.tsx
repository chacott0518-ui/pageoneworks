'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const plans = [
  {
    tier: 'FREE',
    title: '무료 구독',
    price: '₩0',
    period: '/ 영구',
    features: [
      '주간 뉴스레터',
      '아카이브 기본 접근',
      '카테고리 최신 아티클 (월 3편)',
    ],
    cta: '무료로 시작하기',
    highlight: false,
  },
  {
    tier: 'PREMIUM',
    title: '프리미엄 멤버십',
    price: '₩29,000',
    period: '/ 월',
    features: [
      '전체 아티클 무제한 접근',
      '전문가 1:1 상담 (월 1회)',
      '프라이빗 오프라인 이벤트 초청',
      '독점 리포트 & 데이터',
      '멤버 전용 커뮤니티 포럼',
    ],
    cta: '프리미엄 시작하기',
    highlight: true,
  },
  {
    tier: 'ENTERPRISE',
    title: '기업 구독',
    price: '문의',
    period: '',
    features: [
      '팀 계정 (최대 10명)',
      '맞춤형 인더스트리 리포트',
      '광고 지면 집행',
      '브랜드 콘텐츠 협업',
      '전담 매니저 배정',
    ],
    cta: '기업 문의하기',
    highlight: false,
  },
];

export default function CommunityPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', plan: 'PREMIUM', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Cursor에서 실제 API 연동 (e.g. Resend, Supabase)
    setSubmitted(true);
  };

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} theme="dark" />

      <main>
        {/* Hero */}
        <section className="relative min-h-[50vh] flex flex-col justify-end px-6 md:px-12 pb-16 pt-32 bg-[#0d0d0d]">
          <div className="max-w-[1600px] mx-auto">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.3em] text-cream/40 mb-5"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Community · 커뮤니티
            </p>
            <h1
              className="text-5xl md:text-7xl font-light text-cream leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              프리미엄 인사이트,
              <br />
              <em>가장 먼저.</em>
            </h1>
            <p
              className="mt-5 text-sm text-cream/50 max-w-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
            >
              PAGEONEWORKS 커뮤니티는 검증된 전문가 콘텐츠와 프라이빗 네트워킹을 제공하는
              멤버 전용 공간입니다.
            </p>
          </div>
        </section>

        {/* Membership plans */}
        <section id="membership" className="py-20 md:py-28 px-6 md:px-12 bg-[#0a0a0a] text-cream">
          <div className="max-w-[1600px] mx-auto">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40 mb-12"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Membership Plans
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.tier}
                  className={`p-8 border flex flex-col ${
                    plan.highlight
                      ? 'border-gold/40 bg-gold/5'
                      : 'border-white/8 bg-white/[0.02]'
                  }`}
                >
                  {plan.highlight && (
                    <span
                      className="font-mono text-[7px] uppercase tracking-widest text-gold border border-gold/40 px-2 py-1 w-fit mb-5"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      추천
                    </span>
                  )}
                  <p
                    className="font-mono text-[8px] uppercase tracking-widest opacity-40 mb-2"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {plan.tier}
                  </p>
                  <h3
                    className="text-2xl font-light mb-1"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {plan.title}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-8 mt-3 border-b border-white/8 pb-6">
                    <span
                      className="text-3xl font-light"
                      style={{ fontFamily: 'var(--font-cormorant)' }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs opacity-40" style={{ fontFamily: 'var(--font-inter)' }}>
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="w-3 h-3 shrink-0 mt-0.5 opacity-60" />
                        <span className="text-xs opacity-60 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setFormData((p) => ({ ...p, plan: plan.tier }))}
                    className={`w-full py-3.5 font-mono text-[9px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                      plan.highlight
                        ? 'bg-cream text-ink hover:bg-cream/80'
                        : 'border border-white/20 text-cream hover:border-white/50'
                    }`}
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {plan.cta} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Sign-up form */}
        <section className="py-20 md:py-28 px-6 md:px-12 bg-cream text-ink">
          <div className="max-w-[700px] mx-auto">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40 mb-8"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Sign Up · 신청하기
            </p>

            {submitted ? (
              <div className="text-center py-16">
                <p
                  className="text-3xl font-light mb-4"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  신청이 완료되었습니다.
                </p>
                <p className="text-sm opacity-50" style={{ fontFamily: 'var(--font-inter)' }}>
                  빠른 시일 내에 이메일로 안내드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-mono text-[8px] uppercase tracking-widest opacity-50"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      이름 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      className="border-b border-ink/20 bg-transparent py-3 text-sm focus:outline-none focus:border-ink transition-colors"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-mono text-[8px] uppercase tracking-widest opacity-50"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      이메일 *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="border-b border-ink/20 bg-transparent py-3 text-sm focus:outline-none focus:border-ink transition-colors"
                      style={{ fontFamily: 'var(--font-inter)' }}
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="font-mono text-[8px] uppercase tracking-widest opacity-50"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    플랜 선택
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData((p) => ({ ...p, plan: e.target.value }))}
                    className="border-b border-ink/20 bg-transparent py-3 text-sm focus:outline-none focus:border-ink transition-colors cursor-pointer"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <option value="FREE">무료 구독</option>
                    <option value="PREMIUM">프리미엄 멤버십 (₩29,000/월)</option>
                    <option value="ENTERPRISE">기업 구독 (문의)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="font-mono text-[8px] uppercase tracking-widest opacity-50"
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    문의사항 (선택)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    className="border-b border-ink/20 bg-transparent py-3 text-sm focus:outline-none focus:border-ink transition-colors resize-none"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    placeholder="궁금하신 점을 남겨주세요."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 self-start inline-flex items-center gap-3 bg-ink text-cream px-10 py-4 font-mono text-[9px] uppercase tracking-widest hover:bg-ink/80 transition-colors"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  신청하기 <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
