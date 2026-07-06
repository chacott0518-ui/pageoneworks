import type { Article } from '../../data';
import { vitalityTopicArticles } from './vitality';
import { propertiesTopicArticles } from './properties';
import { driveTechTopicArticles } from './drive-tech';
import { legalFinanceTopicArticles } from './legal-finance';
import { lifestyleTravelTopicArticles } from './lifestyle-travel';
import { beautyWellnessTopicArticles } from './beauty-wellness';
import { foodDiningTopicArticles } from './food-dining';
import { educationTopicArticles } from './education';
import { sportsHealthTopicArticles } from './sports-health';
import { cultureArtTopicArticles } from './culture-art';
import { petFamilyTopicArticles } from './pet-family';
import { globalTrendTopicArticles } from './global-trend';

export const topicArticles: Article[] = [
  ...vitalityTopicArticles,
  ...propertiesTopicArticles,
  ...driveTechTopicArticles,
  ...legalFinanceTopicArticles,
  ...lifestyleTravelTopicArticles,
  ...beautyWellnessTopicArticles,
  ...foodDiningTopicArticles,
  ...educationTopicArticles,
  ...sportsHealthTopicArticles,
  ...cultureArtTopicArticles,
  ...petFamilyTopicArticles,
  ...globalTrendTopicArticles,
];
