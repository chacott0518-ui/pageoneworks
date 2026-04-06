import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'PAGEONEWORKS — 프리미엄 라이프스타일 매거진';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#1B26B0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* 상단 라인 */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            right: '80px',
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
          }}
        />

        {/* 텍스트 영역 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '16px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Premium Lifestyle Magazine
          </p>
          <h1
            style={{
              fontFamily: 'sans-serif',
              fontSize: '120px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              margin: 0,
            }}
          >
            PAGEONE.
          </h1>
          <p
            style={{
              fontFamily: 'sans-serif',
              fontSize: '22px',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              letterSpacing: '0.08em',
            }}
          >
            의료 · 부동산 · 모빌리티 · 법률 · 금융 · 라이프스타일 · 뷰티 · 미식 · 교육
          </p>
        </div>

        {/* 하단 라인 */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '80px',
            right: '80px',
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}