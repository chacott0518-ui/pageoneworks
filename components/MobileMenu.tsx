'use client';

import Link from 'next/link';
import { categories } from '@/lib/data';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navCategories = categories.filter((c) => c.slug !== 'archive');

  return (
    <div
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden ${
        isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(16px)' }}
    >
      <nav className="pt-20 pb-6 px-6" aria-label="모바일 카테고리 메뉴">
        <ul
          className="grid grid-cols-2 gap-x-4"
          style={{
            overflowY: 'auto',
            maxHeight: 'calc(80vh - 120px)',
            scrollbarWidth: 'none',
          }}
        >
          {navCategories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-2 py-2.5 border-b border-white/8 group"
              >
                <span
                  className="font-mono text-[8px] opacity-25 shrink-0"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {cat.id}
                </span>
                <span
                  className="text-cream text-[13px] uppercase tracking-wide group-hover:text-[#C9A96E] transition-colors duration-200 truncate"
                  style={{ fontFamily: 'var(--font-space-mono)', letterSpacing: '0.06em' }}
                >
                  {cat.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* 하단 액션 */}
        <div className="mt-4 flex gap-3">
          <Link
            href="/archive"
            onClick={onClose}
            className="flex-1 text-center text-cream/50 text-[10px] uppercase tracking-[0.2em] border border-white/10 py-2.5 hover:border-white/30 hover:text-cream transition-colors"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            ARCHIVE →
          </Link>
          <Link
            href="/community"
            onClick={onClose}
            className="flex-1 text-center text-[#0F0F10] bg-[#C9A96E] text-[10px] uppercase tracking-[0.2em] py-2.5 hover:bg-[#b8955a] transition-colors font-bold"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            COMMUNITY
          </Link>
        </div>
      </nav>
    </div>
  );
}