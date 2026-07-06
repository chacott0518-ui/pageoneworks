import type { Article } from '../../../data';
import { aiSearchArticles } from './ai-search';
import { mobilityArticles } from './mobility';
import { platformBusinessArticles } from './platform-business';
import { digitalToolsArticles } from './digital-tools';
import { futureIndustryArticles } from './future-industry';

export const driveTechTopicArticles: Article[] = [
  ...aiSearchArticles,
  ...mobilityArticles,
  ...platformBusinessArticles,
  ...digitalToolsArticles,
  ...futureIndustryArticles,
];
