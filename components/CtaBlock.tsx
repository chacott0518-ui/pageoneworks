'use client';

export default function CtaBlock() {
  return (
    <div className="relative my-12 overflow-hidden rounded-[20px] border border-[#2a2a2c] bg-[#0F0F10] px-6 py-10 md:px-12 md:py-[52px]">

      {/* 장식 원 */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C9A96E] opacity-[0.05]" />

      {/* 아이웨어 뱃지 */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.12)] px-4 py-1.5 text-[11px] font-medium tracking-wider text-[#C9A96E]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A96E]" />
        PAGEONEWORKS SEO·GEO 전문 서비스
      </div>

      {/* 헤드라인 */}
      <h3 className="mb-3 text-[20px] font-bold leading-snug tracking-tight text-white md:text-[26px]">
        구글 AI 오버뷰·네이버 AI 브리핑,<br />
        지금 바로 상위에 올리세요.
      </h3>

      {/* 서브 텍스트 */}
      <p className="mb-8 text-[13px] leading-relaxed text-white/40 md:text-sm">
        15년 노하우 · 삼성전자·롯데·SK쉴더스 등 500+ 프로젝트 완료
        <br className="hidden md:block" />
        GEO·SEO·AIEO 통합 전략 무료 진단 제공합니다.
      </p>

      {/* CTA 버튼 */}
      <a href="tel:02-739-5415"
        className="
          inline-flex w-full items-center justify-center gap-2.5
          rounded-xl bg-[#C9A96E] px-8 py-4
          text-[15px] font-bold tracking-tight text-[#0F0F10]
          transition-all duration-[180ms] ease-out
          hover:-translate-y-0.5 hover:bg-[#dfc07e]
          hover:shadow-[0_8px_24px_rgba(201,169,110,0.35)]
          active:scale-[0.97] active:translate-y-0 active:bg-[#b89660]
          active:shadow-[0_2px_8px_rgba(201,169,110,0.18)]
          md:w-auto
        "
      >
        <svg
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        SEO·GEO 무료 상담 신청하기
      </a>

      {/* 신뢰 배지 */}
      <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-5">
        {[
          '무료 진단 제공',
          '평일 09:00–18:00',
          '즉시 응답 가능',
          '광고비 0원 구조 설계',
        ].map((item) => (
          <span key={item} className="flex items-center gap-1.5 text-[11px] text-white/35">
            <span className="text-[#C9A96E] text-xs">✓</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}