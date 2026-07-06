import type { Article } from '../../../data';
import { globalIssueArticles } from './global-issue';
import { marketTrendArticles } from './market-trend';
import { societyCultureArticles } from './society-culture';
import { technologyShiftArticles } from './technology-shift';
import { brandWatchArticles } from './brand-watch';

export const globalTrendTopicArticles: Article[] = [
  ...globalIssueArticles,
  ...marketTrendArticles,
  ...societyCultureArticles,
  ...technologyShiftArticles,
  ...brandWatchArticles,
];
