import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '쿠키 정책 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 쿠키 정책. 쿠키 사용 목적, 종류 및 관리 방법을 안내합니다.',
  alternates: { canonical: 'https://www.pageoneworks.com/cookie' },
  openGraph: {
    title: '쿠키 정책 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 쿠키 정책.',
    url: 'https://www.pageoneworks.com/cookie',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '쿠키 정책 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 쿠키 정책.',
  },
};

const sections = [
  {
    title: '1. 쿠키란?',
    body: '쿠키(Cookie)는 웹사이트가 이용자의 브라우저에 저장하는 작은 텍스트 파일입니다. PAGEONEWORKS는 서비스 품질 향상과 편의 제공을 위해 쿠키를 사용할 수 있습니다.',
  },
  {
    title: '2. 사용 목적',
    body: '· 필수 쿠키: 로그인 상태 유지, 보안, 기본 사이트 기능\n· 분석 쿠키: 방문 통계, 페이지 이용 패턴 파악\n· 기능 쿠키: 언어·표시 설정 등 이용자 환경 저장',
  },
  {
    title: '3. 제3자 쿠키',
    body: 'Google 로그인, 카카오 로그인 등 소셜 인증 서비스 연동 시 해당 제공자의 쿠키가 설정될 수 있습니다. 제3자 쿠키 정책은 각 제공자의 정책을 따릅니다.',
  },
  {
    title: '4. 쿠키 관리 방법',
    body: '브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 필수 쿠키를 차단할 경우 로그인 등 일부 기능이 제한될 수 있습니다.\n· Chrome: 설정 → 개인정보 및 보안 → 쿠키\n· Safari: 환경설정 → 개인정보 보호\n· Edge: 설정 → 쿠키 및 사이트 권한',
  },
  {
    title: '5. 문의',
    body: '쿠키 정책 관련 문의: chacott0518@gmail.com\n운영: PAGEONEWORKS (USENAD Co., Ltd.)\n시행일: 2026년 1월 1일',
  },
];

export default function CookiePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
          Cookie · 쿠키 정책
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#f5f2ed', marginBottom: '48px', lineHeight: 1.2 }}>
          쿠키 정책
        </h1>

        <div style={{ borderTop: '0.5px solid rgba(245,242,237,0.1)', paddingTop: '40px' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 300, color: 'rgba(245,242,237,0.85)', lineHeight: 1.8, marginBottom: '40px' }}>
            PAGEONEWORKS가 쿠키를 어떻게 사용하는지 안내합니다.
          </p>

          {sections.map((section) => (
            <div key={section.title} style={{ marginBottom: '36px' }}>
              <h2 style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(245,242,237,0.55)', textTransform: 'uppercase', marginBottom: '12px' }}>
                {section.title}
              </h2>
              <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '13px', color: 'rgba(245,242,237,0.6)', lineHeight: 2, whiteSpace: 'pre-line' }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
