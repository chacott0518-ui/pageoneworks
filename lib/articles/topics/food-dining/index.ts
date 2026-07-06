import type { Article } from '../../../data';
import { restaurantGuideArticles } from './restaurant-guide';
import { foodTrendArticles } from './food-trend';
import { cafeDessertArticles } from './cafe-dessert';
import { diningCultureArticles } from './dining-culture';
import { localTasteArticles } from './local-taste';

export const foodDiningTopicArticles: Article[] = [
  ...restaurantGuideArticles,
  ...foodTrendArticles,
  ...cafeDessertArticles,
  ...diningCultureArticles,
  ...localTasteArticles,
];
