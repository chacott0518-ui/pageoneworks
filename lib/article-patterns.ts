import type { Article, ArticleContentPattern } from './data';

export const VALID_CONTENT_PATTERNS: ArticleContentPattern[] = ['A', 'B', 'C', 'D', 'E'];

export function isValidContentPattern(value: unknown): value is ArticleContentPattern {
  return typeof value === 'string' && (VALID_CONTENT_PATTERNS as string[]).includes(value);
}

/** topic 파일 출처 글 중 contentPattern 누락·잘못된 값 (검증용) */
export function findArticlesWithInvalidContentPattern(
  topicSourcedArticles: { slug: string; contentPattern?: ArticleContentPattern }[],
): { slug: string; reason: 'missing' | 'invalid'; value?: string }[] {
  const issues: { slug: string; reason: 'missing' | 'invalid'; value?: string }[] = [];
  for (const a of topicSourcedArticles) {
    if (!a.contentPattern) {
      issues.push({ slug: a.slug, reason: 'missing' });
    } else if (!isValidContentPattern(a.contentPattern)) {
      issues.push({ slug: a.slug, reason: 'invalid', value: String(a.contentPattern) });
    }
  }
  return issues;
}

export type ArticlePattern = {
  id: ArticleContentPattern;
  name: string;
  purpose: string;
  structure: string[];
  examples: string[];
};

/**
 * 신규 글 작성 시 선택하는 내부 구조 가이드.
 * URL·라우트·sitemap·SEO 메타를 생성하지 않는다.
 */
export const articlePatterns: Record<ArticleContentPattern, ArticlePattern> = {
  A: {
    id: 'A',
    name: 'Direct Answer Guide',
    purpose: '사용자가 명확한 질문을 검색할 때',
    structure: [
      '직접 답변',
      '핵심 요약',
      '판단 기준',
      '체크리스트',
      'FAQ',
      '출처',
    ],
    examples: ['대출금리 이대로 좋은가', '홈페이지가 검색에 안 나오는 이유'],
  },
  B: {
    id: 'B',
    name: 'Comparison & Decision',
    purpose: 'A와 B를 비교하거나 선택 기준을 줄 때',
    structure: [
      '결론',
      '비교표',
      '상황별 추천',
      '장단점',
      '주의사항',
      'FAQ',
      '출처',
    ],
    examples: ['고정금리 vs 변동금리', 'HIIT vs LISS'],
  },
  C: {
    id: 'C',
    name: 'Trend & Issue Analysis',
    purpose: '시장, 정책, 사회 이슈, 글로벌 트렌드 해석',
    structure: [
      '지금 이슈',
      '원인',
      '영향',
      '이해관계자별 변화',
      '앞으로 볼 지표',
      'FAQ',
      '출처',
    ],
    examples: ['금리 변화', 'AI 검색 시장', '부동산 정책'],
  },
  D: {
    id: 'D',
    name: 'Practical Checklist',
    purpose: '독자가 바로 점검해야 하는 실무형 글',
    structure: [
      '문제 정의',
      '5~10개 체크리스트',
      '우선순위',
      '실수 방지',
      '실행 순서',
      'FAQ',
      '출처',
    ],
    examples: ['검색 노출 점검', '사업자 비용 점검', '입시 준비 체크'],
  },
  E: {
    id: 'E',
    name: 'Explainer Story',
    purpose: '문화, 라이프스타일, 음식, 예술, 가족, 반려동물 등 읽는 맛이 필요한 글',
    structure: [
      '장면/질문',
      '배경 설명',
      '핵심 개념',
      '사례',
      '선택 기준',
      'FAQ',
      '출처',
    ],
    examples: ['오마카세 인기 이유', '아트바젤 컬렉팅 가이드'],
  },
};

export function getArticlePattern(id: ArticleContentPattern): ArticlePattern {
  return articlePatterns[id];
}
