import { vitalityArticles } from './vitality';
import { propertiesArticles } from './properties';
import { driveTechArticles } from './drive-tech';
import { legalFinanceArticles } from './legal-finance';
import { lifestyleArticles } from './lifestyle';
import { beautyWellnessArticles } from './beauty-wellness';
import { foodDiningArticles } from './food-dining';
import { educationArticles } from './education';
import { sportsHealthArticles } from './sports-health';
import { cultureArtArticles } from './culture-art';
import { petFamilyArticles } from './pet-family';
import { globalTrendArticles } from './global-trend';
import { topicArticles } from './topics';
import { mergeArticleSources } from '../article-selectors';

function interleave<T>(...arrays: T[][]): T[] {
  const result: T[] = [];
  const max = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < max; i++) {
    for (const arr of arrays) {
      if (arr[i] !== undefined) result.push(arr[i]);
    }
  }
  return result;
}

/** 기존 flat 카테고리 파일 — legacy, interleave 순서 유지 */
export const legacyArticles = interleave(
  driveTechArticles      ?? [],
  vitalityArticles       ?? [],
  propertiesArticles     ?? [],
  legalFinanceArticles   ?? [],
  lifestyleArticles      ?? [],
  beautyWellnessArticles ?? [],
  foodDiningArticles     ?? [],
  educationArticles      ?? [],
  sportsHealthArticles   ?? [],
  cultureArtArticles     ?? [],
  petFamilyArticles      ?? [],
  globalTrendArticles    ?? [],
);

export {
  parseArticleDate,
  normalizeArticleDate,
  sortArticlesByDateDesc,
  mergeArticleSources,
  getLatestArticles,
  getArticlesByCategorySlug,
  getArticlesByCategoryTitle,
  getArticlesByTopic,
  getCategoryFeaturedArticle,
  getCategoryGridArticles,
  getSpotlightArticles,
  getSitemapArticles,
  getFeedArticles,
  getIndexNowCandidateUrls,
  findArticlesWithInvalidDates,
  findDuplicateArticleSlugs,
  findDuplicateArticleIds,
  findDuplicateTitleKos,
  findDuplicateImageUrls,
  findArticlesWithBodyTokenLeaks,
} from '../article-selectors';

export {
  categoryTopics,
  getTopicsForCategory,
  getTopicLabel,
  resolveArticleTopicLabel,
  isValidCategorySlug,
  isValidTopicSlug,
  findArticlesWithUnknownTopic,
  findArticlesWithInvalidCategory,
  findArticlesMissingRecommendedTopic,
  ALL_TOPIC_VALUE,
} from '../article-taxonomy';
export type { CategoryTopic } from '../article-taxonomy';

export {
  articlePatterns,
  getArticlePattern,
  VALID_CONTENT_PATTERNS,
  isValidContentPattern,
  findArticlesWithInvalidContentPattern,
} from '../article-patterns';
export type { ArticlePattern } from '../article-patterns';

export { topicArticles };

/** legacy flat + 미래 topic 파일 통합 — 기존 import 경로 유지 */
export const articles = mergeArticleSources(legacyArticles, topicArticles);
