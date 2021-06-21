import { isBrowser } from 'childs/lib/common/isServer';
import { observable, computed, action, toJS } from 'mobx';
import { LAYOUT_TYPE, layouts } from './constants';
import { searchConditionMap } from '../SearchStore/SearchByFilterStore';
import qs from 'querystring';

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

class LayoutStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    if (initialState.layout) {
      this.type = initialState.layout.type;
      this.headerFlags = initialState.layout.headerFlags;
    }
  }

  /**
   * observables
   */
  @observable type = '';

  @observable headerFlags = {};

  /**
   * computeds
   */
  /** @type {number} */
  @computed get recentCount() {
    if (isBrowser) {
      return this.root.mypageRecentlySeen.list.length;
    }
    return 0;
  }

  /** @type {{title: string, category: object}} header info getter (depth-first-search) */
  @computed get headerInfo() {
    if (isBrowser && this.handleHeaderInfo[this.type]) {
      return this.handleHeaderInfo[this.type]();
    }
    return this.handleHeaderInfo.default();
  }

  handleHeaderInfo = {
    default: () => {
      return {};
    },
    category: () => {
      const { searchByFilter: that } = this.root;

      if (that.defaultBody.categoryIds.length > 0) {
        const categoryId = parseInt(
          that.defaultBody.categoryIds[that.defaultBody.categoryIds.length - 1]
        );
        const stack = toJS(that.unfungibleCategories);
        while (stack.length > 0) {
          const curr = stack.pop();
          if (curr.id === categoryId) {
            const { id, title, children, parent } = curr;
            return {
              title,
              category: {
                id,
                children,
                parent,
              },
            };
          }
          if (curr.children) {
            curr.children.forEach((item) => (item.parent = curr));
            stack.push.apply(stack, curr.children);
          }
        }
      }

      return {};
    },
    brand: () => {
      const { searchByFilter: that } = this.root;

      if (that.defaultBody.brandIds.length > 0) {
        const brandId = parseInt(
          that.defaultBody.brandIds[that.defaultBody.brandIds.length - 1]
        );
        for (let i = 0; i < that.unfungibleBrands.length; ++i) {
          if (brandId === that.unfungibleBrands[i].id) {
            return { title: that.unfungibleBrands[i].nameEn };
          }
        }
      }

      return {};
    },
    condition: () => {
      const { searchByFilter: that } = this.root;
      const title = searchConditionMap.get(that.defaultBody.searchCondition);
      return { title };
    },
  };

  /**
   * actions
   */
  @action pushState = (state, replace = false) => {
    if (this.handlePushState[this.type]) {
      this.handlePushState[this.type](state, replace);
    } else {
      this.handlePushState.default(state, replace);
    }
  };
  handlePushState = {
    default: (state, replace) => {
      const { query } = state;
      const queryString = qs.stringify(query);
      if (replace) {
        window.history.replaceState(state, '', `?${queryString}`);
      } else {
        window.history.pushState(state, '', `?${queryString}`);
      }
      this.root.searchByFilter.fetchSearchResults(query);
    },
    category: (state, replace) => {
      const { query } = state;
      if (query?.category) {
        if (replace) {
          window.history.replaceState(state, '', `?category=${query.category}`);
        } else {
          window.history.pushState(state, '', `?category=${query.category}`);
        }

        this.root.searchByFilter.initializeSearch(
          { categoryIds: [query.category] },
          undefined,
          false
        );
      }
    },
  };

  @action popState = (e) => {
    const state = e.state;
    if (this.handlePopState[this.type]) {
      this.handlePopState[this.type](state);
    } else {
      this.handlePopState.default(state);
    }
  };
  handlePopState = {
    default: (state) => {},
    category: (state) => {
      const { query } = state;
      if (query?.category) {
        window.history.replaceState(state, '', `?category=${query.category}`);
        this.root.searchByFilter.initializeSearch(
          { categoryIds: [query.category] },
          undefined,
          false
        );
      } else {
        this.handlePopState.default(state);
      }
    },
  };

  /**
   * initialize layout with required information
   * @param {string} type
   */
  @action initialize = ({ pathname, query }) => {
    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    if (this.type !== type) {
      this.type = type;
      this.headerFlags = headerFlags;
    }
  };
}

export function getLayoutInfo({ pathname, query }) {
  let [path, subpath] = pathname.split('/').slice(1);
  if (!path) {
    path = 'home';
  }

  const { category, brand, keyword, condition } = query;
  if (path === 'search') {
    if (condition) {
      subpath = 'condition';
    } else if (keyword) {
      subpath = 'keyword';
    } else if (brand) {
      subpath = 'brand';
    } else if (category) {
      subpath = 'category';
    }
  }

  let type = LAYOUT_TYPE[path] || 'default';
  if (typeof type === 'object') {
    type = LAYOUT_TYPE[path][subpath] || LAYOUT_TYPE[path].default;
  }

  return layouts[type];
}

export default LayoutStore;
