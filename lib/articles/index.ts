import { vitalityArticles } from './vitality';
import { propertiesArticles } from './properties';
import { driveTechArticles } from './drive-tech';
import { legalFinanceArticles } from './legal-finance';
import { lifestyleArticles } from './lifestyle';
import { beautyWellnessArticles } from './beauty-wellness';
import { foodDiningArticles } from './food-dining';
import { educationArticles } from './education';

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
  driveTechArticles ?? [],      // ← SEO글이 1번째 → 히어로
  vitalityArticles ?? [],       // ← 2번째 → 오른쪽 상단
  propertiesArticles ?? [],     // ← 3번째 → 오른쪽 하단
  legalFinanceArticles ?? [],   // ← 4번째 → 하단 왼쪽
  lifestyleArticles ?? [],      // ← 5번째 → 하단 중앙
  beautyWellnessArticles ?? [], // ← 6번째 → 하단 오른쪽
  foodDiningArticles ?? [],
  educationArticles ?? [],
);