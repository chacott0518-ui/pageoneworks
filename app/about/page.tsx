import type { Metadata } from 'next';
import { siteConfig, absoluteUrl } from '@/lib/site.config';

const ABOUT_URL = absoluteUrl('/about');

export const metadata: Metadata = {
  title: `소개 | ${siteConfig.name}`,
  description: siteConfig.description,
  keywords: ['페이지원웍스소개', 'PAGEONEWORKS', '프리미엄매거진', '라이프스타일매거진'],
  alternates: { canonical: ABOUT_URL },
  openGraph: {
    title: `소개 | ${siteConfig.name}`,
    description: siteConfig.description,
    url: ABOUT_URL,
    images: [{ url: absoluteUrl(siteConfig.ogImagePath), width: 1200, height: 630 }],
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `소개 | ${siteConfig.name}`,
    description: siteConfig.description,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `소개 | ${siteConfig.name}`,
  url: ABOUT_URL,
  description: `${siteConfig.name} 소개 페이지`,
  publisher: { '@id': siteConfig.publisherId },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: siteConfig.baseUrl },
      { '@type': 'ListItem', position: 2, name: '소개', item: ABOUT_URL },
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
              {siteConfig.name}는 프리미엄 라이프스타일 매거진입니다.
            </p>
            <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '13px', color: 'rgba(245,242,237,0.6)', lineHeight: 2, marginBottom: '48px' }}>
              부동산·의료·안티에이징·법률·세무·미식·여행·교육 분야에서<br />
              깊이 있는 팩트 기반 콘텐츠를 제공합니다.<br />
              광고가 아닌 독자를 위한 정보로만 채워진 공간입니다.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: 'rgba(245,242,237,0.08)', marginBottom: '48px' }}>
              {[
                { label: '설립', value: siteConfig.foundingDate },
                { label: '대표', value: siteConfig.representative },
                { label: '사업자번호', value: siteConfig.businessNumber },
                { label: '주소', value: siteConfig.address.display },
                { label: '이메일', value: siteConfig.email },
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