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
    headerFlags: {
      back: true,
      burger: true,
      search: true,
      cart: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  specialdetail: {
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
    headerFlags: {
      title: true,
      back: true,
      burger: true,
      search: true,
      cart: true,
      category: true,
      filter: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  brand: {
    headerFlags: {
      title: true,
      back: true,
      burger: true,
      search: true,
      cart: true,
      filter: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  keyword: {
    headerFlags: {
      filter: true,
      searchbox: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  condition: {
    headerFlags: {
      title: true,
      back: true,
      burger: true,
      search: true,
      cart: true,
      filter: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
};
