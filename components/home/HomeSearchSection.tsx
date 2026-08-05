'use client';

import {
  FormEvent,
  KeyboardEvent,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import type { HomeSearchResultItem } from '@/lib/home-search';

const GOLD = '#c9a96e';

const SUGGESTIONS = ['AI 검색', '디지털 툴', '부동산', '모빌리티', '강아지', '건강', '글로벌 트렌드'];

const TEXTAREA_MAX_HEIGHT = 112;

/** Header.tsx의 돋보기 버튼이 이동하는 목적지 id와 반드시 동일해야 함 */
const HOME_SEARCH_SECTION_ID = 'home-insight-search';
const HOME_SEARCH_INPUT_ID = 'home-insight-search-input';

const STORAGE_KEY = 'pageoneworks-home-search';

type StoredSearchState = {
  submittedQuery: string;
  open: boolean;
};

function normalizeQuery(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

function readStored(): StoredSearchState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSearchState;
    if (typeof parsed?.submittedQuery !== 'string' || typeof parsed?.open !== 'boolean') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(state: StoredSearchState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clearStored() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function HomeSearchSectionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const restoredRef = useRef(false);
  /** 최신 요청만 결과를 반영 — 빠른 연속 검색 시 오래된 응답이 최신 결과를 덮지 않도록 방지 */
  const requestIdRef = useRef(0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HomeSearchResultItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  // 장문 질문 입력에 맞춰 textarea 높이를 1~3줄 범위로 자동 조절
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT)}px`;
  }, [query]);

  const syncUrl = useCallback(
    (q: string | null) => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
    },
    [router],
  );

  const runSearch = useCallback(
    async (raw: string, opts?: { scrollToResults?: boolean }) => {
      const q = normalizeQuery(raw);
      if (!q) {
        textareaRef.current?.focus();
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      setLoading(true);
      setError(false);
      setQuery(q);
      setActiveSuggestion(q);

      try {
        const res = await fetch(`/api/home-search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
        if (requestIdRef.current !== requestId) return; // 이후 요청이 이미 시작됨 — 이 응답은 폐기
        if (!res.ok) throw new Error('search_failed');
        const data = (await res.json()) as { results?: HomeSearchResultItem[] };
        const next = Array.isArray(data.results) ? data.results : [];
        setResults(next);
        setOpen(true);
        writeStored({ submittedQuery: q, open: true });
        syncUrl(q);

        if (opts?.scrollToResults !== false) {
          requestAnimationFrame(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
      } catch {
        if (requestIdRef.current !== requestId) return;
        setError(true);
        setResults([]);
        setOpen(true);
        writeStored({ submittedQuery: q, open: true });
        syncUrl(q);
      } finally {
        if (requestIdRef.current === requestId) setLoading(false);
      }
    },
    [syncUrl],
  );

  // URL q 우선 복원, 없으면 sessionStorage로 복원 (마운트 1회)
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const urlQ = normalizeQuery(searchParams.get('q') ?? '');
    if (urlQ) {
      void runSearch(urlQ, { scrollToResults: false });
      return;
    }

    const stored = readStored();
    if (stored?.open && stored.submittedQuery) {
      void runSearch(stored.submittedQuery, { scrollToResults: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 시 1회만 복원
  }, []);

  // 다른 페이지의 헤더 돋보기로 진입한 경우(#home-insight-search) — 검색 섹션으로 스크롤 후 focus
  // q 파라미터 복원(위 effect)과 독립적으로 동작하며 서로 간섭하지 않음
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== `#${HOME_SEARCH_SECTION_ID}`) return;
    const timer = window.setTimeout(() => {
      document.getElementById(HOME_SEARCH_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }, 80);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 시 1회만 확인
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void runSearch(query);
  }

  function handleTextareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter' || e.shiftKey) return;
    // 한글 IME 조합 중 Enter는 검색을 실행하지 않음
    if (e.nativeEvent.isComposing || (e as unknown as { keyCode?: number }).keyCode === 229) return;
    e.preventDefault();
    void runSearch(query);
  }

  function handleClear() {
    requestIdRef.current += 1; // 진행 중이던 요청 응답을 무효화
    setQuery('');
    setResults([]);
    setOpen(false);
    setError(false);
    setLoading(false);
    setActiveSuggestion(null);
    clearStored();
    syncUrl(null);
    textareaRef.current?.focus();
  }

  return (
    <section
      id={HOME_SEARCH_SECTION_ID}
      aria-labelledby="home-search-heading"
      className="scroll-mt-[72px] bg-ink px-5 md:px-8"
    >
      <div className="mx-auto flex min-h-[520px] max-w-[1600px] items-center py-20 md:min-h-[580px] md:py-24 lg:min-h-[600px] lg:py-28">
        <div
          className="mx-auto w-full max-w-[1120px] rounded-[4px] border border-white/10 bg-black/45 px-5 py-9 md:px-10 md:py-12 lg:px-14"
          style={{
            boxShadow:
              '0 28px 80px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="mx-auto max-w-[880px]">
            <p
              className="text-cream/45 text-[8px] uppercase tracking-[0.3em] mb-2 md:mb-2.5"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Search &middot; PAGEONEWORKS
            </p>
            <h2
              id="home-search-heading"
              className="text-cream font-light leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', wordBreak: 'keep-all' }}
            >
              지금 필요한 인사이트를 찾아보세요.
            </h2>
            <p
              className="mt-3 text-cream/45 text-[12px] leading-relaxed md:mt-3.5 md:text-[13px]"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, wordBreak: 'keep-all' }}
            >
              짧은 키워드부터 구체적인 질문까지 입력하면 관련 아티클을 찾아드립니다.
            </p>

            <form role="search" onSubmit={handleSubmit} className="mt-6 md:mt-8">
              <label htmlFor={HOME_SEARCH_INPUT_ID} className="sr-only">
                아티클 검색
              </label>
              <div className="flex flex-col gap-2.5 md:flex-row md:items-start md:gap-3">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-5 h-4 w-4 shrink-0 text-cream/35"
                    aria-hidden="true"
                  />
                  <textarea
                    ref={textareaRef}
                    id={HOME_SEARCH_INPUT_ID}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="예: 생성형 AI가 검색 시장과 콘텐츠 전략을 어떻게 바꾸고 있나요?"
                    maxLength={200}
                    rows={1}
                    className="min-h-[60px] max-h-[112px] w-full resize-none overflow-y-auto rounded-[3px] border border-white/15 bg-white/[0.04] py-[18px] pl-10 pr-9 text-[13px] leading-relaxed text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-gold md:text-[14px]"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                  {query.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="검색어 지우기"
                      className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center text-cream/40 transition-colors hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex h-[50px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] bg-gold px-5 text-[11px] font-medium uppercase tracking-[0.06em] text-ink transition-all duration-200 hover:brightness-[1.08] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] active:translate-y-[1px] active:brightness-95 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:h-[60px] md:w-[160px] md:text-[12px]"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  {loading ? '검색 중' : (
                    <>
                      인사이트 찾기
                      <ArrowRight
                        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </div>
              <p
                className="mt-2 text-[10px] text-cream/30"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Enter로 검색 · Shift+Enter로 줄바꿈
              </p>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 md:mt-4.5">
              {SUGGESTIONS.map((label) => {
                const selected = activeSuggestion === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => void runSearch(label)}
                    aria-pressed={selected}
                    className={`inline-flex h-8 items-center whitespace-nowrap border px-3 text-[10px] uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:text-[11px] ${
                      selected
                        ? 'border-gold bg-gold/10 text-cream'
                        : 'border-white/15 text-cream/45 hover:border-white/35 hover:text-cream/70'
                    }`}
                    style={{ fontFamily: 'var(--font-space-mono)' }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div ref={resultsRef} aria-live="polite" className="mt-7 md:mt-9">
              {open && (
                error ? (
                  <p className="text-[12px] leading-relaxed text-cream/40" style={{ fontFamily: 'var(--font-inter)' }}>
                    검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                ) : results.length === 0 && !loading ? (
                  <p className="text-[12px] leading-relaxed text-cream/40" style={{ fontFamily: 'var(--font-inter)' }}>
                    &lsquo;{query}&rsquo;에 대한 검색 결과가 없습니다.
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    {results.map((item) => (
                      <li key={item.slug} className="min-w-0">
                        <Link
                          href={`/article/${item.slug}`}
                          className="flex min-h-[44px] min-w-0 gap-3 border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                        >
                          <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden bg-black min-[390px]:h-[82px] min-[390px]:w-[82px] md:h-[92px] md:w-[92px]">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              sizes="(min-width: 768px) 92px, 82px"
                              quality={70}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col overflow-hidden py-0.5">
                            <p
                              className="mb-1 shrink-0 text-[9px] uppercase tracking-[0.1em] md:text-[10px]"
                              style={{ fontFamily: 'var(--font-space-mono)', color: GOLD }}
                            >
                              {item.category}
                            </p>
                            <p
                              className="line-clamp-2 min-w-0 text-[12.5px] font-light leading-snug text-cream md:text-[13px]"
                              style={{ fontFamily: 'var(--font-cormorant)', wordBreak: 'keep-all' }}
                            >
                              {item.title}
                            </p>
                            {item.excerpt && (
                              <p
                                className="mt-1 line-clamp-1 min-w-0 text-[10px] text-cream/40 md:text-[11px]"
                                style={{ fontFamily: 'var(--font-inter)' }}
                              >
                                {item.excerpt}
                              </p>
                            )}
                            <p
                              className="mt-auto whitespace-nowrap text-[9px] text-cream/30 md:text-[10px]"
                              style={{ fontFamily: 'var(--font-space-mono)' }}
                            >
                              {item.date} &middot; {item.readTime}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeSearchFallback() {
  return (
    <section id="home-search" aria-hidden="true" className="bg-ink px-5 md:px-8">
      <div className="mx-auto flex min-h-[520px] max-w-[1600px] items-center py-20 md:min-h-[580px] md:py-24 lg:min-h-[600px] lg:py-28">
        <div className="mx-auto h-[240px] w-full max-w-[1120px] rounded-[4px] border border-white/10 bg-black/45" />
      </div>
    </section>
  );
}

export function HomeSearchSection() {
  return (
    <Suspense fallback={<HomeSearchFallback />}>
      <HomeSearchSectionInner />
    </Suspense>
  );
}
