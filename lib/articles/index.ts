import { vitalityArticles } from './vitality';
import { propertiesArticles } from './properties';
import { driveTechArticles } from './drive-tech';
import { legalFinanceArticles } from './legal-finance';
import { lifestyleArticles } from './lifestyle';
import { beautyWellnessArticles } from './beauty-wellness';
import { foodDiningArticles } from './food-dining';
import { educationArticles } from './education';

export const articles = [
  ...(vitalityArticles ?? []),
  ...(propertiesArticles ?? []),
  ...(driveTechArticles ?? []),
  ...(legalFinanceArticles ?? []),
  ...(lifestyleArticles ?? []),
  ...(beautyWellnessArticles ?? []),
  ...(foodDiningArticles ?? []),
  ...(educationArticles ?? []),
];