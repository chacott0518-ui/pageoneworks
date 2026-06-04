import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '공지사항 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 공지사항. 서비스 업데이트, 이벤트, 정책 변경 등 최신 소식을 확인하세요.',
  keywords: ['공지사항', 'PAGEONEWORKS공지', '서비스안내'],
  alternates: { canonical: 'https://www.pageoneworks.com/notice' },
  openGraph: {
    title: '공지사항 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 공지사항.',
    url: 'https://www.pageoneworks.com/notice',
    images: [{ url: 'https://www.pageoneworks.com/og-image.jpg', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '공지사항 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 공지사항.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '공지사항 | PAGEONEWORKS',
  url: 'https://www.pageoneworks.com/notice',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.pageoneworks.com' },
      { '@type': 'ListItem', position: 2, name: '공지사항', item: 'https://www.pageoneworks.com/notice' },
    ],
  },
};

const notices = [
  { date: '2026.06.04', title: '페이지원웍스 서비스 오픈 안내', content: '프리미엄 라이프스타일 매거진 PAGEONEWORKS가 정식 오픈했습니다.' },
  { date: '2026.06.01', title: '커뮤니티 기능 오픈', content: '회원 커뮤니티 기능이 오픈됐습니다. 로그인 후 자유롭게 이용해 주세요.' },
];

export default function NoticePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Notice · 공지사항
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#f5f2ed', marginBottom: '48px', lineHeight: 1.2 }}>
            공지사항
          </h1>

          <div style={{ borderTop: '0.5px solid rgba(245,242,237,0.1)' }}>
            {notices.map((notice, i) => (
              <div key={i} style={{ borderBottom: '0.5px solid rgba(245,242,237,0.08)', padding: '28px 0' }}>
                <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(245,242,237,0.35)', letterSpacing: '0.15em', marginBottom: '10px' }}>{notice.date}</p>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 400, color: '#f5f2ed', marginBottom: '8px' }}>{notice.title}</h2>
                <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: 'rgba(245,242,237,0.55)', lineHeight: 1.8 }}>{notice.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}