'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { siteConfig } from '@/lib/site.config';

// ──────────────────────────────────────────────────────────────
// 추후 연결 지점:
// 실제 상담 접수는 어떤 외부 저장소에도 연결되어 있지 않다.
// 연결 시 submitConsult 본문만 교체. 개인정보처리방침 재검토 필요.
// 개인정보를 localStorage / sessionStorage / cookie에 저장하지 않는다.
// ──────────────────────────────────────────────────────────────
export interface ConsultPayload {
  name: string;
  company: string;
  phone: string;
  industry: string;
  help?: string;
  contactTime?: string;
  website?: string;
  message?: string;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
  topic?: string;
}

export interface ConsultSubmitResult { ok: boolean; preview: true; }

export async function submitConsult(_payload: ConsultPayload): Promise<ConsultSubmitResult> {
  // 의도적으로 실제 전송하지 않는다(미리보기 단계).
  // 외부 API 호출·저장·로그 없음. 개인정보를 console에 남기지 않는다.
  return { ok: false, preview: true };
}

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
}

const EMPTY_FORM: FormState = {
  name: '', company: '', phone: '', industry: '',
  help: '', contactTime: '', website: '', message: '',
  privacyAgreed: false, marketingAgreed: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

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
  const [form, setForm]             = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors]         = useState<Errors>({});
  const [previewDone, setPreviewDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dialogRef        = useRef<HTMLDivElement>(null);
  const firstFieldRef    = useRef<HTMLInputElement>(null);
  const previousFocused  = useRef<HTMLElement | null>(null);
  const titleId          = useId();
  const descId           = useId();

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

  /* 닫기 요청: 입력 내용이 있으면 확인창, 없으면 즉시 닫기 */
  const requestClose = useCallback(() => {
    if (previewDone || !isDirty(form)) { onClose(); return; }
    setConfirmOpen(true);
  }, [form, onClose, previewDone]);

  /* ESC: 닫기 요청 / Tab: focus trap */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      // 확인창이 이미 열려 있으면 확인창을 닫는다
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
    if (!form.name.trim()) e.name = '이름을 입력해 주세요.';
    if (!form.company.trim()) e.company = '회사명 또는 기관명을 입력해 주세요.';
    const digits = form.phone.replace(/\D/g, '');
    if (!form.phone.trim())                          e.phone = '연락처를 입력해 주세요.';
    else if (digits.length < 9 || digits.length > 11) e.phone = '연락처 형식을 확인해 주세요.';
    if (!form.industry)      e.industry = '업종을 선택해 주세요.';
    if (!form.privacyAgreed) e.privacyAgreed = '개인정보 수집·이용에 동의해 주세요.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const order: (keyof FormState)[] = ['name', 'company', 'phone', 'industry', 'privacyAgreed'];
      const firstErr = order.find((k) => found[k]);
      if (firstErr) window.setTimeout(() => document.getElementById(`consult-${firstErr}`)?.focus(), 0);
      return;
    }
    void submitConsult({
      name: form.name.trim(), company: form.company.trim(), phone: form.phone.trim(),
      industry: form.industry, help: form.help || undefined,
      contactTime: form.contactTime || undefined, website: form.website || undefined,
      message: form.message || undefined, privacyAgreed: form.privacyAgreed,
      marketingAgreed: form.marketingAgreed, topic,
    });
    setPreviewDone(true);
  };

  /* ── 공통 클래스 ── */
  const labelCls = 'block font-medium text-white/85 mb-1.5' +
    ' text-[14px] md:text-[13px]'; // 모바일 14px, 데스크톱 13px
  const inputBase =
    'w-full rounded-lg bg-white/[0.05] border border-white/12 px-4 text-white ' +
    'placeholder-white/30 outline-none transition-colors ' +
    'focus-visible:border-[#C9A96E] focus-visible:ring-2 focus-visible:ring-[#C9A96E]/30 ' +
    'text-[16px] md:text-[15px]'; // 모바일 16px (iOS zoom 방지), 데스크톱 15px
  const inputCls  = inputBase + ' min-h-[50px] md:min-h-[48px]';
  // select: appearance:none + consult-select 클래스에서 커스텀 화살표 처리
  // 데이터 URI는 <style> 블록으로 분리 (webpack CSS loader 호환)
  const selectCls = inputBase +
    ' consult-select min-h-[50px] md:min-h-[48px] pr-12 appearance-none cursor-pointer';
  const errCls  = 'mt-1.5 text-[13px] text-[#F2B8B5]';
  const reqMark = <span aria-hidden="true" style={{ color: GOLD }}> *</span>;

  const fieldError = (key: keyof FormState) =>
    errors[key] ? (
      <p id={`consult-${key}-error`} className={errCls} role="alert">{errors[key]}</p>
    ) : null;

  const ariaProps = (key: keyof FormState) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `consult-${key}-error` : undefined,
  });

  return (
    <>
      {/* ── 루트 래퍼: 오버레이 클릭 닫기 없음, 이벤트 차단 ── */}
      <div
        className="fixed inset-0 z-[100000] flex items-end justify-center md:items-center"
        onKeyDown={handleKeyDown}
        /* 루트에 onClick 핸들러를 두지 않는다 → 배경 클릭으로 닫히지 않는다 */
      >
        {/* 오버레이: 시각적 배경만, 클릭 이벤트 없음 */}
        <div
          className="consult-overlay pointer-events-none absolute inset-0 bg-black/72"
          style={{ backdropFilter: 'blur(2px)' }}
          aria-hidden="true"
        />

        {/* 다이얼로그 */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          /* 클릭 이벤트가 부모로 전파되지 않도록 차단 */
          onClick={(e) => e.stopPropagation()}
          className="consult-dialog relative z-10 flex flex-col overflow-hidden border border-white/10 bg-[#0B1018]
            /* 모바일: 전체 화면형 Bottom Sheet */
            w-full max-w-[100vw] max-h-[100dvh] rounded-t-2xl
            /* 데스크톱: 중앙 모달 */
            md:max-h-[90dvh] md:w-[min(560px,92vw)] md:rounded-2xl"
          style={{ boxSizing: 'border-box' }}
        >
          {/* ── 헤더 ── */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/8 px-4 py-4 md:px-7 md:py-5">
            <div className="min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ fontFamily: 'var(--font-space-mono)', color: GOLD }}
              >
                PAGEONEWORKS · 상담예약
              </p>
              <h2
                id={titleId}
                className="mt-1.5 text-[22px] font-semibold leading-snug text-white md:text-[22px]"
              >
                검색·AI 노출 무료 진단 신청
              </h2>
            </div>
            {/* X 버튼: 입력 내용이 있으면 확인창 */}
            <button
              type="button"
              onClick={requestClose}
              aria-label="상담예약 창 닫기"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/55
                outline-none transition-colors hover:bg-white/8 hover:text-white
                focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {previewDone ? (
            /* ── 완료 화면 ── */
            <div
              className="min-h-0 flex-1 overflow-y-auto px-4 py-10 md:px-7"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="mx-auto max-w-[420px] text-center">
                <div
                  className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ border: `1px solid ${GOLD}` }} aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD}
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-[17px] font-semibold text-white">입력 내용이 확인되었습니다</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/55">
                  현재는 <strong className="text-white/80">미리보기 단계</strong>입니다.
                  입력하신 내용은 전송·저장되지 않았으며, 실제 상담 접수로 처리되지 않습니다.
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/40">
                  급한 문의는 모바일에서 전화상담 버튼을 이용하거나{' '}
                  {siteConfig.email}로 연락해 주세요.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-lg px-6
                    text-[15px] font-semibold text-[#0B1018] outline-none
                    transition-transform hover:-translate-y-0.5 active:translate-y-0
                    focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50
                    motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{ background: GOLD }}
                >
                  닫기
                </button>
              </div>
            </div>
          ) : (
            /* ── 폼 ── */
            <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
              {/* 스크롤 영역 */}
              <div
                className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-7"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <p id={descId} className="mb-5 text-[14px] leading-relaxed text-white/45">
                  간단한 정보만 남겨 주시면 검색·AI 노출 현황을 살펴보고 연락드립니다.{' '}
                  <span style={{ color: GOLD }}>*</span> 는 필수 항목입니다.
                </p>

                <div className="flex flex-col gap-4">
                  {/* 이름 */}
                  <div>
                    <label htmlFor="consult-name" className={labelCls}>이름{reqMark}</label>
                    <input
                      ref={firstFieldRef}
                      id="consult-name" type="text" autoComplete="name"
                      className={inputCls} value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="홍길동" {...ariaProps('name')}
                    />
                    {fieldError('name')}
                  </div>

                  {/* 회사명 */}
                  <div>
                    <label htmlFor="consult-company" className={labelCls}>회사명 또는 기관명{reqMark}</label>
                    <input
                      id="consult-company" type="text" autoComplete="organization"
                      className={inputCls} value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      placeholder="예: OO병원 / OO법률사무소 / OO브랜드"
                      {...ariaProps('company')}
                    />
                    {fieldError('company')}
                  </div>

                  {/* 연락처 */}
                  <div>
                    <label htmlFor="consult-phone" className={labelCls}>연락처{reqMark}</label>
                    <input
                      id="consult-phone" type="tel" inputMode="tel" autoComplete="tel"
                      className={inputCls} value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="010-0000-0000" {...ariaProps('phone')}
                    />
                    {fieldError('phone')}
                  </div>

                  {/* 업종 */}
                  <div>
                    <label htmlFor="consult-industry" className={labelCls}>업종{reqMark}</label>
                    <select
                      id="consult-industry" className={selectCls} value={form.industry}
                      onChange={(e) => update('industry', e.target.value)}
                      {...ariaProps('industry')}
                    >
                      <option value="">선택해 주세요</option>
                      {INDUSTRY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {fieldError('industry')}
                  </div>

                  {/* 선택 입력 구분선 */}
                  <div className="mt-1 border-t border-white/8 pt-4">
                    <p
                      className="mb-3 text-[11px] uppercase tracking-[0.18em] text-white/35"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      선택 입력
                    </p>
                    <div className="flex flex-col gap-4">
                      {/* 필요한 도움 */}
                      <div>
                        <label htmlFor="consult-help" className={labelCls}>어떤 도움이 필요하세요?</label>
                        <select
                          id="consult-help" className={selectCls} value={form.help}
                          onChange={(e) => update('help', e.target.value)}
                        >
                          <option value="">선택 안 함</option>
                          {HELP_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>

                      {/* 연락 시간 */}
                      <div>
                        <label htmlFor="consult-time" className={labelCls}>연락받기 좋은 시간</label>
                        <input
                          id="consult-time" type="text" className={inputCls}
                          value={form.contactTime}
                          onChange={(e) => update('contactTime', e.target.value)}
                          placeholder="예: 평일 오후 2~5시"
                        />
                      </div>

                      {/* 웹사이트 */}
                      <div>
                        <label htmlFor="consult-website" className={labelCls}>웹사이트 주소</label>
                        <input
                          id="consult-website" type="url" inputMode="url" autoComplete="url"
                          className={inputCls} value={form.website}
                          onChange={(e) => update('website', e.target.value)}
                          placeholder="https://"
                        />
                      </div>

                      {/* 문의 내용 */}
                      <div>
                        <label htmlFor="consult-message" className={labelCls}>문의 내용</label>
                        <textarea
                          id="consult-message" rows={3}
                          className={`${inputBase} min-h-[96px] resize-y py-3.5 leading-relaxed`}
                          value={form.message}
                          onChange={(e) => update('message', e.target.value)}
                          placeholder="현재 고민이나 목표를 자유롭게 적어 주세요."
                        />
                      </div>
                    </div>
                  </div>

                  {/* 동의 영역 */}
                  <div className="mt-1 flex flex-col gap-3 border-t border-white/8 pt-4">
                    {/* 개인정보 동의 (필수) */}
                    <div>
                      <label
                        htmlFor="consult-privacyAgreed"
                        className="flex cursor-pointer items-start gap-3"
                      >
                        <input
                          id="consult-privacyAgreed" type="checkbox"
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#C9A96E]"
                          checked={form.privacyAgreed}
                          onChange={(e) => update('privacyAgreed', e.target.checked)}
                          {...ariaProps('privacyAgreed')}
                        />
                        <span className="text-[14px] leading-relaxed text-white/70">
                          <span className="font-medium text-white/90">[필수]</span>{' '}
                          개인정보 수집·이용에 동의합니다.{' '}
                          <a
                            href="/privacy" target="_blank" rel="noopener noreferrer"
                            className="underline underline-offset-2"
                            style={{ color: GOLD }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            자세히 보기
                          </a>
                        </span>
                      </label>
                      <p className="mt-1.5 pl-[30px] text-[12px] leading-relaxed text-white/40">
                        수집 항목: 이름, 회사명·기관명, 연락처, 업종 및 선택 입력 정보 · 이용 목적: 상담
                        신청 확인 및 일정 안내 · 보유 기간: 상담 목적 달성 후 파기. 동의 거부 시 상담예약
                        이용이 제한될 수 있습니다.
                      </p>
                      {fieldError('privacyAgreed')}
                    </div>

                    {/* 마케팅 동의 (선택) */}
                    <div>
                      <label
                        htmlFor="consult-marketingAgreed"
                        className="flex cursor-pointer items-start gap-3"
                      >
                        <input
                          id="consult-marketingAgreed" type="checkbox"
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[#C9A96E]"
                          checked={form.marketingAgreed}
                          onChange={(e) => update('marketingAgreed', e.target.checked)}
                        />
                        <span className="text-[14px] leading-relaxed text-white/70">
                          <span className="font-medium text-white/55">[선택]</span>{' '}
                          광고성 정보 수신에 동의합니다.
                        </span>
                      </label>
                      <p className="mt-1.5 pl-[30px] text-[12px] leading-relaxed text-white/40">
                        PAGEONEWORKS의 서비스·콘텐츠·세미나·프로모션 정보를 전화 또는 문자로 받습니다.
                        동의하지 않아도 상담예약 이용 가능하며, 언제든 철회할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* 마지막 필드 뒤 여백: 모바일에서 고정 하단이 내용을 가리지 않도록 */}
                  <div className="h-6" aria-hidden="true" />
                </div>
              </div>

              {/* ── 고정 하단 액션 영역 ── */}
              <div
                className="shrink-0 border-t border-white/8 bg-[#0B1018] px-4 pt-4 md:px-7"
                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
              >
                <p className="mb-2.5 text-center text-[12px] leading-relaxed text-white/35">
                  현재는 미리보기 단계로, 입력 내용은 전송·저장되지 않습니다.
                </p>
                <button
                  type="submit"
                  className="flex min-h-[50px] w-full items-center justify-center rounded-lg
                    text-[15px] font-semibold text-[#0B1018] outline-none
                    transition-transform hover:-translate-y-0.5 active:translate-y-0
                    focus-visible:ring-2 focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#0B1018] focus-visible:ring-[#C9A96E]
                    motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{ background: GOLD }}
                >
                  입력 확인하기 (미리보기)
                </button>
                {/* 취소 버튼: 입력 내용이 있으면 확인창 */}
                <button
                  type="button"
                  onClick={requestClose}
                  className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-lg
                    border border-white/15 text-[14px] font-medium text-white/55 outline-none
                    transition-colors hover:border-white/30 hover:text-white/80
                    focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── 닫기 확인 다이얼로그 ── */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100001] flex items-center justify-center px-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <div
            className="relative w-full max-w-[360px] rounded-2xl border border-white/12 bg-[#111820] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="confirm-title" className="text-[17px] font-semibold text-white">
              입력 내용을 삭제할까요?
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              지금까지 입력한 내용이 모두 사라집니다.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => { setConfirmOpen(false); onClose(); }}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-lg
                  bg-red-600/80 text-[14px] font-semibold text-white outline-none
                  transition-colors hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-400/60"
              >
                닫기
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmOpen(false)}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-lg
                  border border-white/15 text-[14px] font-medium text-white/70 outline-none
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
        .consult-overlay { animation: consultFadeIn .22s ease both; }
        .consult-dialog  { animation: consultSlideUp .28s cubic-bezier(0.33,1,0.68,1) both; }
        @media (min-width: 768px) {
          .consult-dialog { animation: consultPopIn .22s cubic-bezier(0.33,1,0.68,1) both; }
        }
        @keyframes consultFadeIn  { from { opacity:0 }                              to { opacity:1 } }
        @keyframes consultSlideUp { from { transform:translateY(100%) }             to { transform:translateY(0) } }
        @keyframes consultPopIn   { from { opacity:0;transform:translateY(8px) scale(.98) } to { opacity:1;transform:none } }
        @media (prefers-reduced-motion: reduce) {
          .consult-overlay, .consult-dialog { animation: none !important; }
        }
        /* select 커스텀 화살표: webpack CSS loader 호환을 위해 <style> 블록에서 처리 */
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

/* ─ 미사용 변수 제거 방지 ─ */
void BG;
