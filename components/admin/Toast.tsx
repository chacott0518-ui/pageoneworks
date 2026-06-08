// components/admin/Toast.tsx

'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { ADMIN_THEME } from '@/lib/admin/constants'

export type ToastType = 'success' | 'error' | 'warning'

type ToastItem = {
  id: number
  message: string
  type: ToastType
}

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const BG_MAP: Record<ToastType, string> = {
  success: ADMIN_THEME.success,
  error: ADMIN_THEME.danger,
  warning: ADMIN_THEME.warning,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              minWidth: 240,
              maxWidth: 360,
              padding: '12px 16px',
              borderRadius: 8,
              background: BG_MAP[toast.type],
              color: ADMIN_THEME.bg,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'Inter, Pretendard, sans-serif',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              animation: 'admin-toast-in 150ms ease-out',
              pointerEvents: 'auto',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-toast-in {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
