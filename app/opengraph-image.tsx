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
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* 배경 그라디언트 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          }}
        />

        {/* 상단 라인 */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            right: '80px',
            height: '1px',
            background: 'rgba(245,242,237,0.15)',
          }}
        />

        {/* 카테고리 텍스트 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontFamily: 'serif',
              fontSize: '13px',
              letterSpacing: '0.3em',
              color: 'rgba(245,242,237,0.4)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Premium Lifestyle Magazine
          </p>
          <h1
            style={{
              fontFamily: 'serif',
              fontSize: '96px',
              fontWeight: 300,
              color: '#f5f2ed',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              margin: 0,
            }}
          >
            PAGEONEWORKS
          </h1>
          <p
            style={{
              fontFamily: 'serif',
              fontSize: '20px',
              color: 'rgba(245,242,237,0.5)',
              margin: 0,
              letterSpacing: '0.05em',
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
            background: 'rgba(245,242,237,0.15)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}