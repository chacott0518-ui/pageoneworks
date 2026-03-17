import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

const SITE_URL = 'https://pageoneworks.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PAGEONEWORKS \u2014 Premium Lifestyle Magazine',
    template: '%s | PAGEONEWORKS',
  },
  description: '\uc758\ub8cc\xb7\ubd80\ub3d9\uc0b0\xb7\uae30\uc220\xb7\uae08\uc735\xb7\ub77c\uc774\ud504\uc2a4\ud0c0\uc77c\uc744 \uc544\uc6b0\ub974\ub294 \ud504\ub9ac\ubbf8\uc5c4 \uc6f9\ub9e4\uac70\uc9c4',
  keywords: ['\ub77c\uc774\ud504\uc2a4\ud0c0\uc77c', '\ud504\ub9ac\ubbf8\uc5c4', '\ubd80\ub3d9\uc0b0', '\uc758\ub8cc', '\uc790\uc0b0\uad00\ub9ac', '\uc548\ud2f0\uc5d0\uc774\uc9d5', '\uc6f9\ub9e4\uac70\uc9c4'],
  openGraph: {
    title: 'PAGEONEWORKS',
    description: '\ud504\ub9ac\ubbf8\uc5c4 \ub77c\uc774\ud504\uc2a4\ud0c0\uc77c \uc6f9\ub9e4\uac70\uc9c4',
    type: 'website',
    url: SITE_URL,
    siteName: 'PAGEONEWORKS',
    locale: 'ko_KR',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'PAGEONEWORKS \u2014 Premium Lifestyle Magazine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAGEONEWORKS',
    description: '\ud504\ub9ac\ubbf8\uc5c4 \ub77c\uc774\ud504\uc2a4\ud0c0\uc77c \uc6f9\ub9e4\uac70\uc9c4',
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
