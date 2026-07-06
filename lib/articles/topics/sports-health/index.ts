import type { Article } from '../../../data';
import { fitnessGuideArticles } from './fitness-guide';
import { sportsTrendArticles } from './sports-trend';
import { recoveryBodyArticles } from './recovery-body';
import { outdoorLifeArticles } from './outdoor-life';
import { performanceArticles } from './performance';

export const sportsHealthTopicArticles: Article[] = [
  ...fitnessGuideArticles,
  ...sportsTrendArticles,
  ...recoveryBodyArticles,
  ...outdoorLifeArticles,
  ...performanceArticles,
];
