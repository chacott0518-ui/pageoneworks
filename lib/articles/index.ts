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

export const articles = interleave(
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