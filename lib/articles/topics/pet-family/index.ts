import type { Article } from '../../../data';
import { petCareArticles } from './pet-care';
import { familyLifeArticles } from './family-life';
import { childParentArticles } from './child-parent';
import { companionCultureArticles } from './companion-culture';
import { homeCareArticles } from './home-care';

export const petFamilyTopicArticles: Article[] = [
  ...petCareArticles,
  ...familyLifeArticles,
  ...childParentArticles,
  ...companionCultureArticles,
  ...homeCareArticles,
];
