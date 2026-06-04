import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '광고·제휴 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 광고 및 제휴 문의. 프리미엄 라이프스타일 매거진과 함께 브랜드를 성장시키세요.',
  keywords: ['광고문의', '제휴문의', '협찬', '브랜드마케팅', 'PAGEONEWORKS광고'],
  alternates: { canonical: 'https://www.pageoneworks.com/advertise' },
  openGraph: {
    title: '광고·제휴 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 광고 및 제휴 문의.',
    url: 'https://www.pageoneworks.com/advertise',
    images: [{ url: 'https://www.pageoneworks.com/og-image.jpg', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '광고·제휴 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 광고 및 제휴 문의.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '광고·제휴 | PAGEONEWORKS',
  url: 'https://www.pageoneworks.com/advertise',
  description: 'PAGEONEWORKS 광고 및 제휴 문의 페이지',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.pageoneworks.com' },
      { '@type': 'ListItem', position: 2, name: '광고·제휴', item: 'https://www.pageoneworks.com/advertise' },
    ],
  },
};

export default function AdvertisePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Advertise · 광고·제휴
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#f5f2ed', marginBottom: '32px', lineHeight: 1.2 }}>
            광고·제휴 문의
          </h1>

          <div style={{ borderTop: '0.5px solid rgba(245,242,237,0.1)', paddingTop: '40px' }}>
            <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '13px', color: 'rgba(245,242,237,0.7)', lineHeight: 2, marginBottom: '32px' }}>
              PAGEONEWORKS는 대한민국 프리미엄 라이프스타일 매거진입니다.<br />
              부동산·의료·법률·미식·여행·교육 분야의 고소득 독자층을 보유하고 있습니다.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
              {[
                { label: '월간 페이지뷰', value: '50만+' },
                { label: '평균 체류시간', value: '4분 32초' },
                { label: '주요 독자', value: '30~50대' },
                { label: '주요 관심사', value: '부동산·의료·미식' },
              ].map((item) => (
                <div key={item.label} style={{ border: '0.5px solid rgba(245,242,237,0.1)', padding: '20px', background: 'rgba(245,242,237,0.03)' }}>
                  <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(245,242,237,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', color: '#f5f2ed', fontWeight: 300 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ border: '0.5px solid rgba(245,242,237,0.1)', padding: '32px', background: 'rgba(245,242,237,0.02)', marginBottom: '32px' }}>
              <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'rgba(245,242,237,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>광고 문의</p>
              <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '13px', color: 'rgba(245,242,237,0.8)', lineHeight: 1.8 }}>
                이메일: <a href="mailto:chacott0518@gmail.com" style={{ color: '#C9A96E', textDecoration: 'none' }}>chacott0518@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}