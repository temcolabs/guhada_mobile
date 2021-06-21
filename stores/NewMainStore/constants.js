import detectDevice from 'childs/lib/common/detectDevice';

export const pageTypes = {
  home: {
    type: 'home',
    name: 'ALL',
    koName: '전체',
    unitPerPage: {
      premiumItem: 10,
      bestItem: 6,
      newIn: 6,
    },
  },
  women: {
    type: 'women',
    name: 'WOMEN',
    koName: '여성',
  },
  men: {
    type: 'men',
    name: 'MEN',
    koName: '남성',
  },
  kids: {
    type: 'kids',
    name: 'KIDS',
    koName: '키즈',
  },
};

export const dealOptions = [
  { name: 'ALL', koName: '전체', id: 0 },
  { name: 'WOMEN', koName: '여성', id: 1 },
  { name: 'MEN', koName: '남성', id: 2 },
  { name: 'KIDS', koName: '키즈', id: 3 },
];

export const services = ['search', 'settle', 'product', 'user'];

export const dataNames = [
  'premiumItem',
  'bestItem',
  'newIn',
  'mainData',
  'hotKeyword',
  'bestReview',
];

export const API_ENDPOINT = {
  search: [
    ['premiumItem', `/ps/main-home/deals/plus-item?unitPerPage=60`],
    ['bestItem', `/ps/hits/list?unitPerPage=60`],
    ['newIn', `/ps/main-home/deals/new-arrivals?unitPerPage=60`],
  ],
  settle: [
    [
      'mainData',
      `/selectMainData?agent=${detectDevice().isMobile ? 'MWEB' : 'WEB'}`,
    ],
  ],
  product: [['hotKeyword', '/main-home/hot-keyword']],
  user: [['bestReview', `/main-best-reviews?unitPerPage=10`]],
};
