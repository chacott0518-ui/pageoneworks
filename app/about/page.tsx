import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 | PAGEONEWORKS',
  description: 'PAGEONEWORKS는 대한민국 No.1 프리미엄 라이프스타일 매거진입니다. 부동산·의료·법률·미식·여행 분야의 깊이 있는 콘텐츠를 제공합니다.',
  keywords: ['페이지원웍스소개', 'PAGEONEWORKS', '프리미엄매거진', '라이프스타일매거진'],
  alternates: { canonical: 'https://www.pageoneworks.com/about' },
  openGraph: {
    title: '소개 | PAGEONEWORKS',
    description: 'PAGEONEWORKS는 대한민국 No.1 프리미엄 라이프스타일 매거진입니다.',
    url: 'https://www.pageoneworks.com/about',
    images: [{ url: 'https://www.pageoneworks.com/og-image.jpg', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '소개 | PAGEONEWORKS',
    description: 'PAGEONEWORKS는 대한민국 No.1 프리미엄 라이프스타일 매거진입니다.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: '소개 | PAGEONEWORKS',
  url: 'https://www.pageoneworks.com/about',
  description: 'PAGEONEWORKS 소개 페이지',
  publisher: {
    '@type': 'Organization',
    name: 'PAGEONEWORKS',
    url: 'https://www.pageoneworks.com',
    logo: { '@type': 'ImageObject', url: 'https://www.pageoneworks.com/logo.png' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '장안동 463-2 이화빌딩 7F',
      addressLocality: '동대문구',
      addressRegion: '서울',
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'chacott0518@gmail.com',
      contactType: 'customer service',
    },
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.pageoneworks.com' },
      { '@type': 'ListItem', position: 2, name: '소개', item: 'https://www.pageoneworks.com/about' },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>
            About · 소개
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: '#f5f2ed', marginBottom: '48px', lineHeight: 1.2 }}>
            PAGEONEWORKS
          </h1>

          <div style={{ borderTop: '0.5px solid rgba(245,242,237,0.1)', paddingTop: '40px' }}>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 300, color: 'rgba(245,242,237,0.85)', lineHeight: 1.8, marginBottom: '32px' }}>
              PAGEONEWORKS는 대한민국 No.1 프리미엄 라이프스타일 매거진입니다.
            </p>
            <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '13px', color: 'rgba(245,242,237,0.6)', lineHeight: 2, marginBottom: '48px' }}>
              부동산·의료·안티에이징·법률·세무·미식·여행·교육 분야에서<br />
              깊이 있는 팩트 기반 콘텐츠를 제공합니다.<br />
              광고가 아닌 독자를 위한 정보로만 채워진 공간입니다.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'rgba(245,242,237,0.08)', marginBottom: '48px' }}>
              {[
                { label: '설립', value: '2026' },
                { label: '대표', value: '김세준' },
                { label: '사업자번호', value: '206-31-95055' },
                { label: '주소', value: '서울 동대문구 장안동 463-2 7F' },
                { label: '이메일', value: 'chacott0518@gmail.com' },
                { label: '카테고리', value: '8개 프리미엄 분야' },
              ].map((item) => (
                <div key={item.label} style={{ background: '#0a0a0a', padding: '24px' }}>
                  <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', color: 'rgba(245,242,237,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</p>
                  <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: 'rgba(245,242,237,0.75)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}