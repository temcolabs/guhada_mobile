import { isBrowser } from 'childs/lib/common/isServer';
import { pushRoute } from 'childs/lib/router';
import { observable, computed, action, toJS } from 'mobx';
import { LAYOUT_TYPE, layouts } from './constants';

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
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  /**
   * observables
   */
  @observable type = LAYOUT_TYPE.DEFAULT;

  @observable headerFlags = layouts.default.headerFlags;

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
    if (isBrowser) {
      return this.handleHeaderInfo[this.type]();
    }
    return {};
  }
  handleHeaderInfo = {
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
    keyword: () => {
      return {};
    },
  };

  /**
   * actions
   */
  @action popHistory = () => {
    if (this.handlePopHistory[this.type]) {
      this.handlePopHistory[this.type]();
    } else {
      this.handlePopHistory.default();
    }
  };
  handlePopHistory = {
    default: () => {
      if (isBrowser) {
        if (document.referrer.split('/')[2] !== window.location.host) {
          return pushRoute('/');
        }
        window.history.back();
      }
    },
    category: () => {
      const { category } = this.headerInfo;
      if (category.parent) {
        this.root.searchByFilter.initializeSearch(
          { categoryIds: [category.parent.id] },
          undefined,
          false
        );
      } else {
        this.handlePopHistory.default();
      }
    },
  };

  /**
   * initialize layout with required information
   * @param {string} type
   */
  @action initialize = (type = 'default') => {
    const { headerFlags } = layouts[type];
    this.type = type;
    this.headerFlags = headerFlags;
    this.layoutHistory = [];
  };
}

export default LayoutStore;
