export const LAYOUT_TYPE = {
  /* index page */
  DEFAULT: 'default',
  /* search page */
  CATEGORY: 'category',
  BRAND: 'brand',
  KEYWORD: 'keyword',
};

/**
 * JSDoc typedefs
 *
 * @typedef {{
 *  logo: boolean,
 *  title: boolean,
 *  back: boolean,
 *  home: boolean,
 *  search: boolean,
 *  category: boolean,
 *  filter: boolean,
 *  slide: boolean,
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
      title: false,
      back: false,
      home: false,
      search: false,
      category: false,
      filter: false,
      slide: false,
      searchbox: false,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  default: {
    headerFlags: {
      title: true,
      back: true,
      filter: true,
      slide: false,
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
    headerFlags: {
      title: true,
      back: true,
      filter: true,
      slide: false,
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
      slide: false,
      searchbox: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
};
