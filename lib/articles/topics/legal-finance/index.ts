import type { Article } from '../../../data';
import { taxMoneyArticles } from './tax-money';
import { businessLawArticles } from './business-law';
import { policyRegulationArticles } from './policy-regulation';
import { assetPlanningArticles } from './asset-planning';
import { economyWatchArticles } from './economy-watch';

export const legalFinanceTopicArticles: Article[] = [
  ...taxMoneyArticles,
  ...businessLawArticles,
  ...policyRegulationArticles,
  ...assetPlanningArticles,
  ...economyWatchArticles,
];
