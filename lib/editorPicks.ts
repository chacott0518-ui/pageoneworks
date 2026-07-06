// ================================================================
// ✏️  수동 추천 (지금 주목할 아티클 가중치)
//     slug 목록 — getSpotlightArticles()의 manualSlugs로 전달됨
//     자동 선정(최신성·다양성)과 함께 반영되며, 고정 7개 목록이 아님
// ================================================================

export const MANUAL_SPOTLIGHT_SLUGS: string[] = [
    // 01 — 왼쪽 상단 LARGE
    'pregnancy-week-calculator',
  
    // 02 — 왼쪽 하단 MEDIUM 좌
    'pageoneworks-webinar-platform',
  
    // 03 — 왼쪽 하단 MEDIUM 우
    'carnguy-import-car-repair-guide',
  
    // 04 — 오른쪽 SMALL 1번
    'us-iran-war-korea-economy-2026',
  
    // 05 — 오른쪽 SMALL 2번
    'omakase-seoul-2026',
  
    // 06 — 오른쪽 SMALL 3번
    'ivy-league-admission-2026',
  
    // 07 — 오른쪽 SMALL 4번
    'art-basel-hong-kong-2026',
  ];

/** @deprecated MANUAL_SPOTLIGHT_SLUGS 사용 — 하위 호환 */
export const EDITOR_PICKS = MANUAL_SPOTLIGHT_SLUGS;