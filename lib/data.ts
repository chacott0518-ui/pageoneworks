export type Category = {
  id: string;
  slug: string;
  title: string;
  titleKo: string;
  desc: string;
  descKo: string;
  color: string;
  image: string;
};

export type Article = {
  id: number;
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  titleKo: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  heroImage?: string;
  featured?: boolean;
  tags?: string[];
  author?: string;
  body?: string;
};

export const categories: Category[] = [
  {
    id: '01',
    slug: 'vitality',
    title: 'VITALITY',
    titleKo: '의료·안티에이징',
    desc: 'Medical & Anti-Aging',
    descKo: '최신 의료·건강·장수·병원 인사이트',
    color: '#8B9E7A',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=85',
  },
  {
    id: '02',
    slug: 'properties',
    title: 'PROPERTIES',
    titleKo: '프리미엄 부동산',
    desc: 'Premium Real Estate',
    descKo: '국내외 프리미엄 부동산·분양 정보',
    color: '#9E8A7A',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=85',
  },
  {
    id: '03',
    slug: 'drive-tech',
    title: 'DRIVE & TECH',
    titleKo: '모빌리티·AI',
    desc: 'Mobility & AI',
    descKo: '자동화·미래 모빌리티·기술 트렌드',
    color: '#7A8A9E',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85',
  },
  {
    id: '04',
    slug: 'legal-finance',
    title: 'LEGAL & FINANCE',
    titleKo: '세무·법률·자산',
    desc: 'Tax, Law & Asset',
    descKo: '세무·법률·글로벌 자산관리 전략',
    color: '#9E9A7A',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85',
  },
  {
    id: '05',
    slug: 'lifestyle-travel',
    title: 'LIFESTYLE & TRAVEL',
    titleKo: '라이프·여행·미식·골프',
    desc: 'Life, Travel & Dining',
    descKo: '미식·골프·호텔·여행·아트',
    color: '#9A7A9E',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85',
  },
  {
    id: '06',
    slug: 'archive',
    title: 'ARCHIVE',
    titleKo: '아카이브',
    desc: 'All Articles',
    descKo: '전체 아티클 저장소',
    color: '#7A9E9A',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=85',
  },
];

export { articles } from './articles/index';