'use client';

import React, { useState } from 'react';

const krw = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;
const parse = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
const comma = (s: string): string => {
  const n = s.replace(/[^0-9]/g, '');
  return n ? parseInt(n, 10).toLocaleString('ko-KR') : '';
};

type VatType  = 'general' | 'simplified';
type CalcMode = 'supply' | 'total';

const SIM_RATES = [
  { label: '소매업',       rate: 15 },
  { label: '음식점업',     rate: 40 },
  { label: '제조·건설업',  rate: 20 },
  { label: '숙박업',       rate: 25 },
  { label: '운수업',       rate: 30 },
  { label: '서비스업',     rate: 40 },
  { label: '부동산 임대',  rate: 40 },
  { label: '기타',         rate: 30 },
];

const CSS = `
  .vc-wrap { margin:32px 0; border:1px solid rgba(26,26,26,0.1); border-radius:2px; overflow:hidden; background:#fff; font-family:inherit; }
  .vc-wrap * { box-sizing:border-box; }
  .vc-header { background:#0d0d0d; padding:22px 24px; }
  .vc-type-tabs { display:flex; border-bottom:1px solid rgba(26,26,26,.1); }
  .vc-type-tab { flex:1; padding:14px 12px; border:none; background:transparent; cursor:pointer; transition:background .2s; border-right:1px solid rgba(26,26,26,.1); -webkit-tap-highlight-color:transparent; }
  .vc-type-tab:last-child { border-right:none; }
  .vc-type-tab.active { background:#1a1a1a; }
  .vc-type-tl { font-size:11px; letter-spacing:.08em; display:block; margin-bottom:3px; color:rgba(26,26,26,.55); font-family:var(--font-space-mono,monospace); }
  .vc-type-tab.active .vc-type-tl { color:#ede8e0; }
  .vc-type-ts { font-size:11px; color:rgba(26,26,26,.35); font-family:var(--font-inter,sans-serif); }
  .vc-type-tab.active .vc-type-ts { color:rgba(201,185,154,.75); }
  .vc-body { padding:22px 24px; }
  .vc-label { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:rgba(26,26,26,.4); margin:0 0 9px; font-family:var(--font-space-mono,monospace); }
  .vc-sim-grid { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px; }
  .vc-sim-btn { padding:8px 14px; border:1px solid rgba(26,26,26,.12); background:transparent; cursor:pointer; border-radius:1px; -webkit-tap-highlight-color:transparent; white-space:nowrap; }
  .vc-sim-btn.active { border-color:#1a1a1a; background:#1a1a1a; }
  .vc-sim-btn span { font-size:10px; letter-spacing:.04em; color:rgba(26,26,26,.55); font-family:var(--font-space-mono,monospace); }
  .vc-sim-btn.active span { color:#ede8e0; }
  .vc-sim-btn em { font-style:normal; color:rgba(26,26,26,.35); }
  .vc-sim-btn.active em { color:rgba(201,185,154,.7); }
  .vc-mode-tabs { display:flex; gap:8px; margin-bottom:20px; }
  .vc-mode-tab { flex:1; padding:12px 10px; border:1px solid rgba(26,26,26,.12); background:transparent; cursor:pointer; border-radius:1px; text-align:left; transition:all .2s; -webkit-tap-highlight-color:transparent; }
  .vc-mode-tab.active { border-color:#1a1a1a; background:#1a1a1a; }
  .vc-mode-tl { font-size:10px; letter-spacing:.05em; display:block; margin-bottom:3px; color:rgba(26,26,26,.5); font-family:var(--font-space-mono,monospace); }
  .vc-mode-tab.active .vc-mode-tl { color:#ede8e0; }
  .vc-mode-ts { font-size:10px; color:rgba(26,26,26,.35); font-family:var(--font-inter,sans-serif); }
  .vc-mode-tab.active .vc-mode-ts { color:rgba(201,185,154,.7); }
  .vc-inp-wrap { position:relative; }
  .vc-inp { width:100%; padding:16px 52px 16px 18px; border:1px solid rgba(26,26,26,.12); border-radius:1px; font-size:clamp(1.1rem,5vw,1.3rem); color:#1a1a1a; background:#fafaf8; outline:none; text-align:right; font-family:var(--font-space-mono,monospace); -webkit-appearance:none; }
  .vc-inp:focus { border-color:rgba(26,26,26,.35); }
  .vc-inp-unit { position:absolute; right:15px; top:50%; transform:translateY(-50%); font-size:13px; color:rgba(26,26,26,.35); font-family:var(--font-space-mono,monospace); pointer-events:none; }
  .vc-result { margin-top:18px; border:1px solid rgba(26,26,26,.1); border-radius:1px; overflow:hidden; }
  .vc-row { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid rgba(26,26,26,.07); background:transparent; }
  .vc-row-blue { background:rgba(26,26,255,.04); }
  .vc-row-gold { background:#111; border-bottom:none; }
  .vc-row-hl { background:rgba(201,185,154,.07); }
  .vc-row-info { flex-direction:column; align-items:flex-start; gap:2px; }
  .vc-row-rl { font-size:12px; font-weight:300; color:rgba(26,26,26,.65); font-family:var(--font-inter,sans-serif); margin:0; }
  .vc-row-rs { font-size:10px; color:rgba(26,26,26,.35); font-family:var(--font-inter,sans-serif); margin:0; }
  .vc-row-blue .vc-row-rl { color:#1a1aff; }
  .vc-row-blue .vc-row-rs { color:rgba(26,26,255,.45); }
  .vc-row-gold .vc-row-rl { font-family:var(--font-space-mono,monospace); font-size:11px; letter-spacing:.1em; text-transform:uppercase; font-weight:400; color:rgba(245,242,237,.65); }
  .vc-row-gold .vc-row-rs { color:rgba(245,242,237,.3); }
  .vc-row-rv { font-size:14px; color:#1a1a1a; font-family:var(--font-space-mono,monospace); white-space:nowrap; }
  .vc-row-blue .vc-row-rv { color:#1a1aff; }
  .vc-row-gold .vc-row-rv { font-size:clamp(1rem,4vw,1.2rem); color:#c9b99a; }
  .vc-note { margin-top:14px; padding:12px 15px; background:rgba(201,185,154,.08); border-left:3px solid rgba(201,185,154,.4); }
  .vc-note p { font-size:11px; color:rgba(26,26,26,.45); line-height:1.65; margin:0; font-family:var(--font-inter,sans-serif); word-break:keep-all; }
  @media (max-width:480px) {
    .vc-header { padding:18px 18px; }
    .vc-body { padding:18px 18px; }
    .vc-mode-tabs { flex-direction:column; gap:6px; }
    .vc-mode-tab { flex:none; }
    .vc-row { padding:12px 14px; }
  }
`;

