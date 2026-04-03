'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { X } from 'lucide-react';
import { articles } from '@/lib/data';

const fuse = new Fuse(articles, {
  keys: ['titleKo', 'titleEn', 'category', 'excerpt'],
  threshold: 0.3,
  minMatchCharLength: 1,
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 0
    ? fuse.search(query).map((r) => r.item).slice(0, 12)
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(12px)' }}
    >
      {/* 상단 입력 바 */}
      <div
        className="flex items-center px-5 md:px-12 shrink-0"
        style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="아티클 검색..."
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            fontWeight: 300,
            color: 'rgba(245,242,237,0.85)',
          }}
        />
        <button
          onClick={onClose}
          className="ml-4 transition-colors"
          style={{ color: 'rgba(245,242,237,0.4)', padding: '8px' }}
          aria-label="검색 닫기"
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* 결과 영역 */}
      <div className="flex-1 overflow-y-auto px-5 md:px-12 py-6">

        {/* 검색 전 안내 */}
        {query.trim().length === 0 && (
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.2)',
              textTransform: 'uppercase',
              marginTop: '48px',
            }}
          >
            제목, 카테고리, 키워드로 검색하세요
          </p>
        )}

        {/* 결과 없음 */}
        {query.trim().length > 0 && results.length === 0 && (
          <p
            className="text-center"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(245,242,237,0.2)',
              textTransform: 'uppercase',
              marginTop: '48px',
            }}
          >
            검색 결과가 없습니다
          </p>
        )}

        {/* 결과 목록 */}
        {results.length > 0 && (
          <>
            <p
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '8px',
                letterSpacing: '0.15em',
                color: 'rgba(245,242,237,0.25)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {results.length}개 결과
            </p>

            {/* PC: 4열 / 모바일: 3열 */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  onClick={onClose}
                  className="group block"
                >
                  <div
                    className="overflow-hidden mb-2 bg-[#1a1a1a]"
                    style={{ aspectRatio: '4/3' }}
                  >
                    <img
                      src={article.image}
                      alt={article.titleKo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '8px',
                      letterSpacing: '0.12em',
                      color: 'rgba(245,242,237,0.35)',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                    }}
                  >
                    {article.category}
                  </p>
                  <h3
                    className="font-light group-hover:italic transition-all duration-200 line-clamp-2"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
                      color: 'rgba(245,242,237,0.85)',
                      lineHeight: '1.35',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {article.titleKo}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '7px',
                      letterSpacing: '0.08em',
                      color: 'rgba(245,242,237,0.22)',
                      marginTop: '4px',
                    }}
                  >
                    {article.date} · {article.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}