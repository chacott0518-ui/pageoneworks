'use client';

export default function CtaBlock() {
  return (
    <div style={{
      border: '0.5px solid #3a2030',
      borderRadius: '10px',
      padding: '16px',
      background: '#221018',
      margin: '32px 0',
    }}>
      <p style={{
        fontSize: '13px',
        fontWeight: 500,
        color: '#e8a0b8',
        margin: '0 0 3px',
        fontFamily: 'var(--font-inter)',
      }}>
        연세365산부인과 — 무료 상담
      </p>
      <p style={{
        fontSize: '11px',
        color: '#8a5a6a',
        margin: '0 0 14px',
        lineHeight: 1.5,
        fontFamily: 'var(--font-inter)',
      }}>
        비밀 보장 · 당일 수술 가능 · 사당역 4번출구
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        <a
          href="http://pf.kakao.com/_TpaBj/chat"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오톡 상담"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 6px',
            borderRadius: '8px',
            background: '#3d2a18',
            border: '0.5px solid #5a3a22',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.75')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FEE500" d="M12 3C6.477 3 2 6.72 2 11.3c0 2.88 1.73 5.42 4.36 6.93L5.2 21.5l4.72-2.6c.67.1 1.37.16 2.08.16 5.523 0 10-3.72 10-8.3C22 6.72 17.523 3 12 3z" />
          </svg>
        </a>

        <a
          href="tel:02-585-3650"
          aria-label="전화 상담"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 6px',
            borderRadius: '8px',
            background: '#2a1020',
            border: '1px solid #5a2a40',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#3a1828')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#2a1020')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8a0b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
        </a>

        <a
          href="https://www.yeonsei365.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="홈페이지"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 6px',
            borderRadius: '8px',
            background: '#1e1218',
            border: '0.5px solid #3a2030',
            textDecoration: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#2a1820')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#1e1218')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9a7a85" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </a>
      </div>
    </div>
  );
}
