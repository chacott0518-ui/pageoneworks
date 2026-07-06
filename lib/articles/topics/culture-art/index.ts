import type { Article } from '../../../data';
import { exhibitionArtArticles } from './exhibition-art';
import { booksIdeasArticles } from './books-ideas';
import { musicPerformanceArticles } from './music-performance';
import { collectingArticles } from './collecting';
import { creativePeopleArticles } from './creative-people';

export const cultureArtTopicArticles: Article[] = [
  ...exhibitionArtArticles,
  ...booksIdeasArticles,
  ...musicPerformanceArticles,
  ...collectingArticles,
  ...creativePeopleArticles,
];
