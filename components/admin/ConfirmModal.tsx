// components/admin/ConfirmModal.tsx

'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { ADMIN_THEME } from '@/lib/admin/constants'

type ConfirmOptions = {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  onConfirm: () => void | Promise<void>
}

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => void
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const close = useCallback(() => {
    if (loading) return
    setOpen(false)
    setOptions(null)
  }, [loading])

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const handleConfirm = async () => {
    if (!options) return
    setLoading(true)
    try {
      await options.onConfirm()
      setOpen(false)
      setOptions(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && options && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              background: ADMIN_THEME.bg,
              border: ADMIN_THEME.border,
              borderRadius: 12,
              padding: 24,
              fontFamily: 'Inter, Pretendard, sans-serif',
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 500, color: ADMIN_THEME.text, margin: '0 0 8px' }}>
              {options.title}
            </h2>
            <p style={{ fontSize: 13, fontWeight: 400, color: ADMIN_THEME.sub, margin: '0 0 24px', lineHeight: 1.6 }}>
              {options.message}
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={close}
                disabled={loading}
                style={{
                  minHeight: 44,
                  padding: '0 16px',
                  borderRadius: 8,
                  border: ADMIN_THEME.border,
                  background: ADMIN_THEME.surface,
                  color: ADMIN_THEME.text,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: '150ms',
                }}
              >
                {options.cancelText ?? '취소'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  minHeight: 44,
                  padding: '0 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: options.confirmColor ?? ADMIN_THEME.danger,
                  color: ADMIN_THEME.bg,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: '150ms',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '처리 중...' : options.confirmText ?? '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}
