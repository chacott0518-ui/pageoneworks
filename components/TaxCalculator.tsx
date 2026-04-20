'use client';

import React, { useState, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────
   2026 종합소득세 세율표 (소득세법 기준)
───────────────────────────────────────────────────────── */
const BRACKETS: { max: number; rate: number; deduction: number }[] = [
  { max: 14_000_000,    rate: 0.06, deduction: 0 },
  { max: 50_000_000,    rate: 0.15, deduction: 1_260_000 },
  { max: 88_000_000,    rate: 0.24, deduction: 5_760_000 },
  { max: 150_000_000,   rate: 0.35, deduction: 15_440_000 },
  { max: 300_000_000,   rate: 0.38, deduction: 19_940_000 },
  { max: 500_000_000,   rate: 0.40, deduction: 25_940_000 },
  { max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { max: Infinity,      rate: 0.45, deduction: 65_940_000 },
];

function calcTax(taxable: number): { tax: number; rate: number; rateLabel: string } {
  if (taxable <= 0) return { tax: 0, rate: 0, rateLabel: '0%' };
  for (const b of BRACKETS) {
    if (taxable <= b.max) {
      return {
        tax: Math.max(0, taxable * b.rate - b.deduction),
        rate: b.rate,
        rateLabel: `${Math.round(b.rate * 100)}%`,
      };
    }
  }
  return { tax: 0, rate: 0, rateLabel: '45%' };
}

/* 근로소득공제 (소득세법 제47조) */
function empDeduction(inc: number): number {
  if (inc <= 5_000_000)   return inc * 0.70;
  if (inc <= 15_000_000)  return 3_500_000  + (inc - 5_000_000)  * 0.40;
  if (inc <= 45_000_000)  return 7_500_000  + (inc - 15_000_000) * 0.15;
  if (inc <= 100_000_000) return 12_000_000 + (inc - 45_000_000) * 0.05;
  return 14_750_000;
}

const FREELANCER_RATE = 0.60; // 단순경비율 대표값

/* ─── 유틸 ─── */
const krw = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`;
const pct = (n: number) => `${n.toFixed(2)}%`;
const parse = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
const comma = (s: string): string => {
  const n = s.replace(/[^0-9]/g, '');
  return n ? parseInt(n, 10).toLocaleString('ko-KR') : '';
};

type IncomeType = 'employee' | 'business' | 'freelancer';

interface Res {
  gross: number;
  incD: number;
  perD: number;
  penD: number;
  taxable: number;
  rateLabel: string;
  incomeTax: number;
  localTax: number;
  totalTax: number;
  net: number;
  effectiveRate: number;
}

const CSS = `
  .tc-wrap { margin:32px 0; border:1px solid rgba(26,26,26,0.1); border-radius:2px; overflow:hidden; background:#fff; font-family:inherit; }
  .tc-wrap * { box-sizing:border-box; }
  .tc-header { background:#111; padding:22px 24px; }
  .tc-body { padding:22px 24px; }
  .tc-result { background:#f8f7f4; border-top:1px solid rgba(26,26,26,0.08); padding:22px 24px; }
  .tc-tabs { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
  .tc-tab { flex:1; min-width:120px; padding:11px 14px; border:1px solid rgba(26,26,26,0.12); background:transparent; cursor:pointer; border-radius:1px; transition:all .2s; text-align:left; }
  .tc-tab.active { border-color:#1a1a1a; background:#1a1a1a; }
  .tc-tab-l { font-size:11px; letter-spacing:.06em; display:block; margin-bottom:3px; color:rgba(26,26,26,.65); }
  .tc-tab.active .tc-tab-l { color:#ede8e0; }
  .tc-tab-s { font-size:10px; color:rgba(26,26,26,.35); }
  .tc-tab.active .tc-tab-s { color:rgba(201,185,154,.75); }
  .tc-label { font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:rgba(26,26,26,.4); margin:0 0 9px; font-family:var(--font-space-mono,monospace); }
  .tc-fl { font-size:13px; font-weight:500; color:#1a1a1a; display:block; margin-bottom:4px; font-family:var(--font-inter,sans-serif); }
  .tc-fs { font-size:11px; color:rgba(26,26,26,.45); display:block; margin-bottom:6px; font-family:var(--font-inter,sans-serif); }
  .tc-field { margin-bottom:16px; }
  .tc-inp-wrap { position:relative; }
  .tc-inp { width:100%; padding:13px 48px 13px 14px; border:1px solid rgba(26,26,26,.12); border-radius:1px; font-size:16px; color:#1a1a1a; background:#fafaf8; outline:none; text-align:right; font-family:var(--font-space-mono,monospace); -webkit-appearance:none; }
  .tc-inp:focus { border-color:rgba(26,26,26,.35); }
  .tc-inp-unit { position:absolute; right:13px; top:50%; transform:translateY(-50%); font-size:12px; color:rgba(26,26,26,.4); font-family:var(--font-space-mono,monospace); pointer-events:none; }
  .tc-counter { display:flex; align-items:center; border:1px solid rgba(26,26,26,.12); width:fit-content; border-radius:1px; overflow:hidden; }
  .tc-cnt-btn { width:48px; height:48px; border:none; background:transparent; cursor:pointer; font-size:20px; color:#1a1a1a; display:flex; align-items:center; justify-content:center; -webkit-tap-highlight-color:transparent; }
  .tc-cnt-btn:active { background:rgba(26,26,26,.06); }
  .tc-cnt-val { width:64px; height:48px; background:#fafaf8; display:flex; align-items:center; justify-content:center; font-size:15px; color:#1a1a1a; border-left:1px solid rgba(26,26,26,.1); border-right:1px solid rgba(26,26,26,.1); font-family:var(--font-space-mono,monospace); }
  .tc-calc-btn { width:100%; padding:16px; background:#1a1a1a; border:none; cursor:pointer; border-radius:1px; margin-top:8px; font-size:12px; letter-spacing:.15em; text-transform:uppercase; color:#ede8e0; font-family:var(--font-space-mono,monospace); -webkit-tap-highlight-color:transparent; transition:background .2s; }
  .tc-calc-btn:active { background:#000; }
  .tc-divider { height:1px; background:rgba(26,26,26,.08); margin:12px 0; }
  .tc-divider-bold { height:1px; background:rgba(26,26,26,.12); margin:10px 0; }
  .tc-rrow { display:flex; justify-content:space-between; align-items:baseline; padding:7px 0; border-bottom:1px solid rgba(26,26,26,.06); }
  .tc-rrow-bold { display:flex; justify-content:space-between; align-items:baseline; padding:10px 0; border-bottom:1px solid rgba(26,26,26,.06); }
  .tc-rl { font-size:12px; font-weight:300; color:rgba(26,26,26,.6); font-family:var(--font-inter,sans-serif); }
  .tc-rv { font-size:13px; color:rgba(26,26,26,.75); font-family:var(--font-space-mono,monospace); }
  .tc-rl-bold { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:#1a1a1a; font-family:var(--font-space-mono,monospace); }
  .tc-rv-bold { font-size:15px; font-weight:600; color:#1a1a1a; font-family:var(--font-space-mono,monospace); }
  .tc-rate-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(26,26,26,.06); }
  .tc-rate-badge { font-size:17px; font-weight:700; color:#1a1aff; font-family:var(--font-space-mono,monospace); }
  .tc-total-grid { background:#111; padding:20px; margin-top:16px; border-radius:1px; display:grid; grid-template-columns:1fr 1fr; }
  .tc-total-item { text-align:center; padding:0 8px; }
  .tc-total-item:last-child { border-left:1px solid rgba(245,242,237,.08); }
  .tc-total-il { font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:rgba(245,242,237,.35); margin:0 0 8px; font-family:var(--font-space-mono,monospace); }
  .tc-total-iv { font-size:clamp(1rem,3vw,1.45rem); font-weight:400; color:#ede8e0; margin:0; font-family:var(--font-cormorant,Georgia,serif); line-height:1.2; }
  .tc-total-is { font-size:9px; color:rgba(201,185,154,.5); margin:5px 0 0; font-family:var(--font-space-mono,monospace); }
  .tc-note { margin-top:14px; padding:12px 15px; background:rgba(201,185,154,.08); border-left:3px solid rgba(201,185,154,.4); }
  .tc-note p { font-size:11px; color:rgba(26,26,26,.45); line-height:1.65; margin:0; font-family:var(--font-inter,sans-serif); word-break:keep-all; }
  .tc-reset-btn { background:transparent; border:1px solid rgba(26,26,26,.12); padding:10px 20px; cursor:pointer; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:rgba(26,26,26,.45); margin-top:14px; border-radius:1px; font-family:var(--font-space-mono,monospace); -webkit-tap-highlight-color:transparent; }
  @media (max-width:480px) {
    .tc-header { padding:18px 18px; }
    .tc-body { padding:18px 18px; }
    .tc-result { padding:18px 18px; }
    .tc-tab { flex:0 0 calc(50% - 4px); min-width:0; }
    .tc-total-grid { grid-template-columns:1fr; gap:16px; }
    .tc-total-item:last-child { border-left:none; border-top:1px solid rgba(245,242,237,.08); padding-top:16px; }
  }
`;

export default function TaxCalculator() {
  const [type,    setType]    = useState<IncomeType>('employee');
  const [income,  setIncome]  = useState('');
  const [expense, setExpense] = useState('');
  const [deps,    setDeps]    = useState(0);
  const [pension, setPension] = useState('');
  const [res,     setRes]     = useState<Res | null>(null);

  const handleCalc = useCallback(() => {
    const gross = parse(income);
    if (!gross) return;
    const exp = parse(expense), pen = parse(pension);
    const incD =
      type === 'employee'   ? empDeduction(gross) :
      type === 'freelancer' ? (exp || Math.round(gross * FREELANCER_RATE)) :
      exp;
    const perD = 1_500_000 * (1 + deps);
    const taxable = Math.max(0, gross - incD - perD - pen);
    const { tax: rawTax, rateLabel } = calcTax(taxable);
    const incomeTax = Math.round(rawTax);
    const localTax  = Math.round(incomeTax * 0.1);
    const totalTax  = incomeTax + localTax;
    setRes({ gross, incD, perD, penD: pen, taxable, rateLabel, incomeTax, localTax, totalTax, net: gross - totalTax, effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0 });
  }, [type, income, expense, deps, pension]);

  const reset = () => { setIncome(''); setExpense(''); setDeps(0); setPension(''); setRes(null); };

  const TYPES = [
    { val: 'employee'   as IncomeType, label: '근로소득',  sub: '직장인·급여소득자' },
    { val: 'business'   as IncomeType, label: '사업소득',  sub: '자영업·개인사업자' },
    { val: 'freelancer' as IncomeType, label: '프리랜서',  sub: '3.3% 원천징수' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="tc-wrap">

        {/* 헤더 */}
        <div className="tc-header">
          <p style={{ fontFamily: 'var(--font-space-mono,monospace)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(201,185,154,0.5)', margin: '0 0 8px' }}>
            Legal &amp; Finance · 2026
          </p>
          <h3 style={{ fontFamily: 'var(--font-cormorant,Georgia,serif)', fontSize: 'clamp(1.3rem,5vw,1.9rem)', fontWeight: 400, color: '#ede8e0', margin: 0, lineHeight: 1.2 }}>
            종합소득세 계산기
          </h3>
          <p style={{ fontFamily: 'var(--font-inter,sans-serif)', fontSize: 12, color: 'rgba(201,185,154,0.55)', margin: '7px 0 0', fontWeight: 300 }}>
            2026년 귀속 세율 기준 · 참고용 계산기
          </p>
        </div>

        {/* 입력 */}
        <div className="tc-body">
          <p className="tc-label">소득 유형</p>
          <div className="tc-tabs">
            {TYPES.map(t => (
              <button
                key={t.val}
                className={`tc-tab${type === t.val ? ' active' : ''}`}
                onClick={() => { setType(t.val); setRes(null); }}
              >
                <span className="tc-tab-l">{t.label}</span>
                <span className="tc-tab-s">{t.sub}</span>
              </button>
            ))}
          </div>

          <div className="tc-divider" />

          {/* 연간 수입 */}
          <div className="tc-field">
            <label className="tc-fl">
              연간 총 수입금액 <span style={{ color: '#e53e3e' }}>*</span>
            </label>
            <span className="tc-fs">
              {type === 'employee' && '세전 연봉 (연간 총급여)'}
              {type === 'business' && '연간 총 매출액'}
              {type === 'freelancer' && '3.3% 공제 전 총 수령액'}
            </span>
            <div className="tc-inp-wrap">
              <input
                className="tc-inp"
                inputMode="numeric"
                pattern="[0-9]*"
                value={income}
                onChange={e => { setIncome(comma(e.target.value)); setRes(null); }}
                placeholder="0"
              />
              <span className="tc-inp-unit">원</span>
            </div>
          </div>

          {/* 경비 */}
          {type !== 'employee' && (
            <div className="tc-field">
              <label className="tc-fl">
                {type === 'freelancer' ? '필요경비 (선택)' : '사업 필요경비'}
              </label>
              <span className="tc-fs">
                {type === 'freelancer'
                  ? `비워두면 단순경비율 ${Math.round(FREELANCER_RATE * 100)}% 자동 적용`
                  : '장부상 연간 총 비용'}
              </span>
              <div className="tc-inp-wrap">
                <input
                  className="tc-inp"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={expense}
                  onChange={e => { setExpense(comma(e.target.value)); setRes(null); }}
                  placeholder={type === 'freelancer' ? '비워두면 자동 계산' : '0'}
                />
                <span className="tc-inp-unit">원</span>
              </div>
            </div>
          )}

          {/* 부양가족 */}
          <div className="tc-field">
            <label className="tc-fl">부양가족 수</label>
            <span className="tc-fs">본인 제외 · 1인당 기본공제 150만원</span>
            <div className="tc-counter">
              <button className="tc-cnt-btn" onClick={() => { setDeps(d => Math.max(0, d - 1)); setRes(null); }} aria-label="감소">−</button>
              <div className="tc-cnt-val">{deps}명</div>
              <button className="tc-cnt-btn" onClick={() => { setDeps(d => Math.min(10, d + 1)); setRes(null); }} aria-label="증가">+</button>
            </div>
          </div>

          {/* 국민연금 */}
          <div className="tc-field">
            <label className="tc-fl">국민연금 납부액 (연간)</label>
            <span className="tc-fs">소득공제 항목 · 모르면 비워두세요</span>
            <div className="tc-inp-wrap">
              <input
                className="tc-inp"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pension}
                onChange={e => { setPension(comma(e.target.value)); setRes(null); }}
                placeholder="0"
              />
              <span className="tc-inp-unit">원</span>
            </div>
          </div>

          <button className="tc-calc-btn" onClick={handleCalc}>
            세금 계산하기 →
          </button>
        </div>

        {/* 결과 */}
        {res && (
          <div className="tc-result">
            <p className="tc-label" style={{ marginBottom: 16 }}>
              계산 결과 — 2026년 귀속 기준
            </p>

            <div className="tc-rrow">
              <span className="tc-rl">총 수입금액</span>
              <span className="tc-rv">{krw(res.gross)}</span>
            </div>
            <div className="tc-rrow">
              <span className="tc-rl">
                (-) {type === 'employee' ? '근로소득공제' : type === 'freelancer' ? '필요경비' : '사업 필요경비'}
              </span>
              <span className="tc-rv">-{krw(res.incD)}</span>
            </div>
            <div className="tc-rrow">
              <span className="tc-rl">(-) 인적공제 (본인+부양가족 {deps}명)</span>
              <span className="tc-rv">-{krw(res.perD)}</span>
            </div>
            {res.penD > 0 && (
              <div className="tc-rrow">
                <span className="tc-rl">(-) 국민연금 납입 공제</span>
                <span className="tc-rv">-{krw(res.penD)}</span>
              </div>
            )}

            <div className="tc-divider-bold" />

            <div className="tc-rrow-bold">
              <span className="tc-rl-bold">과세표준</span>
              <span className="tc-rv-bold">{krw(res.taxable)}</span>
            </div>

            <div className="tc-rate-row">
              <span className="tc-rl">적용 세율 구간</span>
              <span className="tc-rate-badge">{res.rateLabel}</span>
            </div>

            <div className="tc-divider-bold" />

            <div className="tc-rrow">
              <span className="tc-rl">소득세 (산출세액)</span>
              <span className="tc-rv">{krw(res.incomeTax)}</span>
            </div>
            <div className="tc-rrow">
              <span className="tc-rl">지방소득세 (소득세 × 10%)</span>
              <span className="tc-rv">{krw(res.localTax)}</span>
            </div>

            {/* 총결과 박스 */}
            <div className="tc-total-grid">
              <div className="tc-total-item">
                <p className="tc-total-il">총 납부세액</p>
                <p className="tc-total-iv">{krw(res.totalTax)}</p>
                <p className="tc-total-is">실효세율 {pct(res.effectiveRate)}</p>
              </div>
              <div className="tc-total-item">
                <p className="tc-total-il">세후 실수령액</p>
                <p className="tc-total-iv">{krw(res.net)}</p>
                <p className="tc-total-is">연간 기준</p>
              </div>
            </div>

            <div className="tc-note">
              <p>본 계산기는 참고용이며 실제 세액과 차이가 있을 수 있습니다. 정확한 신고·납부는 국세청 홈택스(hometax.go.kr)를 이용하시거나 세무사 상담을 권장합니다.</p>
            </div>

            <button className="tc-reset-btn" onClick={reset}>
              다시 계산하기
            </button>
          </div>
        )}

      </div>
    </>
  );
}