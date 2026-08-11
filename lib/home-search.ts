import type { Article } from './data';
import { parseArticleDate } from './article-selectors';
import { resolveArticleTopicLabel } from './article-taxonomy';

/**
 * PAGEONEWORKS 홈 검색 — ACA Magazine 검색 정책(점수화·AND 우선)을 이식.
 * 검색 대상: titleKo, title(영문), excerpt, tags, category, 하위 주제 라벨.
 * body는 검색 대상에서 제외 — 서버(API route)에서만 사용하고 클라이언트로 전송하지 않음.
 */

export const HOME_SEARCH_RESULT_LIMIT = 5;

export type HomeSearchResultItem = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
};

function normalizeSearchText(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** 정규화된 텍스트 안에서 term 등장 횟수 */
function countOccurrences(text: string, term: string): number {
  if (!text || !term) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(term, pos)) !== -1) {
    count += 1;
    pos += term.length;
  }
  return count;
}

/**
 * 아티클 검색 점수.
 * 제목 정확 일치 > 제목 포함 > 여러 검색어 모두 포함(AND) > 태그 > 요약 > 카테고리/하위주제.
 */
function scoreArticle(article: Article, query: string, terms: string[]): number {
  const titleKo = normalizeSearchText(article.titleKo ?? '');
  const titleEn = normalizeSearchText(article.title ?? '');
  const excerpt = normalizeSearchText(article.excerpt ?? '');
  const categoryText = normalizeSearchText(article.category ?? '');
  const topicText = normalizeSearchText(resolveArticleTopicLabel(article) ?? '');
  const tags = (article.tags ?? []).map((tag) => normalizeSearchText(tag));

  let score = 0;

  // 1. 한글 제목 정확 일치
  if (query.length > 0 && titleKo === query) score += 1000;

  // 2. 한글 제목에 전체 검색어 포함
  if (query.length > 0 && titleKo.includes(query)) score += 420;

  // 3. 한글 제목의 개별 검색어 일치
  for (const term of terms) {
    score += countOccurrences(titleKo, term) * 45;
  }
  // AND 우선 — 여러 검색어가 모두 제목에 포함되면 보너스
  if (terms.length > 1 && terms.every((term) => titleKo.includes(term))) {
    score += 90;
  }

  // 4. 영문 제목
  if (query.length > 0 && titleEn.includes(query)) score += 160;
  for (const term of terms) {
    score += countOccurrences(titleEn, term) * 22;
  }

  // 5. 태그 — 정확 일치 > 개별 검색어 정확 일치 > 포함
  for (const tag of tags) {
    if (tag === query) score += 140;
    else if (terms.some((term) => tag === term)) score += 110;
    else if (terms.some((term) => tag.includes(term))) score += 55;
  }

  // 6. 요약(excerpt)
  if (query.length > 0 && excerpt.includes(query)) score += 70;
  for (const term of terms) {
    score += countOccurrences(excerpt, term) * 12;
  }
  if (terms.length > 1 && terms.every((term) => excerpt.includes(term))) {
    score += 35;
  }

  // 7. 메인 카테고리 · 하위 주제 — 보조 점수
  for (const term of terms) {
    score += countOccurrences(topicText, term) * 14;
    score += countOccurrences(categoryText, term) * 10;
  }

  return score;
}

/**
 * 홈 검색 실행. score > 0인 아티클만 반환, 점수 내림차순 → 동점 시 최신순.
 * 반환 항목은 body를 포함하지 않는 경량 필드로만 구성.
 */
export function searchHomeArticles(rawQuery: string, list: Article[]): HomeSearchResultItem[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];

  const terms = query.split(' ').filter((term) => term.length >= 1);
  const seenSlugs = new Set<string>();

  const scored: { article: Article; score: number }[] = [];
  for (const article of list) {
    if (article.indexable === false) continue;
    if (seenSlugs.has(article.slug)) continue;
    const score = scoreArticle(article, query, terms);
    if (score <= 0) continue;
    seenSlugs.add(article.slug);
    scored.push({ article, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return parseArticleDate(b.article) - parseArticleDate(a.article);
  });

  return scored.map(({ article }) => ({
    slug: article.slug,
    title: article.titleKo || article.title,
    category: article.category,
    excerpt: article.excerpt,
    image: article.image || article.heroImage || '',
    date: article.date,
    readTime: article.readTime,
  }));
}
