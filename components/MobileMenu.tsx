'use client';

import Link from 'next/link';
import { categories } from '@/lib/data';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] overflow-hidden ${
        isOpen ? 'max-h-[50vh] opacity-100' : 'max-h-0 opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(10, 10, 10, 0.97)', backdropFilter: 'blur(16px)' }}
    >
      <nav className="pt-24 pb-8 px-6">
        <ul className="flex flex-col gap-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-baseline justify-between py-3 border-b border-white/8 group"
              >
                <span
                  className="text-cream text-lg tracking-wide group-hover:italic transition-all duration-300"
                  style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 500 }}
                >
                  {cat.title}
                </span>
                <span
                  className="text-cream/40 text-[10px] italic"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {cat.titleKo}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            href="/subscribe"
            onClick={onClose}
            className="block w-full text-center text-cream text-[10px] uppercase tracking-[0.2em] border border-[#f5f2ed]/30 py-3 hover:bg-cream/10 transition-colors"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            구독하기
          </Link>
        </div>
      </nav>
    </div>
  );
}