export default function VatCalculator() {
  const [vatType,  setVatType]  = useState<VatType>('general');
  const [mode,     setMode]     = useState<CalcMode>('supply');
  const [inputStr, setInputStr] = useState('');
  const [simRate,  setSimRate]  = useState(40);

  const input = parse(inputStr);
  let supplyPrice = 0, vatAmount = 0, totalPrice = 0;

  if (input > 0) {
    if (vatType === 'general') {
      if (mode === 'supply') {
        supplyPrice = input;
        vatAmount   = Math.round(input * 0.1);
        totalPrice  = input + vatAmount;
      } else {
        supplyPrice = Math.round((input * 100) / 110);
        vatAmount   = input - supplyPrice;
        totalPrice  = input;
      }
    } else {
      vatAmount = Math.round(input * (simRate / 100) * 0.1);
    }
  }

  const hasResult = input > 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="vc-wrap">

        {/* 헤더 */}
        <div className="vc-header">
          <p style={{ fontFamily: 'var(--font-space-mono,monospace)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,185,154,0.45)', margin: '0 0 8px' }}>
            Legal &amp; Finance
          </p>
          <h3 style={{ fontFamily: 'var(--font-cormorant,Georgia,serif)', fontSize: 'clamp(1.3rem,5vw,1.9rem)', fontWeight: 400, color: '#ede8e0', margin: 0, lineHeight: 1.2 }}>
            부가세 계산기
          </h3>
          <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(201,185,154,0.55)', margin: '7px 0 0', fontWeight: 300 }}>
            공급가액 ↔ 공급대가 양방향 · 간이과세 업종별 자동 계산
          </p>
        </div>

        {/* 사업자 유형 탭 */}
        <div className="vc-type-tabs">
          {[
            { val: 'general'    as VatType, label: '일반과세자', sub: '부가세 10%' },
            { val: 'simplified' as VatType, label: '간이과세자', sub: '업종별 부가가치율' },
          ].map(t => (
            <button
              key={t.val}
              className={`vc-type-tab${vatType === t.val ? ' active' : ''}`}
              onClick={() => { setVatType(t.val); setInputStr(''); }}
            >
              <span className="vc-type-tl">{t.label}</span>
              <span className="vc-type-ts">{t.sub}</span>
            </button>
          ))}
        </div>

        <div className="vc-body">

          {/* 간이과세 업종 선택 */}
          {vatType === 'simplified' && (
            <>
              <p className="vc-label">업종 선택 (부가가치율)</p>
              <div className="vc-sim-grid">
                {SIM_RATES.map(r => (
                  <button
                    key={r.label}
                    className={`vc-sim-btn${simRate === r.rate && vatType === 'simplified' ? ' active' : ''}`}
                    onClick={() => { setSimRate(r.rate); setInputStr(''); }}
                  >
                    <span>{r.label} <em>{r.rate}%</em></span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 계산 방향 */}
          {vatType === 'general' && (
            <>
              <p className="vc-label">계산 방향</p>
              <div className="vc-mode-tabs">
                {[
                  { val: 'supply' as CalcMode, label: '공급가액 → 공급대가', desc: '부가세 추가 계산' },
                  { val: 'total'  as CalcMode, label: '공급대가 → 공급가액', desc: '부가세 역산 (÷ 1.1)' },
                ].map(m => (
                  <button
                    key={m.val}
                    className={`vc-mode-tab${mode === m.val ? ' active' : ''}`}
                    onClick={() => { setMode(m.val); setInputStr(''); }}
                  >
                    <span className="vc-mode-tl">{m.label}</span>
                    <span className="vc-mode-ts">{m.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 금액 입력 */}
          <p className="vc-label">
            {vatType === 'simplified'
              ? '공급대가 입력 (실제 수취 금액)'
              : mode === 'supply'
              ? '공급가액 입력 (부가세 제외 금액)'
              : '공급대가 입력 (부가세 포함 금액)'}
          </p>
          <div className="vc-inp-wrap">
            <input
              className="vc-inp"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputStr}
              onChange={e => setInputStr(comma(e.target.value))}
              placeholder="0"
              autoComplete="off"
            />
            <span className="vc-inp-unit">원</span>
          </div>

          {/* 실시간 결과 */}
          {hasResult && (
            <div className="vc-result">
              {vatType === 'general' ? (
                <>
                  <div className={`vc-row${mode === 'total' ? ' vc-row-hl' : ''}`}>
                    <div className="vc-row-info">
                      <p className="vc-row-rl">공급가액</p>
                      <p className="vc-row-rs">부가세 제외 순수 금액</p>
                    </div>
                    <span className="vc-row-rv">{krw(supplyPrice)}</span>
                  </div>
                  <div className="vc-row vc-row-blue">
                    <div className="vc-row-info">
                      <p className="vc-row-rl">부가가치세 (10%)</p>
                      <p className="vc-row-rs">{mode === 'supply' ? '공급가액 × 0.1' : '공급대가 × 1/11'}</p>
                    </div>
                    <span className="vc-row-rv">{krw(vatAmount)}</span>
                  </div>
                  <div className={`vc-row vc-row-gold`}>
                    <div className="vc-row-info">
                      <p className="vc-row-rl">공급대가</p>
                      <p className="vc-row-rs">부가세 포함 최종 금액</p>
                    </div>
                    <span className="vc-row-rv">{krw(totalPrice)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="vc-row">
                    <div className="vc-row-info">
                      <p className="vc-row-rl">공급대가</p>
                      <p className="vc-row-rs">실제 수취 금액</p>
                    </div>
                    <span className="vc-row-rv">{krw(input)}</span>
                  </div>
                  <div className="vc-row">
                    <div className="vc-row-info">
                      <p className="vc-row-rl">부가가치율 적용액 ({simRate}%)</p>
                      <p className="vc-row-rs">공급대가 × {simRate}%</p>
                    </div>
                    <span className="vc-row-rv">{krw(Math.round(input * simRate / 100))}</span>
                  </div>
                  <div className="vc-row vc-row-blue">
                    <div className="vc-row-info">
                      <p className="vc-row-rl">납부할 부가세</p>
                      <p className="vc-row-rs">부가가치율 적용액 × 10%</p>
                    </div>
                    <span className="vc-row-rv">{krw(vatAmount)}</span>
                  </div>
                  <div className="vc-row vc-row-gold">
                    <div className="vc-row-info">
                      <p className="vc-row-rl">간이과세 납부세액</p>
                      <p className="vc-row-rs">최종 납부 금액</p>
                    </div>
                    <span className="vc-row-rv">{krw(vatAmount)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 참고 */}
          <div className="vc-note">
            <p>
              {vatType === 'general'
                ? '한국 부가가치세율 10%. 영세율·면세 품목 별도. 신고: 국세청 홈택스 hometax.go.kr'
                : `간이과세 업종별 부가가치율 국세청 고시 기준. 연 매출 8,000만원 미만 개인사업자 적용. 납부면제: 연 납부세액 30만원 미만.`}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}