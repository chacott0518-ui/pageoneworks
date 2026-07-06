import type { Article } from '../../../data';
import { admissionStrategyArticles } from './admission-strategy';
import { studyGuideArticles } from './study-guide';
import { careerSkillArticles } from './career-skill';
import { parentingEducationArticles } from './parenting-education';
import { globalEducationArticles } from './global-education';

export const educationTopicArticles: Article[] = [
  ...admissionStrategyArticles,
  ...studyGuideArticles,
  ...careerSkillArticles,
  ...parentingEducationArticles,
  ...globalEducationArticles,
];
