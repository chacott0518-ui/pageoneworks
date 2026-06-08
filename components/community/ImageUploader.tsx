// components/community/ImageUploader.tsx

'use client'

import { useCallback, useRef, useState, type DragEvent } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

const GOLD = '#C9A96E'
const CARD_BG = 'rgba(255,255,255,0.03)'
const CARD_BORDER = '0.5px solid rgba(255,255,255,0.06)'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const MAX_FILES = 3
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const uploadFile = useCallback(
    async (file: File) => {
      if (!ALLOWED_TYPES.has(file.type)) {
        setError('jpg, png, gif, webp만 업로드 가능합니다.')
        return null
      }
      if (file.size > MAX_SIZE) {
        setError('최대 5MB까지 업로드 가능합니다.')
        return null
      }
      if (value.length >= MAX_FILES) {
        setError(`최대 ${MAX_FILES}장까지 업로드할 수 있습니다.`)
        return null
      }

      setError('')
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/community/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? '업로드 실패')
          return null
        }
        return data.url as string
      } catch {
        setError('네트워크 오류가 발생했습니다.')
        return null
      } finally {
        setUploading(false)
      }
    },
    [value.length]
  )

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files)
      const next = [...value]
      for (const file of list) {
        if (next.length >= MAX_FILES) break
        const url = await uploadFile(file)
        if (url) next.push(url)
      }
      if (next.length !== value.length) onChange(next)
    },
    [onChange, uploadFile, value]
  )

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) await handleFiles(e.dataTransfer.files)
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <p style={{ fontSize: '12px', fontWeight: 500, color: TEXT, marginBottom: '8px' }}>
        이미지 (최대 {MAX_FILES}장)
      </p>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onClick={() => !uploading && value.length < MAX_FILES && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          minHeight: '120px',
          borderRadius: '8px',
          border: dragOver ? `1px dashed ${GOLD}` : CARD_BORDER,
          background: dragOver ? 'rgba(201,169,110,0.06)' : CARD_BG,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '16px',
          cursor: uploading || value.length >= MAX_FILES ? 'not-allowed' : 'pointer',
          opacity: uploading || value.length >= MAX_FILES ? 0.6 : 1,
        }}
      >
        {uploading ? (
          <>
            <div
              style={{
                width: '24px',
                height: '24px',
                border: '2px solid rgba(201,169,110,0.2)',
                borderTopColor: GOLD,
                borderRadius: '50%',
                animation: 'community-spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 400, color: SUB }}>업로드 중...</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '13px', fontWeight: 500, color: TEXT }}>
              클릭하거나 이미지를 드래그하세요
            </span>
            <span style={{ fontSize: '11px', fontWeight: 400, color: SUB }}>
              jpg · png · gif · webp · 5MB 이하
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {error && (
        <p style={{ fontSize: '11px', color: '#FC8181', marginTop: '8px', fontWeight: 400 }}>{error}</p>
      )}

      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {value.map((url, i) => (
            <div
              key={url}
              style={{
                position: 'relative',
                width: '88px',
                height: '88px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: CARD_BORDER,
              }}
            >
              <Image src={url} alt={`업로드 ${i + 1}`} fill sizes="88px" loading="lazy" style={{ objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="이미지 삭제"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '28px',
                  height: '28px',
                  minHeight: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `@keyframes community-spin { to { transform: rotate(360deg); } }` }} />
    </div>
  )
}
