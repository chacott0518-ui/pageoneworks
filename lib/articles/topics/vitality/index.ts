import type { Article } from '../../../data';
import { healthGuideArticles } from './health-guide';
import { womenLifeArticles } from './women-life';
import { wellnessRoutineArticles } from './wellness-routine';
import { agingPreventionArticles } from './aging-prevention';
import { medicalInfoArticles } from './medical-info';

export const vitalityTopicArticles: Article[] = [
  ...healthGuideArticles,
  ...womenLifeArticles,
  ...wellnessRoutineArticles,
  ...agingPreventionArticles,
  ...medicalInfoArticles,
];
