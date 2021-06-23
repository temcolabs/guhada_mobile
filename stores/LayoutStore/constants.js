export const LAYOUT_TYPE = {
  /**
   * DEFAULT
   */
  default: 'default',
  /**
   * HOME
   */
  home: {
    default: 'index',
    women: 'submenu',
    men: 'submenu',
    kids: 'submenu',
  },
  /**
   * EVENT
   */
  event: {
    default: 'default',
    specialdetail: 'detail',
    eventdetail: 'detail',
  },
  /**
   * SEARCH
   */
  search: {
    default: 'title',
    category: 'category',
    brand: 'brand',
    keyword: 'keyword',
    condition: 'condition',
  },
  /**
   * MYPAGE
   */
  mypage: {
    default: 'mypage',
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
 *  submenu: boolean,
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
  /**
   * DEFAULT
   */
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
  /**
   * HOME
   */
  index: {
    type: 'index',
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
  submenu: {
    type: 'submenu',
    headerFlags: {
      logo: true,
      burger: true,
      search: true,
      cart: true,
      menu: true,
      submenu: true,
      slide: true,
      plugins: {
        top: true,
        kakao: true,
        recent: true,
      },
    },
  },
  /**
   * DETAIL
   */
  detail: {
    type: 'detail',
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
  /**
   * SEARCH
   */
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
  brand: {
    type: 'brand',
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
  keyword: {
    type: 'keyword',
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
  /**
   * MYPAGE
   */
  mypage: {
    type: 'mypage',
    headerFlags: {
      title: true,
      search: true,
      cart: true,
      burger: true,
      plugins: {
        top: true,
      },
    },
  },
};
