import type { Article } from './data';
import { siteConfig } from './site.config';

const PRODUCTION_HOST = 'www.pageoneworks.com';

/** Article.date / updatedAt → epoch ms (YYYY.MM.DD 또는 ISO). 잘못된 값은 0 */
export function parseArticleDate(article: Article): number {
  const raw = (article.updatedAt ?? article.date).trim();
  if (!raw) return 0;
  const normalized = raw.includes('.') ? raw.replace(/\./g, '-') : raw;
  const ms = new Date(normalized).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

/** ISO 날짜 문자열 (YYYY-MM-DD). RSS·sitemap lastModified용 */
export function normalizeArticleDate(article: Article): string {
  const ms = parseArticleDate(article);
  if (ms === 0) return '1970-01-01';
  return new Date(ms).toISOString().slice(0, 10);
}

/** 날짜 파싱 실패 글 slug 목록 (빌드는 깨지지 않음, 보고용) */
export function findArticlesWithInvalidDates(list: Article[]): string[] {
  return list
    .filter((a) => parseArticleDate(a) === 0 && (a.updatedAt ?? a.date).trim() !== '')
    .map((a) => a.slug);
}

/** 날짜 최신순 (내림차순) — 원본 배열은 변경하지 않음 */
export function sortArticlesByDateDesc(list: Article[]): Article[] {
  return [...list].sort((a, b) => parseArticleDate(b) - parseArticleDate(a));
}

/**
 * legacy flat articles + topic file articles 통합.
 * slug 중복 시 먼저 나온 항목 유지 (검증 스크립트가 중복 감지).
 */
export function mergeArticleSources(...sources: Article[][]): Article[] {
  const seen = new Set<string>();
  const result: Article[] = [];
  for (const source of sources) {
    for (const article of source) {
      if (seen.has(article.slug)) continue;
      seen.add(article.slug);
      result.push(article);
    }
  }
  return result;
}

export function findDuplicateArticleSlugs(list: Article[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const a of list) {
    if (seen.has(a.slug)) dups.add(a.slug);
    else seen.add(a.slug);
  }
  return Array.from(dups);
}

export function findDuplicateArticleIds(list: Article[]): string[] {
  const seen = new Set<string>();
  const dups = new Set<string>();
  for (const a of list) {
    const id = String(a.id);
    if (seen.has(id)) dups.add(id);
    else seen.add(id);
  }
  return Array.from(dups);
}

/** titleKo 중복 — 경고용 */
export function findDuplicateTitleKos(list: Article[]): string[] {
  const map = new Map<string, string[]>();
  for (const a of list) {
    const arr = map.get(a.titleKo) ?? [];
    arr.push(a.slug);
    map.set(a.titleKo, arr);
  }
  return Array.from(map.entries())
    .filter(([, slugs]) => slugs.length > 1)
    .map(([title]) => title);
}

/** thumbnail image URL 중복 — 경고용 */
export function findDuplicateImageUrls(list: Article[]): string[] {
  const map = new Map<string, string[]>();
  for (const a of list) {
    const arr = map.get(a.image) ?? [];
    arr.push(a.slug);
    map.set(a.image, arr);
  }
  return Array.from(map.entries())
    .filter(([, slugs]) => slugs.length > 1)
    .map(([url]) => url);
}

const BODY_TOKEN_LEAKS = [
  '##IMAGE##',
  '##CAPTION##',
  '##INFOBOX##',
  '##STATGRID##',
  '##TABLEROW##',
  '##CTA##',
  '##CTABLOCK##',
  '##END##',
  '##SOURCES##',
  '##YEONSEI##',
];

/** 렌더 후 누출이면 안 되는 토큰이 body에 남아 있는지 (소스 검사) */
export function findArticlesWithBodyTokenLeaks(
  list: Article[],
): { slug: string; token: string }[] {
  const leaks: { slug: string; token: string }[] = [];
  for (const a of list) {
    if (!a.body) continue;
    for (const token of BODY_TOKEN_LEAKS) {
      if (a.body.includes(token)) leaks.push({ slug: a.slug, token });
    }
  }
  return leaks;
}

export function getLatestArticles(list: Article[], limit?: number): Article[] {
  const sorted = sortArticlesByDateDesc(list);
  return limit != null ? sorted.slice(0, limit) : sorted;
}

export function getArticlesByCategorySlug(list: Article[], categorySlug: string): Article[] {
  return sortArticlesByDateDesc(list.filter((a) => a.categorySlug === categorySlug));
}

/** MagazineGrid 탭 — category 표시명(title) 기준 */
export function getArticlesByCategoryTitle(list: Article[], categoryTitle: string): Article[] {
  return sortArticlesByDateDesc(list.filter((a) => a.category === categoryTitle));
}

/**
 * 카테고리 + 하위 주제 필터 (UI 전용, URL 생성 없음).
 * topicSlug가 null / 'all'이면 해당 카테고리 전체.
 * topicSlug가 있으면 일치하는 글만; topic 미지정 글은 '전체'에서만 노출.
 */
export function getArticlesByTopic(
  list: Article[],
  categorySlug: string,
  topicSlug: string | null,
): Article[] {
  const inCategory = list.filter((a) => a.categorySlug === categorySlug);
  if (!topicSlug || topicSlug === 'all') {
    return sortArticlesByDateDesc(inCategory);
  }
  return sortArticlesByDateDesc(inCategory.filter((a) => a.topicSlug === topicSlug));
}

/**
 * 카테고리 히어로 — featured 보존, 날짜 최신 featured 우선.
 * list가 이미 필터된 경우 categorySlug 생략 가능.
 */
export function getCategoryFeaturedArticle(
  list: Article[],
  categorySlug?: string,
): Article | undefined {
  const scoped = categorySlug
    ? list.filter((a) => a.categorySlug === categorySlug)
    : list;
  const sorted = sortArticlesByDateDesc(scoped);
  return sorted.find((a) => a.featured) ?? sorted[0];
}

/** 카테고리 그리드 — 히어로에 쓴 featured 1건 제외 후 최신순 */
export function getCategoryGridArticles(list: Article[], featured?: Article): Article[] {
  const sorted = sortArticlesByDateDesc(list);
  if (!featured) return sorted;
  return sorted.filter((a) => a.slug !== featured.slug);
}

/** sitemap article 엔트리용 — 전체 글 날짜 최신순 */
export function getSitemapArticles(list: Article[]): Article[] {
  return sortArticlesByDateDesc(list);
}

/** RSS feed 항목 — 날짜 최신순, limit 선택 */
export function getFeedArticles(list: Article[], limit?: number): Article[] {
  return getLatestArticles(list, limit);
}

/**
 * IndexNow 제출 후보 URL (생성만, 외부 제출 없음).
 * - canonical article URL만
 * - www.pageoneworks.com host만
 * - query / topic / preview / localhost / vercel URL 제외
 */
export function getIndexNowCandidateUrls(
  list: Article[],
  baseUrl: string = siteConfig.baseUrl,
  slugs?: string[],
): string[] {
  const base = baseUrl.replace(/\/$/, '');
  const scoped = slugs?.length
    ? list.filter((a) => slugs.includes(a.slug))
    : list;

  return scoped
    .map((a) => `${base}/article/${a.slug}`)
    .filter((url) => {
      try {
        const u = new URL(url);
        if (u.hostname !== PRODUCTION_HOST) return false;
        if (u.protocol !== 'https:') return false;
        if (u.search || u.hash) return false;
        if (/localhost|vercel\.app|127\.0\.0\.1/i.test(url)) return false;
        return true;
      } catch {
        return false;
      }
    });
}

// ─── 지금 주목할 아티클 (Spotlight) ─────────────────────────────

export type SpotlightOptions = {
  count?: number;
  recentDays?: number;
  manualSlugs?: string[];
  viewCounts?: Record<string, number>;
  maxPerCategory?: number;
};

function scoreSpotlightArticle(
  article: Article,
  cutoff: number,
  now: number,
  manualSlugs: string[],
  viewCounts: Record<string, number>,
): number {
  const dateMs = parseArticleDate(article);
  let score = 0;

  if (dateMs >= cutoff) {
    score += 1000;
    const span = Math.max(now - cutoff, 1);
    score += ((dateMs - cutoff) / span) * 100;
  } else {
    score += (dateMs / Math.max(now, 1)) * 40;
  }

  if (article.featured) score += 30;
  if (manualSlugs.includes(article.slug)) score += 150;

  const views = viewCounts[article.slug] ?? article.viewCount ?? 0;
  if (views > 0) {
    score += Math.min(Math.log10(views + 1) * 15, 45);
  }

  return score;
}

/**
 * 지금 주목할 아티클 선정.
 * - 최근 90일 우선, 부족 시 전체에서 fallback
 * - 수동 추천은 가중치만 (고정 7개 목록 아님)
 * - featured 보정 + 카테고리 다양성 (기본 카테고리당 최대 2건)
 */
export function getSpotlightArticles(
  list: Article[],
  options: SpotlightOptions = {},
): Article[] {
  const {
    count = 7,
    recentDays = 90,
    manualSlugs = [],
    viewCounts = {},
    maxPerCategory = 2,
  } = options;

  const now = Date.now();
  const cutoff = now - recentDays * 24 * 60 * 60 * 1000;

  const ranked = [...list].sort((a, b) => {
    const diff =
      scoreSpotlightArticle(b, cutoff, now, manualSlugs, viewCounts) -
      scoreSpotlightArticle(a, cutoff, now, manualSlugs, viewCounts);
    return diff !== 0 ? diff : parseArticleDate(b) - parseArticleDate(a);
  });

  const picked: Article[] = [];
  const perCategory: Record<string, number> = {};

  const tryPick = (candidates: Article[]) => {
    for (const article of candidates) {
      if (picked.length >= count) break;
      if (picked.some((p) => p.slug === article.slug)) continue;
      const cat = article.categorySlug;
      if ((perCategory[cat] ?? 0) >= maxPerCategory) continue;
      picked.push(article);
      perCategory[cat] = (perCategory[cat] ?? 0) + 1;
    }
  };

  const recent = ranked.filter((a) => parseArticleDate(a) >= cutoff);
  tryPick(recent);
  if (picked.length < count) tryPick(ranked);

  if (picked.length < count) {
    for (const article of ranked) {
      if (picked.length >= count) break;
      if (!picked.some((p) => p.slug === article.slug)) picked.push(article);
    }
  }

  return picked.slice(0, count);
}
