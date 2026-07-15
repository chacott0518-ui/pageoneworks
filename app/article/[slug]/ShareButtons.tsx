'use client';

import { useCallback } from 'react';
import Script from 'next/script';
import { Share2 } from 'lucide-react';

const PRODUCTION_ORIGIN = 'https://www.pageoneworks.com';
const KAKAO_SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js';
const KAKAO_SDK_INTEGRITY =
  'sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: {
          objectType: 'feed';
          content: {
            title: string;
            description: string;
            imageUrl: string;
            link: { mobileWebUrl: string; webUrl: string };
          };
          buttons: Array<{
            title: string;
            link: { mobileWebUrl: string; webUrl: string };
          }>;
        }) => void;
      };
    };
  }
}

function getMetaContent(key: string): string {
  const byProperty = document.querySelector(`meta[property="${key}"]`);
  if (byProperty?.getAttribute('content')) {
    return byProperty.getAttribute('content')!.trim();
  }
  const byName = document.querySelector(`meta[name="${key}"]`);
  return byName?.getAttribute('content')?.trim() ?? '';
}

function getArticleSlug(): string {
  const match = window.location.pathname.match(/\/article\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : '';
}

function getShareUrl(slug: string): string {
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (isLocal) {
    return `${window.location.origin}/article/${slug}`;
  }
  return `${PRODUCTION_ORIGIN}/article/${slug}`;
}

function toAbsoluteImageUrl(src: string): string {
  if (!src) return `${PRODUCTION_ORIGIN}/images/og-default.jpg`;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return `https:${src}`;
  return `${PRODUCTION_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`;
}

function ensureKakaoInitialized(): boolean {
  const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  if (!key) {
    alert('카카오 공유 설정이 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.');
    return false;
  }
  if (!window.Kakao) {
    alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
    return false;
  }
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
  return window.Kakao.isInitialized();
}

export function ShareButtons() {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  const handleKakao = useCallback(() => {
    if (!ensureKakaoInitialized()) return;

    const slug = getArticleSlug();
    if (!slug) {
      alert('공유할 아티클 정보를 찾지 못했습니다.');
      return;
    }

    const shareUrl = getShareUrl(slug);
    const title =
      getMetaContent('og:title') ||
      document.title.replace(/\s*—\s*PAGEONEWORKS\s*$/i, '').trim() ||
      'PAGEONEWORKS';
    const description =
      getMetaContent('og:description') ||
      getMetaContent('description') ||
      '';
    const imageUrl = toAbsoluteImageUrl(getMetaContent('og:image'));

    try {
      window.Kakao!.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '아티클 읽기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } catch {
      alert('카카오톡 공유 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-ink/8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <Script
        src={KAKAO_SDK_SRC}
        integrity={KAKAO_SDK_INTEGRITY}
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => {
          const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
          if (key && window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(key);
          }
        }}
      />
      <p
        className="text-ink/30 text-[8px] uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        Share this article
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 border border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink text-[8px] uppercase tracking-widest px-4 py-2.5 transition-all"
          style={{ fontFamily: 'var(--font-space-mono)' }}
        >
          <Share2 className="w-3 h-3" />
          링크 복사
        </button>
        <button
          onClick={handleKakao}
          className="flex items-center gap-2 bg-[#FEE500] text-[#3A1D1D] text-[8px] uppercase tracking-widest px-4 py-2.5 hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-space-mono)' }}
        >
          카톡 공유
        </button>
      </div>
    </div>
  );
}
