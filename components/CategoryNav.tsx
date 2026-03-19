'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';

const navCategories = categories.filter((c) => c.slug !== 'archive');
const archiveCategory = { slug: 'archive', title: 'ARCHIVE' };

export function CategoryNav() {
  const pathname = usePathname();

  const getHref = (slug: string) => {
    if (slug === 'archive') return '/archive';
    return `/category/${slug}`;
  };

  const isActive = (slug: string) => {
    if (slug === 'archive') return pathname === '/archive';
    return pathname === `/category/${slug}`;
  };

  return (
    <div
      className="sticky z-40 border-b border-white/8 bg-black/95 backdrop-blur-md"
      style={{ top: '56px' }}
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={getHref(cat.slug)}
              className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${
                isActive(cat.slug)
                  ? 'border-cream text-cream'
                  : 'border-transparent text-cream/45 hover:text-cream/80'
              }`}
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontSize: '10px',
                letterSpacing: '0.08em',
              }}
            >
              {cat.title}
            </Link>
          ))}
          <Link
            href="/archive"
            className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ml-auto ${
              isActive('archive')
                ? 'border-cream text-cream'
                : 'border-transparent text-cream/45 hover:text-cream/80'
            }`}
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '10px',
              letterSpacing: '0.08em',
            }}
          >
            ARCHIVE →
          </Link>
        </div>
      </div>
    </div>
  );
}