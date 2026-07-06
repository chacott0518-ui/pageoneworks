import type { Article } from '../../../data';
import { housingMarketArticles } from './housing-market';
import { subscriptionPolicyArticles } from './subscription-policy';
import { investmentBasicsArticles } from './investment-basics';
import { localRealEstateArticles } from './local-real-estate';
import { livingSpaceArticles } from './living-space';

export const propertiesTopicArticles: Article[] = [
  ...housingMarketArticles,
  ...subscriptionPolicyArticles,
  ...investmentBasicsArticles,
  ...localRealEstateArticles,
  ...livingSpaceArticles,
];
