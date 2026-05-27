'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';

const navCategories = categories.filter((c) => c.slug !== 'archive');

export function CategoryNav() {
  const pathname = usePathname();

  return (
    <div
      className="sticky z-40 border-b border-white/8"
      style={{ top: '56px', backgroundColor: '#0a0a0a' }}
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: 0,
          }}
        >
          <Link
            href="/"
            className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${
              pathname === '/' ? 'border-cream text-cream' : 'border-transparent text-cream/45 hover:text-cream/80'
            }`}
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}
          >
            전체
          </Link>

          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${
                pathname === `/category/${cat.slug}` ? 'border-cream text-cream' : 'border-transparent text-cream/45 hover:text-cream/80'
              }`}
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}
            >
              {cat.title}
            </Link>
          ))}

          <Link
            href="/archive"
            className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${
              pathname === '/archive' ? 'border-cream text-cream' : 'border-transparent text-cream/45 hover:text-cream/80'
            }`}
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}
          >
            ARCHIVE →
          </Link>
          <span className="shrink-0 w-4 md:hidden" />
        </div>
      </div>
    </div>
  );
}