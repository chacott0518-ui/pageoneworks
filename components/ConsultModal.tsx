'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

// ──────────────────────────────────────────────────────────────
// 개인정보를 localStorage / sessionStorage / cookie에 저장하지 않는다.
// 개인정보·전화번호를 console에 출력하지 않는다.
// ──────────────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  '병원·의료',
  '법률·세무·회계·노무',
  '기업·B2B·제조',
  '브랜드·스타트업',
  '교육',
  '프랜차이즈·로컬 비즈니스',
  '쇼핑몰·커머스',
  '미디어·매거진',
  '기타',
];

const HELP_OPTIONS = [
  '구글·네이버 검색에 잘 나오고 싶어요',
  'ChatGPT·AI 답변에 회사가 나오게 하고 싶어요',
  '사이트와 콘텐츠 전체를 점검받고 싶어요',
  '지역 검색과 지도 노출을 개선하고 싶어요',
  '새 홈페이지와 검색 최적화를 함께 하고 싶어요',
  '무엇이 필요한지 잘 모르겠어요',
];

interface FormState {
  name: string; company: string; phone: string; industry: string;
  help: string; contactTime: string; website: string; message: string;
  privacyAgreed: boolean; marketingAgreed: boolean;
  companyWebsiteFax: string; // 허니팟 — 봇 탐지용
}

const EMPTY_FORM: FormState = {
  name: '', company: '', phone: '', industry: '',
  help: '', contactTime: '', website: '', message: '',
  privacyAgreed: false, marketingAgreed: false,
  companyWebsiteFax: '',
};

type Errors = Partial<Record<keyof FormState, string>>;
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const GOLD = '#C9A96E';
const BG   = '#0B1018';

function isDirty(f: FormState): boolean {
  return (
    f.name.trim() !== '' || f.company.trim() !== '' || f.phone.trim() !== '' ||
    f.industry !== '' || f.help !== '' || f.contactTime.trim() !== '' ||
    f.website.trim() !== '' || f.message.trim() !== '' ||
    f.privacyAgreed || f.marketingAgreed
  );
}

interface Props { onClose: () => void; topic?: string; }

