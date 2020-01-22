export const EVENT_FILTER = [
  {
    label: '진행중 이벤트',
    value: 'PROGRESS',
  },
  {
    label: '종료 이벤트',
    value: 'END',
  },
];

export const SPECIAL_FILTER = [
  {
    label: '진행중 기획전',
    value: 'PROGRESS',
  },
  {
    label: '종료 기획전',
    value: 'END',
  },
  {
    label: '전체 기획전',
    value: 'ALL',
  },
];

export const SPECIAL_DETAIL_FILTER = [
  {
    label: '신상품 순',
    value: 'NEW',
  },
  {
    label: '가격 순',
    value: 'PRICE',
  },
];

export const SPECIAL_DETAIL_ORDER = [
  { label: '신상품순', value: 'DATE' },
  // { label: '평점순', value: 'SCORE' },
  { label: '낮은가격순', value: 'PRICE_ASC' },
  { label: '높은가격순', value: 'PRICE_DESC' },
];
