// components/admin/ConfirmModal.tsx

'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: string
  onConfirm: () => void | Promise<void>
}

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => void
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

const BG = '#0a0a0c'
const SURFACE = 'rgba(255,255,255,0.03)'
const BORDER = '0.5px solid rgba(255,255,255,0.06)'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const GOLD = '#C9A96E'

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setOpen(true)
  }, [])

  const close = () => {
    if (loading) return
    setOpen(false)
    setOptions(null)
  }

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
            padding: '16px',
          }}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: BG,
              border: BORDER,
              borderRadius: '12px',
              padding: '24px',
              fontFamily: 'Inter, Pretendard, sans-serif',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: 500, color: TEXT, margin: '0 0 8px' }}>
              {options.title}
            </h2>
            <p style={{ fontSize: '13px', fontWeight: 400, color: SUB, margin: '0 0 24px', lineHeight: 1.6 }}>
              {options.message}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={close}
                disabled={loading}
                style={{
                  minHeight: '44px',
                  padding: '0 16px',
                  borderRadius: '8px',
                  border: BORDER,
                  background: SURFACE,
                  color: TEXT,
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: '150ms',
                }}
              >
                {options.cancelLabel ?? '취소'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                style={{
                  minHeight: '44px',
                  padding: '0 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: options.confirmColor ?? 'rgba(255,70,70,0.9)',
                  color: '#0a0a0c',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: '150ms',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '처리 중...' : options.confirmLabel ?? '확인'}
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

export { GOLD }
