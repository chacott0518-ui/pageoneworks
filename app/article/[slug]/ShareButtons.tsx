'use client';

import { Share2 } from 'lucide-react';

export function ShareButtons() {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
  };

  const handleKakao = () => {
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  return (
    <div className="mt-12 pt-8 border-t border-ink/8 flex flex-col sm:flex-row items-center justify-between gap-4">
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