/**
 * 카테고리별 넓은 하위 주제 taxonomy.
 * - 특정 글 주제가 아닌, 앞으로 여러 글을 담을 운영 분류.
 * - 새 indexable URL을 만들지 않는다 (UI 필터 전용).
 */

export type CategoryTopic = {
  slug: string;
  label: string;
};

export const ALL_TOPIC_VALUE = 'all' as const;

/** 카테고리 slug → 하위 주제 목록 */
export const categoryTopics: Record<string, CategoryTopic[]> = {
  vitality: [
    { slug: 'health-guide', label: 'Health Guide' },
    { slug: 'women-life', label: 'Women & Life' },
    { slug: 'wellness-routine', label: 'Wellness Routine' },
    { slug: 'aging-prevention', label: 'Aging & Prevention' },
    { slug: 'medical-info', label: 'Medical Info' },
  ],
  properties: [
    { slug: 'housing-market', label: 'Housing Market' },
    { slug: 'subscription-policy', label: 'Subscription & Policy' },
    { slug: 'investment-basics', label: 'Investment Basics' },
    { slug: 'local-real-estate', label: 'Local Real Estate' },
    { slug: 'living-space', label: 'Living Space' },
  ],
  'drive-tech': [
    { slug: 'ai-search', label: 'AI & Search' },
    { slug: 'mobility', label: 'Mobility' },
    { slug: 'platform-business', label: 'Platform Business' },
    { slug: 'digital-tools', label: 'Digital Tools' },
    { slug: 'future-industry', label: 'Future Industry' },
  ],
  'legal-finance': [
    { slug: 'tax-money', label: 'Tax & Money' },
    { slug: 'business-law', label: 'Business Law' },
    { slug: 'policy-regulation', label: 'Policy & Regulation' },
    { slug: 'asset-planning', label: 'Asset Planning' },
    { slug: 'economy-watch', label: 'Economy Watch' },
  ],
  'lifestyle-travel': [
    { slug: 'travel-guide', label: 'Travel Guide' },
    { slug: 'culture-spot', label: 'Culture Spot' },
    { slug: 'home-living', label: 'Home & Living' },
    { slug: 'consumer-trend', label: 'Consumer Trend' },
    { slug: 'local-experience', label: 'Local Experience' },
  ],
  'beauty-wellness': [
    { slug: 'skin-beauty', label: 'Skin & Beauty' },
    { slug: 'clinic-guide', label: 'Clinic Guide' },
    { slug: 'self-care', label: 'Self Care' },
    { slug: 'anti-aging', label: 'Anti Aging' },
    { slug: 'beauty-trend', label: 'Beauty Trend' },
  ],
  'food-dining': [
    { slug: 'restaurant-guide', label: 'Restaurant Guide' },
    { slug: 'food-trend', label: 'Food Trend' },
    { slug: 'cafe-dessert', label: 'Cafe & Dessert' },
    { slug: 'dining-culture', label: 'Dining Culture' },
    { slug: 'local-taste', label: 'Local Taste' },
  ],
  education: [
    { slug: 'admission-strategy', label: 'Admission Strategy' },
    { slug: 'study-guide', label: 'Study Guide' },
    { slug: 'career-skill', label: 'Career & Skill' },
    { slug: 'parenting-education', label: 'Parenting Education' },
    { slug: 'global-education', label: 'Global Education' },
  ],
  'sports-health': [
    { slug: 'fitness-guide', label: 'Fitness Guide' },
    { slug: 'sports-trend', label: 'Sports Trend' },
    { slug: 'recovery-body', label: 'Recovery & Body' },
    { slug: 'outdoor-life', label: 'Outdoor Life' },
    { slug: 'performance', label: 'Performance' },
  ],
  'culture-art': [
    { slug: 'exhibition-art', label: 'Exhibition & Art' },
    { slug: 'books-ideas', label: 'Books & Ideas' },
    { slug: 'music-performance', label: 'Music & Performance' },
    { slug: 'collecting', label: 'Collecting' },
    { slug: 'creative-people', label: 'Creative People' },
  ],
  'pet-family': [
    { slug: 'pet-care', label: 'Pet Care' },
    { slug: 'family-life', label: 'Family Life' },
    { slug: 'child-parent', label: 'Child & Parent' },
    { slug: 'companion-culture', label: 'Companion Culture' },
    { slug: 'home-care', label: 'Home Care' },
  ],
  'global-trend': [
    { slug: 'global-issue', label: 'Global Issue' },
    { slug: 'market-trend', label: 'Market Trend' },
    { slug: 'society-culture', label: 'Society & Culture' },
    { slug: 'technology-shift', label: 'Technology Shift' },
    { slug: 'brand-watch', label: 'Brand Watch' },
  ],
};

export function getTopicsForCategory(categorySlug: string): CategoryTopic[] {
  return categoryTopics[categorySlug] ?? [];
}

const VALID_CATEGORY_SLUGS = new Set(Object.keys(categoryTopics));

export function isValidCategorySlug(categorySlug: string): boolean {
  return VALID_CATEGORY_SLUGS.has(categorySlug);
}

export function getTopicLabel(categorySlug: string, topicSlug: string): string | undefined {
  return getTopicsForCategory(categorySlug).find((t) => t.slug === topicSlug)?.label;
}

/** topicSlug 우선, 없으면 legacy topicLabel — 화면 표시용 */
export function resolveArticleTopicLabel(article: {
  categorySlug: string;
  topicSlug?: string;
  topicLabel?: string;
}): string | undefined {
  if (article.topicSlug) {
    return getTopicLabel(article.categorySlug, article.topicSlug) ?? article.topicLabel;
  }
  return article.topicLabel;
}

export function isValidTopicSlug(categorySlug: string, topicSlug: string): boolean {
  return getTopicsForCategory(categorySlug).some((t) => t.slug === topicSlug);
}

/** taxonomy에 없는 topicSlug를 가진 글 목록 (검증용) */
export function findArticlesWithUnknownTopic(
  articles: { slug: string; categorySlug: string; topicSlug?: string }[],
): { slug: string; categorySlug: string; topicSlug: string }[] {
  return articles
    .filter((a) => a.topicSlug && !isValidTopicSlug(a.categorySlug, a.topicSlug))
    .map((a) => ({ slug: a.slug, categorySlug: a.categorySlug, topicSlug: a.topicSlug! }));
}

/** categories에 없는 categorySlug (archive 제외 검증 대상) */
export function findArticlesWithInvalidCategory(
  articles: { slug: string; categorySlug: string }[],
): { slug: string; categorySlug: string }[] {
  return articles
    .filter((a) => a.categorySlug !== 'archive' && !isValidCategorySlug(a.categorySlug))
    .map((a) => ({ slug: a.slug, categorySlug: a.categorySlug }));
}

/**
 * topic 파일 출처 글 중 topicSlug 누락 (검증용).
 * legacy flat 글은 이 함수 대상이 아님.
 */
export function findArticlesMissingRecommendedTopic(
  topicSourcedArticles: { slug: string; topicSlug?: string }[],
): { slug: string }[] {
  return topicSourcedArticles
    .filter((a) => !a.topicSlug?.trim())
    .map((a) => ({ slug: a.slug }));
}
