export const LAYOUT_TYPE = {
  /* index */
  main: 'main',
  default: 'default',
  /* specialdetail */
  specialdetail: 'specialdetail',
  /* search */
  search: {
    category: 'category',
    brand: 'brand',
    keyword: 'keyword',
    condition: 'condition',
  },
};

/**
 * JSDoc typedefs
 *
 * @typedef {{
 *  title: boolean,
 *  logo: boolean,
 *  burger: boolean,
 *  back: boolean,
 *  home: boolean,
 *  search: boolean,
 *  cart: boolean,
 *  menu: boolean,
 *  category: boolean,
 *  filter: boolean,
 *  slide: boolean,
 *  searchbox: boolean,
 *  plugins: {
 *    top: boolean,
 *    kakao: boolean,
 *    recent: boolean,
 *  },
 * }} HeaderFlags
 */

/**
 * layout properties
 */
export const layouts = {
  main: {
    type: 'main',
    headerFlags: {
      logo: true,
      burger: true,
      search: true,
      cart: true,
      menu: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  default: {
    type: 'default',
    headerFlags: {
      logo: true,
      burger: true,
      search: true,
      cart: true,
      menu: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  specialdetail: {
    type: 'specialdetail',
    headerFlags: {
      title: true,
      burger: true,
      back: true,
      search: true,
      cart: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  category: {
    type: 'category',
    headerFlags: {
      title: true,
      back: true,
      burger: true,
      search: true,
      cart: true,
      category: true,
      filter: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  brand: {
    type: 'brand',
    headerFlags: {
      title: true,
      back: true,
      burger: true,
      search: true,
      cart: true,
      filter: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  keyword: {
    type: 'keyword',
    headerFlags: {
      filter: true,
      searchbox: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  condition: {
    type: 'condition',
    headerFlags: {
      title: true,
      back: true,
      burger: true,
      search: true,
      cart: true,
      filter: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
};
