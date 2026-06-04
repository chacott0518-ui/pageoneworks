import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: '로그인 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 프리미엄 매거진 로그인. Google·카카오 소셜 로그인으로 간편하게 시작하세요.',
  keywords: ['PAGEONEWORKS로그인', '소셜로그인', '프리미엄매거진'],
  alternates: { canonical: 'https://www.pageoneworks.com/login' },
  openGraph: {
    title: '로그인 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 프리미엄 매거진 로그인.',
    url: 'https://www.pageoneworks.com/login',
    images: [{ url: 'https://www.pageoneworks.com/og-image.jpg', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '로그인 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 프리미엄 매거진 로그인.',
  },
};

export default function LoginPage() {
  return <LoginClient />;
}