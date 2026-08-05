'use client';

import { useEffect, useId, useRef } from 'react';

const GOLD = '#C4A882';
const BG = '#0B1018';

interface Props {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
}

/** PAGEONEWORKS 공통 "준비 중" 모달 — AI 에디터 모달과 동일한 디자인을 재사용 */
export function ComingSoonModal({ open, onClose, eyebrow, title, description, confirmLabel = '확인' }: Props) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => confirmRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]),[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[calc(100%-32px)] max-w-[400px] overflow-hidden rounded-[18px] border border-white/10 md:w-[400px]"
        style={{ background: BG, boxSizing: 'border-box', maxHeight: '90dvh', overflowY: 'auto' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-white/45 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#C4A882]/50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pb-6 pt-7 text-center md:px-7">
          <p
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-space-mono)', color: GOLD }}
          >
            {eyebrow}
          </p>
          <h2
            id={titleId}
            className="mt-3 text-[20px] font-semibold leading-snug text-white md:text-[21px]"
            style={{ wordBreak: 'keep-all' }}
          >
            {title}
          </h2>
          <p
            id={descId}
            className="mt-3 text-[14px] leading-relaxed text-white/60"
            style={{ wordBreak: 'keep-all' }}
          >
            {description}
          </p>
          <button
            ref={confirmRef}
            type="button"
            onClick={onClose}
            className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-xl text-[14px] font-semibold text-[#0B1018] outline-none transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#C4A882]/50"
            style={{ background: GOLD }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
