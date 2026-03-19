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
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorUrl?: string;
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
    titleKo: '모빌리티·AI·IT',
    desc: 'Mobility, AI & Tech',
    descKo: '자동화·미래 모빌리티·AI·IT 트렌드',
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
    titleKo: '라이프·여행·골프',
    desc: 'Life, Travel & Golf',
    descKo: '골프·호텔·여행·라이프스타일',
    color: '#9A7A9E',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=85',
  },
  {
    id: '06',
    slug: 'beauty-wellness',
    title: 'BEAUTY & WELLNESS',
    titleKo: '뷰티·피부·성형',
    desc: 'Beauty & Wellness',
    descKo: '피부과·성형외과·뷰티·스파',
    color: '#C4899A',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=85',
  },
  {
    id: '07',
    slug: 'food-dining',
    title: 'FOOD & DINING',
    titleKo: '미식·레스토랑·와인',
    desc: 'Food & Dining',
    descKo: '미쉐린·레스토랑·와인·건강식품',
    color: '#C4A27A',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',
  },
  {
    id: '08',
    slug: 'education',
    title: 'EDUCATION',
    titleKo: '교육·유학·자격증',
    desc: 'Education & Study',
    descKo: '유학·어학원·프리미엄 교육기관',
    color: '#7A9EB5',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=85',
  },
  {
    id: '09',
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