import type { Article } from '../../../data';
import { skinBeautyArticles } from './skin-beauty';
import { clinicGuideArticles } from './clinic-guide';
import { selfCareArticles } from './self-care';
import { antiAgingArticles } from './anti-aging';
import { beautyTrendArticles } from './beauty-trend';

export const beautyWellnessTopicArticles: Article[] = [
  ...skinBeautyArticles,
  ...clinicGuideArticles,
  ...selfCareArticles,
  ...antiAgingArticles,
  ...beautyTrendArticles,
];
