'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/data';

const navCategories = categories.filter((c) => c.slug !== 'archive');

export function CategoryNav() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  let isDown = false, startX = 0, scrollLeft = 0;

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft = ref.current?.scrollLeft ?? 0;
    if (ref.current) ref.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => { isDown = false; if (ref.current) ref.current.style.cursor = 'grab'; };
  const onMouseUp = () => { isDown = false; if (ref.current) ref.current.style.cursor = 'grab'; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current.offsetLeft ?? 0);
    ref.current.scrollLeft = scrollLeft - (x - startX);
  };

  return (
    <div className="sticky z-40 border-b border-white/8" style={{ top: '56px', backgroundColor: '#0a0a0a' }}>
      <div className="max-w-[1600px] mx-auto px-5 md:px-8">
        <div style={{ position: 'relative' }}>
          <div
            ref={ref}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            style={{ display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', userSelect: 'none' }}
          >
            <Link href="/" className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${pathname === '/' ? 'border-cream text-cream' : 'border-transparent text-cream/45 hover:text-cream/80'}`} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>전체</Link>
            {navCategories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${pathname === `/category/${cat.slug}` ? 'border-cream text-cream' : 'border-transparent text-cream/45 hover:text-cream/80'}`} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>{cat.title}</Link>
            ))}
            <Link href="/archive" className={`shrink-0 py-3 px-3 md:px-4 border-b-2 transition-all duration-200 uppercase whitespace-nowrap ${pathname === '/archive' ? 'border-cream text-cream' : 'border-transparent text-cream/45 hover:text-cream/80'}`} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.08em' }}>ARCHIVE →</Link>
            <span className="shrink-0 w-8" />
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to right, transparent, #0a0a0a)', pointerEvents: 'none' }} />
        </div>
      </div>
    </div>
  );
}