export default function ConsultModal({ onClose, topic }: Props) {
  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]           = useState<Errors>({});
  const [submitState, setSubmit]      = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg]       = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dialogRef       = useRef<HTMLDivElement>(null);
  const firstFieldRef   = useRef<HTMLInputElement>(null);
  const previousFocused = useRef<HTMLElement | null>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);
  const errorTitleRef   = useRef<HTMLHeadingElement>(null);
  const titleId         = useId();
  const descId          = useId();
  const ariaLiveId      = useId();

  const isFormState = submitState === 'idle' || submitState === 'submitting';
  const isSubmitting = submitState === 'submitting';

  /* 마운트: 트리거 저장 + body 스크롤 잠금 + 첫 필드 포커스 */
  useEffect(() => {
    previousFocused.current = document.activeElement as HTMLElement ?? null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      previousFocused.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (submitState === 'success') {
      window.setTimeout(() => successTitleRef.current?.focus(), 80);
    }
  }, [submitState]);

  useEffect(() => {
    if (submitState === 'error') {
      window.setTimeout(() => errorTitleRef.current?.focus(), 80);
    }
  }, [submitState]);

  const requestClose = useCallback(() => {
    if (submitState === 'submitting') return;
    if (submitState === 'success' || !isDirty(form)) { onClose(); return; }
    setConfirmOpen(true);
  }, [form, onClose, submitState]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (confirmOpen) { setConfirmOpen(false); return; }
      requestClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement;
    if (e.shiftKey) {
      if (active === first || !root.contains(active)) { e.preventDefault(); last.focus(); }
    } else if (active === last) {
      e.preventDefault(); first.focus();
    }
  }, [confirmOpen, requestClose]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => { if (!p[key]) return p; const n = { ...p }; delete n[key]; return n; });
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim())    e.name    = '이름을 입력해 주세요.';
    if (!form.company.trim()) e.company = '회사명 또는 기관명을 입력해 주세요.';
    const digits = form.phone.replace(/\D/g, '');
    if (!form.phone.trim())                            e.phone = '연락처를 입력해 주세요.';
    else if (digits.length < 9 || digits.length > 11) e.phone = '연락처 형식을 확인해 주세요.';
    if (!form.industry)      e.industry     = '업종을 선택해 주세요.';
    if (!form.privacyAgreed) e.privacyAgreed = '개인정보 수집·이용에 동의해 주세요.';
    return e;
  };

  /* API 호출 — 이 블록은 수정하지 않는다 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState === 'submitting') return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const order: (keyof FormState)[] = ['name', 'company', 'phone', 'industry', 'privacyAgreed'];
      const firstErr = order.find((k) => found[k]);
      if (firstErr) window.setTimeout(() => document.getElementById(`consult-${firstErr}`)?.focus(), 0);
      return;
    }
    setSubmit('submitting');
    setErrorMsg('');
    let utmSource = '', utmMedium = '', utmCampaign = '', sourcePage = '', referrer = '';
    try {
      const sp = new URLSearchParams(window.location.search);
      utmSource   = sp.get('utm_source')   ?? '';
      utmMedium   = sp.get('utm_medium')   ?? '';
      utmCampaign = sp.get('utm_campaign') ?? '';
      sourcePage  = window.location.pathname + window.location.search;
      referrer    = document.referrer;
    } catch { /* ignore */ }
    const requestBody = {
      name: form.name.trim(), company: form.company.trim(),
      phone: form.phone.trim(), industry: form.industry,
      privacyConsent: form.privacyAgreed,
      helpType: form.help || '', preferredTime: form.contactTime || '',
      website: form.website || '', message: form.message || '',
      marketingConsent: form.marketingAgreed,
      companyWebsiteFax: form.companyWebsiteFax,
      sourcePage, referrer, utmSource, utmMedium, utmCampaign,
      topic: topic ?? '',
    };
    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (res.ok) {
        setForm(EMPTY_FORM);
        setSubmit('success');
      } else {
        const isClientError = res.status >= 400 && res.status < 500;
        setErrorMsg(isClientError
          ? '입력 정보를 다시 확인하고 시도해 주세요.'
          : '서버와 통신 중 문제가 발생했습니다.');
        setSubmit('error');
      }
    } catch {
      setErrorMsg('인터넷 연결을 확인해 주세요.');
      setSubmit('error');
    }
  };

  const handleRetry = () => {
    setSubmit('idle');
    setErrorMsg('');
    window.setTimeout(() => firstFieldRef.current?.focus(), 80);
  };

  /* ── 공통 스타일 ── */
  const labelCls = 'block font-medium text-white/85 mb-1.5 text-[14px]';
  const inputBase =
    'w-full rounded-lg bg-white/[0.06] border border-white/12 px-4 text-white ' +
    'placeholder-white/30 outline-none transition-colors ' +
    'focus-visible:border-[#C9A96E] focus-visible:ring-2 focus-visible:ring-[#C9A96E]/30 ' +
    'text-[16px]';
  const inputCls  = inputBase + ' min-h-[50px]';
  const selectCls = inputBase + ' consult-select min-h-[50px] pr-12 appearance-none cursor-pointer';
  const errCls    = 'mt-1.5 text-[13px] text-[#F2B8B5]';
  const reqMark   = <span aria-hidden="true" style={{ color: GOLD }}> *</span>;

  const fieldError = (key: keyof FormState) =>
    errors[key] ? (
      <p id={`consult-${key}-error`} className={errCls} role="alert">{errors[key]}</p>
    ) : null;

  const ariaProps = (key: keyof FormState) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `consult-${key}-error` : undefined,
  });

  /* ── Primary / Secondary 버튼 공통 클래스 ── */
  const btnPrimary =
    'flex min-h-[50px] w-full items-center justify-center rounded-xl ' +
    'px-6 text-[16px] font-semibold text-[#0B1018] outline-none ' +
    'transition-all hover:brightness-110 active:scale-[0.98] ' +
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1018] focus-visible:ring-[#C9A96E] ' +
    'disabled:cursor-not-allowed disabled:opacity-60 ' +
    'motion-reduce:transition-none motion-reduce:hover:brightness-100 motion-reduce:active:scale-100';
  const btnSecondary =
    'flex min-h-[48px] w-full items-center justify-center rounded-xl ' +
    'border border-white/20 px-6 text-[15px] font-medium text-white/70 outline-none ' +
    'transition-colors hover:border-white/40 hover:bg-white/[0.04] hover:text-white/90 ' +
    'active:bg-white/[0.06] ' +
    'focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50 ' +
    'disabled:cursor-not-allowed disabled:opacity-40';

  /* ── 성공 compact panel ── */
  const successPanel = (
    <div className="relative px-6 pb-9 pt-10 md:px-8">
      {/* 닫기 X */}
      <button
        type="button"
        onClick={requestClose}
        aria-label="닫기"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full
          text-white/40 outline-none transition-colors
          hover:bg-white/10 hover:text-white/80
          focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center">
        {/* 완료 아이콘 */}
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ border: `1.5px solid ${GOLD}`, background: 'rgba(201,169,110,0.08)' }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h2
          ref={successTitleRef}
          id={titleId}
          tabIndex={-1}
          className="text-[19px] font-semibold text-white outline-none"
          style={{ wordBreak: 'keep-all' }}
        >
          상담 신청이 접수되었습니다
        </h2>

        <p
          className="mt-3 text-[14px] leading-relaxed text-white/70"
          style={{ wordBreak: 'keep-all' }}
        >
          입력하신 내용을 확인한 뒤 순차적으로 연락드리겠습니다.
        </p>

        <p
          className="mt-2 text-[13px] leading-relaxed text-white/50"
          style={{ wordBreak: 'keep-all' }}
        >
          상담 내용이 담당자에게 안전하게 전달되었습니다.
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`${btnPrimary} mt-8 sm:mx-auto sm:w-auto sm:min-w-[200px]`}
          style={{ background: GOLD }}
        >
          확인
        </button>
      </div>
    </div>
  );

  /* ── 오류 compact panel ── */
  const errorPanel = (
    <div className="relative px-6 pb-9 pt-10 md:px-8" role="alert" aria-atomic="true">
      {/* 닫기 X */}
      <button
        type="button"
        onClick={requestClose}
        aria-label="닫기"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full
          text-white/40 outline-none transition-colors
          hover:bg-white/10 hover:text-white/80
          focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center">
        {/* 오류 아이콘 */}
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ border: '1.5px solid rgba(242,184,181,0.45)', background: 'rgba(242,184,181,0.06)' }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="rgba(242,184,181,0.8)" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>

        <h2
          ref={errorTitleRef}
          tabIndex={-1}
          className="text-[19px] font-semibold text-white outline-none"
          style={{ wordBreak: 'keep-all' }}
        >
          상담 신청을 전달하지 못했습니다
        </h2>

        <p
          className="mt-3 text-[14px] leading-relaxed text-white/70"
          style={{ wordBreak: 'keep-all' }}
        >
          잠시 후 다시 시도해 주세요.{' '}
          <span className="text-white/55">입력하신 내용은 화면에 그대로 유지됩니다.</span>
        </p>

        {errorMsg && (
          <p
            className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5
              text-[13px] leading-relaxed text-white/55"
            style={{ overflowWrap: 'anywhere', wordBreak: 'keep-all' }}
          >
            {errorMsg}
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleRetry}
            className={`${btnPrimary} sm:flex-1`}
            style={{ background: GOLD }}
          >
            다시 시도
          </button>
          <button
            type="button"
            onClick={requestClose}
            className={`${btnSecondary} sm:flex-1`}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );

  /* ── 입력 폼 (idle / submitting) ── */
  const formPanel = (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      {/* 스크롤 영역 */}
      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-7"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <p id={descId} className="mb-5 text-[14px] leading-relaxed text-white/55"
          style={{ wordBreak: 'keep-all' }}>
          간단한 정보만 남겨 주시면 검색·AI 노출 현황을 살펴보고 연락드립니다.{' '}
          <span style={{ color: GOLD }}>*</span> 는 필수 항목입니다.
        </p>

        <div className="flex flex-col gap-4">
          {/* 이름 */}
          <div>
            <label htmlFor="consult-name" className={labelCls}>이름{reqMark}</label>
            <input ref={firstFieldRef} id="consult-name" type="text" autoComplete="name"
              className={inputCls} value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="홍길동" disabled={isSubmitting} {...ariaProps('name')} />
            {fieldError('name')}
          </div>

          {/* 회사명 */}
          <div>
            <label htmlFor="consult-company" className={labelCls}>회사명 또는 기관명{reqMark}</label>
            <input id="consult-company" type="text" autoComplete="organization"
              className={inputCls} value={form.company}
              onChange={(e) => update('company', e.target.value)}
              placeholder="예: OO병원 / OO법률사무소 / OO브랜드"
              disabled={isSubmitting} {...ariaProps('company')} />
            {fieldError('company')}
          </div>

          {/* 연락처 */}
          <div>
            <label htmlFor="consult-phone" className={labelCls}>연락처{reqMark}</label>
            <input id="consult-phone" type="tel" inputMode="tel" autoComplete="tel"
              className={inputCls} value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="010-0000-0000" disabled={isSubmitting} {...ariaProps('phone')} />
            {fieldError('phone')}
          </div>

          {/* 업종 */}
          <div>
            <label htmlFor="consult-industry" className={labelCls}>업종{reqMark}</label>
            <select id="consult-industry" className={selectCls} value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
              disabled={isSubmitting} {...ariaProps('industry')}>
              <option value="">선택해 주세요</option>
              {INDUSTRY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {fieldError('industry')}
          </div>

          {/* 허니팟 */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <label htmlFor="consult-honeypot">Website (leave blank)</label>
            <input id="consult-honeypot" type="text" name="companyWebsiteFax"
              tabIndex={-1} autoComplete="off"
              value={form.companyWebsiteFax}
              onChange={(e) => update('companyWebsiteFax', e.target.value)} />
          </div>

          {/* 선택 입력 */}
          <div className="mt-1 border-t border-white/8 pt-4">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/35"
              style={{ fontFamily: 'var(--font-space-mono)' }}>
              선택 입력
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="consult-help" className={labelCls}>어떤 도움이 필요하세요?</label>
                <select id="consult-help" className={selectCls} value={form.help}
                  onChange={(e) => update('help', e.target.value)} disabled={isSubmitting}>
                  <option value="">선택 안 함</option>
                  {HELP_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="consult-time" className={labelCls}>연락받기 좋은 시간</label>
                <input id="consult-time" type="text" className={inputCls}
                  value={form.contactTime}
                  onChange={(e) => update('contactTime', e.target.value)}
                  placeholder="예: 평일 오후 2~5시" disabled={isSubmitting} />
              </div>

              <div>
                <label htmlFor="consult-website" className={labelCls}>웹사이트 주소</label>
                <input id="consult-website" type="url" inputMode="url" autoComplete="url"
                  className={inputCls} value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                  placeholder="https://" disabled={isSubmitting}
                  style={{ overflowWrap: 'anywhere' }} />
              </div>

              <div>
                <label htmlFor="consult-message" className={labelCls}>문의 내용</label>
                <textarea id="consult-message" rows={3}
                  className={`${inputBase} min-h-[96px] resize-y py-3.5 leading-relaxed`}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="현재 고민이나 목표를 자유롭게 적어 주세요."
                  disabled={isSubmitting} />
              </div>
            </div>
          </div>

          {/* 동의 영역 */}
          <div className="mt-1 flex flex-col gap-3 border-t border-white/8 pt-4">
            <div>
              <label htmlFor="consult-privacyAgreed"
                className="flex cursor-pointer items-start gap-3">
                <input id="consult-privacyAgreed" type="checkbox"
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#C9A96E]"
                  checked={form.privacyAgreed}
                  onChange={(e) => update('privacyAgreed', e.target.checked)}
                  disabled={isSubmitting} {...ariaProps('privacyAgreed')} />
                <span className="text-[14px] leading-relaxed text-white/75"
                  style={{ wordBreak: 'keep-all' }}>
                  <span className="font-medium text-white/90">[필수]</span>{' '}
                  개인정보 수집·이용에 동의합니다.{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: GOLD }}
                    onClick={(e) => e.stopPropagation()}>
                    자세히 보기
                  </a>
                </span>
              </label>
              <p className="mt-1.5 pl-[30px] text-[12px] leading-relaxed text-white/45"
                style={{ wordBreak: 'keep-all' }}>
                수집 항목: 이름, 회사명·기관명, 연락처, 업종 및 선택 입력 정보 · 이용 목적: 상담
                신청 확인 및 일정 안내 · 보유 기간: 상담 목적 달성 후 파기. 동의 거부 시 상담예약
                이용이 제한될 수 있습니다.
              </p>
              {fieldError('privacyAgreed')}
            </div>

            <div>
              <label htmlFor="consult-marketingAgreed"
                className="flex cursor-pointer items-start gap-3">
                <input id="consult-marketingAgreed" type="checkbox"
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#C9A96E]"
                  checked={form.marketingAgreed}
                  onChange={(e) => update('marketingAgreed', e.target.checked)}
                  disabled={isSubmitting} />
                <span className="text-[14px] leading-relaxed text-white/75"
                  style={{ wordBreak: 'keep-all' }}>
                  <span className="font-medium text-white/55">[선택]</span>{' '}
                  광고성 정보 수신에 동의합니다.
                </span>
              </label>
              <p className="mt-1.5 pl-[30px] text-[12px] leading-relaxed text-white/45"
                style={{ wordBreak: 'keep-all' }}>
                PAGEONEWORKS의 서비스·콘텐츠·세미나·프로모션 정보를 전화 또는 문자로 받습니다.
                동의하지 않아도 상담예약 이용 가능하며, 언제든 철회할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="h-8" aria-hidden="true" />
        </div>
      </div>

      {/* 고정 하단 액션 */}
      <div
        className="shrink-0 border-t border-white/8 bg-[#0B1018] px-4 pt-4 md:px-7"
        style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}
      >
        <p className="mb-2.5 text-center text-[12px] leading-relaxed text-white/40"
          style={{ wordBreak: 'keep-all' }}>
          입력하신 내용은 상담 응대를 위해 전달됩니다.
        </p>
        <button
          type="submit" disabled={isSubmitting} aria-busy={isSubmitting}
          className={btnPrimary}
          style={{ background: GOLD }}
        >
          {isSubmitting ? '신청 중…' : '상담 신청하기'}
        </button>
        <button
          type="button" onClick={requestClose} disabled={isSubmitting}
          className={`${btnSecondary} mt-3`}
        >
          취소
        </button>
      </div>
    </form>
  );

  return (
    <>
      {/* 루트 래퍼 — 폼은 하단 정렬(모바일 바텀시트), 성공·오류는 중앙 정렬 */}
      <div
        className={
          isFormState
            ? 'fixed inset-0 z-[100000] flex items-end justify-center md:items-center'
            : 'fixed inset-0 z-[100000] flex items-center justify-center px-3'
        }
        onKeyDown={handleKeyDown}
      >
        {/* 오버레이: 클릭 이벤트 없음, 배경 클릭으로 닫히지 않는다 */}
        <div
          className="consult-overlay pointer-events-none absolute inset-0 bg-black/72"
          style={{ backdropFilter: 'blur(2px)' }}
          aria-hidden="true"
        />

        {/* 다이얼로그 — 폼과 compact 상태별로 크기/모서리 분리 */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          {...(isFormState
            ? { 'aria-labelledby': titleId, 'aria-describedby': descId }
            : { 'aria-label': submitState === 'success' ? '상담 신청 접수 완료' : '상담 신청 오류' }
          )}
          onClick={(e) => e.stopPropagation()}
          className={
            isFormState
              /* 폼: 모바일 바텀시트, 데스크톱 센터 모달 */
              ? 'consult-form-dialog relative z-10 flex flex-col overflow-hidden ' +
                'border border-white/10 ' +
                'w-full max-w-[100vw] max-h-[100dvh] rounded-t-2xl ' +
                'md:max-h-[88dvh] md:w-[min(640px,92vw)] md:rounded-2xl'
              /* success / error: compact 센터 다이얼로그 */
              : 'consult-compact-dialog relative z-10 overflow-hidden ' +
                'border border-white/10 ' +
                'w-full max-w-[440px] rounded-2xl'
          }
          style={{ background: BG, boxSizing: 'border-box' }}
        >
          {/* 폼 상태에만 헤더 표시 */}
          {isFormState && (
            <div className="flex shrink-0 items-start justify-between gap-4
              border-b border-white/8 px-4 py-4 md:px-7 md:py-5">
              <div className="min-w-0">
                <p
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ fontFamily: 'var(--font-space-mono)', color: GOLD }}
                >
                  PAGEONEWORKS · 상담예약
                </p>
                <h2
                  id={titleId}
                  className="mt-1.5 text-[20px] font-semibold leading-snug text-white md:text-[22px]"
                  style={{ wordBreak: 'keep-all', overflowWrap: 'anywhere' }}
                >
                  검색·AI 노출 무료 진단 신청
                </h2>
              </div>
              <button
                type="button"
                onClick={requestClose}
                disabled={isSubmitting}
                aria-label="상담예약 창 닫기"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                  text-white/50 outline-none transition-colors
                  hover:bg-white/10 hover:text-white
                  focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50
                  disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* aria-live 상태 알림 */}
          <div
            id={ariaLiveId}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {isSubmitting ? '신청을 처리하고 있습니다.' : ''}
            {submitState === 'success' ? '상담 신청이 접수되었습니다.' : ''}
            {submitState === 'error' ? '상담 신청을 전달하지 못했습니다.' : ''}
          </div>

          {/* 상태별 패널 */}
          {submitState === 'success' ? successPanel
            : submitState === 'error' ? errorPanel
            : formPanel}
        </div>
      </div>

      {/* 닫기 확인 다이얼로그 */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100001] flex items-center justify-center px-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <div
            className="relative w-full max-w-[360px] rounded-2xl border border-white/12 p-6"
            style={{ background: '#111820' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p id="confirm-title" className="text-[17px] font-semibold text-white"
              style={{ wordBreak: 'keep-all' }}>
              입력 내용을 삭제할까요?
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/60"
              style={{ wordBreak: 'keep-all' }}>
              지금까지 입력한 내용이 모두 사라집니다.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => { setConfirmOpen(false); onClose(); }}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl
                  bg-red-600/80 text-[14px] font-semibold text-white outline-none
                  transition-colors hover:bg-red-600
                  focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                닫기
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmOpen(false)}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl
                  border border-white/15 text-[14px] font-medium text-white/75 outline-none
                  transition-colors hover:border-white/30 hover:text-white
                  focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40"
              >
                계속 입력하기
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .consult-overlay      { animation: consultFadeIn   .22s ease both; }
        .consult-form-dialog  { animation: consultSlideUp  .28s cubic-bezier(0.33,1,0.68,1) both; }
        .consult-compact-dialog { animation: consultPopIn  .2s  cubic-bezier(0.33,1,0.68,1) both; }
        @media (min-width: 768px) {
          .consult-form-dialog { animation: consultPopIn .22s cubic-bezier(0.33,1,0.68,1) both; }
        }
        @keyframes consultFadeIn  { from { opacity:0 }                                    to { opacity:1 } }
        @keyframes consultSlideUp { from { transform:translateY(100%) }                   to { transform:translateY(0) } }
        @keyframes consultPopIn   { from { opacity:0; transform:translateY(6px) scale(.97) } to { opacity:1; transform:none } }
        @media (prefers-reduced-motion: reduce) {
          .consult-overlay, .consult-form-dialog, .consult-compact-dialog { animation: none !important; }
        }
        select.consult-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(245%2C242%2C237%2C0.4)' stroke-width='1.8' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 18px center;
        }
      `}</style>
    </>
  );
}
