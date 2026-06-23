import type { Metadata } from 'next';
import MypageClient from './MypageClient';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: '마이페이지 | PAGEONEWORKS',
  description: 'PAGEONEWORKS 마이페이지. 내 정보, 멤버십, 보안 설정을 관리하세요.',
  keywords: ['마이페이지', 'PAGEONEWORKS회원', '계정관리'],
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: '마이페이지 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 마이페이지.',
    url: 'https://www.pageoneworks.com/mypage',
    images: [{ url: siteConfig.ogImagePath, width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '마이페이지 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 마이페이지.',
  },
};

export default function MypagePage() {
  return <MypageClient />;
}