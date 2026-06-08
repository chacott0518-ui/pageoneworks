// components/admin/hooks/useDebounce.ts

'use client'

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(t)
  }, [value, ms])
  return debounced
}
