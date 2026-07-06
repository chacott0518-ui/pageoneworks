import type { Article } from '../../../data';
import { travelGuideArticles } from './travel-guide';
import { cultureSpotArticles } from './culture-spot';
import { homeLivingArticles } from './home-living';
import { consumerTrendArticles } from './consumer-trend';
import { localExperienceArticles } from './local-experience';

export const lifestyleTravelTopicArticles: Article[] = [
  ...travelGuideArticles,
  ...cultureSpotArticles,
  ...homeLivingArticles,
  ...consumerTrendArticles,
  ...localExperienceArticles,
];
