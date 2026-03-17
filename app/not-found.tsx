import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-cream flex flex-col items-center justify-center px-6 text-center">
      <p
        className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40 mb-6"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        404 · Not Found
      </p>
      <h1
        className="text-6xl md:text-8xl font-light mb-6"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        페이지를 찾을 수 없습니다.
      </h1>
      <Link
        href="/"
        className="mt-8 font-mono text-[9px] uppercase tracking-widest border border-cream/20 px-8 py-4 hover:border-cream/50 transition-colors"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
