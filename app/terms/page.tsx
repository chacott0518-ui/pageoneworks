import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: '이용약관 | PAGEONEWORKS',
  description:
    'PAGEONEWORKS 서비스 이용약관. 서비스 제공 범위, 상담예약, 이용자 의무, 콘텐츠 저작권, 책임 범위 및 준거법을 안내합니다.',
  alternates: { canonical: 'https://www.pageoneworks.com/terms' },
  openGraph: {
    title: '이용약관 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 서비스 이용약관.',
    url: 'https://www.pageoneworks.com/terms',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '이용약관 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 서비스 이용약관.',
  },
};

const EFFECTIVE_DATE = '2026년 1월 1일';
const GOLD = '#C9A96E';

const sections: { id: string; title: string; body: string }[] = [
  {
    id: 'purpose',
    title: '1. 목적',
    body:
      '본 약관은 PAGEONEWORKS(이하 "사이트")가 제공하는 콘텐츠, 커뮤니티, 상담예약 등 제반 서비스의 이용과 관련하여 사이트와 이용자 간의 권리·의무 및 책임사항을 규정하는 것을 목적으로 합니다.',
  },
  {
    id: 'definition',
    title: '2. 용어의 정의',
    body:
      '· "사이트"란 PAGEONEWORKS가 운영하는 웹사이트 및 관련 서비스를 말합니다.\n· "이용자"란 본 약관에 따라 사이트가 제공하는 서비스를 이용하는 자를 말합니다.\n· "콘텐츠"란 사이트에 게시된 글, 이미지, 디자인 등 모든 정보와 자료를 말합니다.\n· "상담예약"이란 이용자가 사이트를 통해 상담을 신청하는 기능을 말합니다.',
  },
  {
    id: 'effect',
    title: '3. 약관의 효력과 변경',
    body:
      '· 본 약관은 사이트에 게시함으로써 효력이 발생합니다.\n· 사이트는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.\n· 약관이 변경되는 경우 변경 내용과 시행일을 사이트에 사전 공지하며, 변경된 약관은 공지한 시행일부터 효력이 발생합니다.',
  },
  {
    id: 'service',
    title: '4. 사이트와 정보성 콘텐츠의 제공',
    body:
      '· 사이트는 의료·부동산·기술·법률·금융·라이프스타일 등 다양한 분야의 정보성 콘텐츠와 커뮤니티 기능을 제공합니다.\n· 사이트가 제공하는 정보성 콘텐츠는 일반적인 정보 제공을 목적으로 하며, 개별 사안에 대한 법률·의료·세무·회계·노무·투자 자문을 대신하지 않습니다.\n· 전문적인 판단이 필요한 경우 이용자는 해당 분야의 자격 있는 전문가에게 확인하여야 합니다.',
  },
  {
    id: 'consult',
    title: '5. 상담예약 서비스',
    body:
      '· 이용자는 사이트의 상담예약 기능을 통해 상담을 신청할 수 있습니다.\n· 현재 상담예약 폼은 미리보기 단계로, 입력 내용이 외부로 전송되거나 저장되지 않을 수 있습니다. 실제 접수 기능이 연결되는 시점에 그 내용과 처리 방식을 별도로 안내합니다.\n· 상담 신청 시 제공한 개인정보는 개인정보처리방침에 따라 처리됩니다.\n· PAGEONEWORKS는 상담을 통해 특정 검색 순위, AI 인용, 매출 또는 사업 성과를 보장하지 않습니다.',
  },
  {
    id: 'obligation',
    title: '6. 이용자의 의무',
    body:
      '· 이용자는 본 약관 및 관련 법령을 준수하여야 합니다.\n· 이용자는 회원가입·상담 신청 등에서 정확한 정보를 제공하여야 하며, 타인의 정보를 도용해서는 안 됩니다.\n· 계정 정보의 관리 책임은 이용자 본인에게 있습니다.',
  },
  {
    id: 'prohibition',
    title: '7. 금지 행위',
    body:
      '이용자는 다음 행위를 하여서는 안 됩니다.\n· 타인을 비방하거나 명예를 훼손하는 게시\n· 불법·음란·광고성 스팸 게시\n· 타인의 권리(저작권 등)를 침해하는 행위\n· 자동화 도구를 이용한 비정상적 접근 또는 서비스 운영 방해\n· 사이트의 정상적인 운영을 방해하는 일체의 행위',
  },
  {
    id: 'copyright',
    title: '8. PAGEONEWORKS 콘텐츠 저작권',
    body:
      '· 사이트에 게시된 콘텐츠의 저작권은 PAGEONEWORKS 또는 정당한 권리자에게 귀속됩니다.\n· 이용자는 사이트의 사전 동의 없이 콘텐츠를 복제·배포·전송·전시하거나 상업적으로 이용할 수 없습니다.\n· 이용자가 사이트에 게시한 게시물에 대한 책임은 게시한 이용자에게 있습니다.',
  },
  {
    id: 'links',
    title: '9. 외부 사이트 링크',
    body:
      '· 사이트는 이용자의 편의를 위해 외부 사이트로 연결되는 링크를 제공할 수 있습니다.\n· 외부 사이트의 콘텐츠 및 운영은 해당 사이트의 정책에 따르며, 사이트는 외부 사이트의 내용에 대해 통제하거나 보증하지 않습니다.',
  },
  {
    id: 'change',
    title: '10. 서비스의 변경·중단',
    body:
      '· 사이트는 서비스의 내용을 변경하거나 운영상·기술상 필요에 따라 서비스의 전부 또는 일부를 중단할 수 있습니다.\n· 서비스의 변경·중단 시 가능한 범위에서 사전에 공지하되, 부득이한 경우 사후에 공지할 수 있습니다.',
  },
  {
    id: 'liability',
    title: '11. 책임 범위',
    body:
      '· 사이트는 제공하는 정보성 콘텐츠의 정확성·완전성·유용성을 높이기 위해 노력하나, 콘텐츠는 일반 정보 제공 목적이며 개별 전문 자문을 대체하지 않습니다.\n· PAGEONEWORKS는 특정 검색 순위, AI 인용, 매출 또는 사업 성과를 보장하지 않습니다.\n· 사이트는 천재지변, 이용자의 귀책, 외부 서비스 장애 등 사이트의 합리적 통제를 벗어난 사유로 인한 손해에 대해서는 책임을 지지 않습니다.\n· 본 약관의 어떠한 내용도 관련 법령에 따라 사이트가 부담하여야 하는 책임을 부당하게 배제하거나 제한하지 않습니다.',
  },
  {
    id: 'dispute',
    title: '12. 분쟁 해결과 준거법',
    body:
      '· 본 약관 및 서비스 이용과 관련한 분쟁은 대한민국 법을 준거법으로 합니다.\n· 사이트와 이용자 간 분쟁이 발생한 경우, 양 당사자는 신의에 따라 성실히 협의하여 해결하도록 노력합니다.\n· 협의로 해결되지 않는 경우 관계 법령이 정한 절차와 관할 법원에 따릅니다.',
  },
  {
    id: 'effective',
    title: '13. 시행일',
    body: `본 약관은 ${EFFECTIVE_DATE}부터 시행합니다.`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '96px', paddingBottom: '96px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
        {/* 헤더 */}
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '16px' }}>
          Terms of Service
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 300, color: '#f5f2ed', lineHeight: 1.2, marginBottom: '20px' }}>
          이용약관
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 300, color: 'rgba(245,242,237,0.7)', lineHeight: 1.8, maxWidth: '70ch' }}>
          본 약관은 PAGEONEWORKS 서비스 이용에 관한 조건과 절차, 이용자와 사이트의 권리·의무를 안내합니다.
        </p>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(245,242,237,0.4)', marginTop: '16px' }}>
          시행일 · {EFFECTIVE_DATE}
        </p>

        <div style={{ height: '1px', background: 'rgba(201,169,110,0.25)', margin: '40px 0' }} />

        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-14">
          {/* 목차 */}
          <nav aria-label="목차" className="mb-10 md:mb-0">
            <details className="md:hidden group rounded-lg border border-white/10">
              <summary
                className="flex items-center justify-between gap-3 cursor-pointer list-none px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40 [&::-webkit-details-marker]:hidden"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(245,242,237,0.7)', textTransform: 'uppercase', minHeight: '48px' }}
              >
                <span>목차</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <ul className="px-4 pb-4 flex flex-col gap-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40" style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'rgba(245,242,237,0.6)' }}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            <ul className="hidden md:flex md:flex-col md:gap-1 md:sticky md:top-24">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block py-1.5 outline-none transition-colors hover:text-[#C9A96E] focus-visible:text-[#C9A96E]" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(245,242,237,0.5)', lineHeight: 1.5 }}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 본문 */}
          <div>
            {sections.map((section) => (
              <section key={section.id} id={section.id} style={{ marginBottom: '40px', scrollMarginTop: '96px' }}>
                <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(1.05rem, 2.4vw, 1.25rem)', fontWeight: 600, color: '#f5f2ed', marginBottom: '14px' }}>
                  {section.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 300, color: 'rgba(245,242,237,0.72)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                  {section.body}
                </p>
              </section>
            ))}

            <div style={{ borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '28px', marginTop: '8px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: 'rgba(245,242,237,0.55)', lineHeight: 1.8 }}>
                운영: {siteConfig.name} ({siteConfig.operatorDisplayName}) · 문의: {siteConfig.email}
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: 'rgba(245,242,237,0.55)', lineHeight: 1.8, marginTop: '6px' }}>
                함께 보기:{' '}
                <Link href="/privacy" style={{ color: GOLD, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  개인정보처리방침
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
