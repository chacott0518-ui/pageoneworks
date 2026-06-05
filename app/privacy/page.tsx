import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 개인정보처리방침. 수집 항목, 이용 목적, 보관 기간 및 이용자 권리를 안내합니다.',
  alternates: { canonical: 'https://www.pageoneworks.com/privacy' },
  openGraph: {
    title: '개인정보처리방침 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 개인정보처리방침.',
    url: 'https://www.pageoneworks.com/privacy',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '개인정보처리방침 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 개인정보처리방침.',
  },
};

const sections = [
  {
    title: '1. 수집하는 개인정보 항목',
    body: 'PAGEONEWORKS(이하 "사이트")는 회원가입, 뉴스레터 구독, 문의 응대 시 아래 정보를 수집할 수 있습니다.\n· 필수: 이메일 주소, 닉네임(소셜 로그인 시 제공 정보)\n· 선택: 마케팅 수신 동의 여부\n· 자동 수집: 접속 IP, 쿠키, 방문 기록, 기기 정보',
  },
  {
    title: '2. 개인정보의 이용 목적',
    body: '수집한 정보는 다음 목적에만 이용됩니다.\n· 회원 식별 및 서비스 제공\n· 콘텐츠·커뮤니티 기능 운영\n· 고객 문의 및 불만 처리\n· 서비스 개선 및 통계 분석\n· 마케팅 정보 제공(동의한 경우에 한함)',
  },
  {
    title: '3. 보관 및 파기',
    body: '개인정보는 수집·이용 목적이 달성되면 지체 없이 파기합니다. 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 안전하게 보관합니다.\n· 회원 탈퇴 시: 즉시 삭제(법령상 보관 의무 제외)\n· 문의 기록: 3년',
  },
  {
    title: '4. 이용자의 권리',
    body: '이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. chacott0518@gmail.com으로 문의해 주시면 신속히 처리합니다.',
  },
  {
    title: '5. 문의',
    body: '개인정보 보호 관련 문의\n· 운영: PAGEONEWORKS (USENAD Co., Ltd.)\n· 이메일: chacott0518@gmail.com\n· 시행일: 2026년 1월 1일',
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
          Privacy · 개인정보처리방침
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#f5f2ed', marginBottom: '48px', lineHeight: 1.2 }}>
          개인정보처리방침
        </h1>

        <div style={{ borderTop: '0.5px solid rgba(245,242,237,0.1)', paddingTop: '40px' }}>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 300, color: 'rgba(245,242,237,0.85)', lineHeight: 1.8, marginBottom: '40px' }}>
            PAGEONEWORKS는 이용자의 개인정보를 소중히 여기며, 관련 법령을 준수합니다.
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
