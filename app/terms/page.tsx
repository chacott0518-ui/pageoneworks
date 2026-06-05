import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 서비스 이용약관. 이용 조건, 회원 의무, 콘텐츠 저작권 및 면책 사항을 안내합니다.',
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

const sections = [
  {
    title: '1. 서비스 개요',
    body: 'PAGEONEWORKS(이하 "사이트")는 프리미엄 라이프스타일 매거진 콘텐츠, 커뮤니티, 부가 서비스를 제공합니다. 사이트 이용 시 본 약관에 동의한 것으로 간주합니다.',
  },
  {
    title: '2. 회원 가입 및 계정',
    body: '· Google·카카오 등 소셜 로그인을 통해 가입할 수 있습니다.\n· 타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.\n· 계정 관리 책임은 회원 본인에게 있습니다.',
  },
  {
    title: '3. 콘텐츠 및 저작권',
    body: '사이트에 게시된 아티클, 이미지, 디자인 등 모든 콘텐츠의 저작권은 PAGEONEWORKS 또는 정당한 권리자에게 귀속됩니다. 무단 복제·배포·상업적 이용을 금지합니다.',
  },
  {
    title: '4. 이용자 의무',
    body: '이용자는 다음 행위를 해서는 안 됩니다.\n· 타인을 비방하거나 명예를 훼손하는 게시\n· 불법·음란·광고성 스팸 게시\n· 서비스 운영을 방해하는 행위\n· 자동화 도구를 이용한 비정상적 접근',
  },
  {
    title: '5. 면책 및 약관 변경',
    body: '사이트의 정보성 콘텐츠는 참고용이며, 투자·의료·법률 등 전문 판단을 대체하지 않습니다. 약관은 필요 시 사전 공지 후 변경될 수 있으며, 변경된 약관은 공지일로부터 효력이 발생합니다.',
  },
  {
    title: '6. 문의',
    body: '이용약관 관련 문의: chacott0518@gmail.com\n운영: PAGEONEWORKS (USENAD Co., Ltd.)\n시행일: 2026년 1월 1일',
  },
];

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
          Terms · 이용약관
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#f5f2ed', marginBottom: '48px', lineHeight: 1.2 }}>
          이용약관
        </h1>

        <div style={{ borderTop: '0.5px solid rgba(245,242,237,0.1)', paddingTop: '40px' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 300, color: 'rgba(245,242,237,0.85)', lineHeight: 1.8, marginBottom: '40px' }}>
            PAGEONEWORKS 서비스 이용에 관한 기본 조건을 안내합니다.
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
