'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { X } from 'lucide-react';
import { articles, categories } from '@/lib/data';

const fuse = new Fuse(articles, {
  keys: ['titleKo', 'titleEn', 'category', 'excerpt'],
  threshold: 0.3,
  minMatchCharLength: 1,
});

const recentArticles = articles.slice(0, 8);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 0
    ? fuse.search(query).map((r) => r.item).slice(0, 8)
    : [];

  const displayArticles = query.trim().length > 0 ? results : recentArticles;
  const displayLabel = query.trim().length > 0
    ? `${results.length}개 검색 결과`
    : '최신 아티클';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
    }
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
    <>
      {/* 딤 배경 — 클릭 시 닫기 */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      />

      {/* ── PC: 헤더 아래 드롭다운 패널 ── */}
      <div
        className="hidden md:flex fixed left-0 right-0 z-[70]"
        style={{
          top: '56px',
          background: 'rgba(18,16,14,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(245,242,237,0.1)',
          maxHeight: 'calc(100vh - 56px)',
          overflow: 'hidden',
        }}
      >
        {/* 왼쪽 — 검색 입력 + 카테고리 */}
        <div
          className="flex flex-col shrink-0"
          style={{
            width: '320px',
            borderRight: '1px solid rgba(245,242,237,0.08)',
          }}
        >
          {/* 검색 입력 */}
          <div
            className="flex items-center gap-3 shrink-0"
            style={{
              padding: '0 24px',
              height: '64px',
              borderBottom: '1px solid rgba(245,242,237,0.08)',
            }}
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
                fontSize: '1.2rem',
                fontWeight: 300,
                color: '#f5f2ed',
              }}
            />
            <button
              onClick={onClose}
              className="transition-colors shrink-0"
              style={{ color: 'rgba(245,242,237,0.4)', padding: '4px' }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* 카테고리 목록 */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ padding: '20px 24px' }}
          >
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '8px',
                letterSpacing: '0.2em',
                color: 'rgba(245,242,237,0.3)',
                marginBottom: '12px',
              }}
            >
              카테고리
            </p>
            {categories
              .filter((cat) => cat.slug !== 'archive')
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between transition-all duration-200"
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(245,242,237,0.05)',
                  }}
                >
                  <div>
                    <p
                      className="group-hover:italic transition-all duration-200"
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: '14px',
                        fontWeight: 300,
                        color: 'rgba(245,242,237,0.8)',
                        letterSpacing: '0.03em',
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.title}
                    </p>
                  </div>
                  <span
                    className="group-hover:text-cream/60 transition-colors"
                    style={{ color: 'rgba(245,242,237,0.2)', fontSize: '12px' }}
                  >
                    →
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* 오른쪽 — 아티클 결과 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex items-center shrink-0"
            style={{
              padding: '0 24px',
              height: '64px',
              borderBottom: '1px solid rgba(245,242,237,0.08)',
            }}
          >
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '8px',
                letterSpacing: '0.2em',
                color: 'rgba(245,242,237,0.3)',
              }}
            >
              {displayLabel}
            </p>
          </div>

          <div
            className="flex-1 overflow-y-auto"
            style={{ padding: '20px 24px' }}
          >
            {query.trim().length > 0 && results.length === 0 ? (
              <p
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  color: 'rgba(245,242,237,0.2)',
                  marginTop: '32px',
                  textAlign: 'center',
                }}
              >
                검색 결과가 없습니다
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {displayArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div
                      className="relative overflow-hidden mb-2 bg-[#1a1a1a]"
                      style={{ aspectRatio: '4/3' }}
                    >
                      <Image
                        src={article.image}
                        alt={article.titleKo}
                        fill
                        sizes="25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '7px',
                        letterSpacing: '0.1em',
                        color: 'rgba(245,242,237,0.4)',
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
                        fontSize: '0.95rem',
                        color: '#f5f2ed',
                        lineHeight: '1.35',
                        wordBreak: 'keep-all',
                      }}
                    >
                      {article.titleKo}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 모바일: 바텀시트 ── */}
      <div
        className="md:hidden fixed left-0 right-0 bottom-0 z-[70] flex flex-col"
        style={{
          background: 'rgba(18,16,14,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(245,242,237,0.12)',
          borderRadius: '12px 12px 0 0',
          maxHeight: '80vh',
        }}
      >
        {/* 핸들 */}
        <div className="flex justify-center shrink-0" style={{ paddingTop: '12px', paddingBottom: '4px' }}>
          <div
            style={{
              width: '32px',
              height: '3px',
              background: 'rgba(245,242,237,0.2)',
              borderRadius: '2px',
            }}
          />
        </div>

        {/* 검색 입력 */}
        <div
          className="flex items-center gap-3 shrink-0"
          style={{
            padding: '0 18px',
            height: '52px',
            borderBottom: '1px solid rgba(245,242,237,0.08)',
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="아티클 검색..."
            className="flex-1 bg-transparent outline-none"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.1rem',
              fontWeight: 300,
              color: '#f5f2ed',
            }}
          />
          <button
            onClick={onClose}
            style={{ color: 'rgba(245,242,237,0.4)', padding: '4px' }}
          >
            <X style={{ width: '15px', height: '15px' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding: '14px 18px' }}>

          {/* 카테고리 태그 */}
          {query.trim().length === 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p
                className="uppercase"
                style={{
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '8px',
                  letterSpacing: '0.18em',
                  color: 'rgba(245,242,237,0.3)',
                  marginBottom: '10px',
                }}
              >
                카테고리
              </p>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((cat) => cat.slug !== 'archive')
                  .map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="uppercase transition-colors"
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        color: 'rgba(245,242,237,0.75)',
                        border: '1px solid rgba(245,242,237,0.2)',
                        padding: '5px 10px',
                      }}
                    >
                      {cat.title}
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* 아티클 */}
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '8px',
              letterSpacing: '0.18em',
              color: 'rgba(245,242,237,0.3)',
              marginBottom: '10px',
            }}
          >
            {displayLabel}
          </p>

          {query.trim().length > 0 && results.length === 0 ? (
            <p
              className="text-center uppercase"
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'rgba(245,242,237,0.2)',
                marginTop: '24px',
              }}
            >
              검색 결과가 없습니다
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {displayArticles.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  onClick={onClose}
                  className="group block"
                >
                  <div
                    className="relative overflow-hidden mb-1.5 bg-[#1a1a1a]"
                    style={{ aspectRatio: '4/3' }}
                  >
                    <Image
                      src={article.image}
                      alt={article.titleKo}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '7px',
                      letterSpacing: '0.08em',
                      color: 'rgba(245,242,237,0.4)',
                      textTransform: 'uppercase',
                      marginBottom: '3px',
                    }}
                  >
                    {article.category}
                  </p>
                  <h3
                    className="font-light line-clamp-2"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '0.85rem',
                      color: '#f5f2ed',
                      lineHeight: '1.35',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {article.titleKo}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}