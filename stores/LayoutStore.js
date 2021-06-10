import { isBrowser } from 'childs/lib/common/isServer';
import { observable, computed, action, toJS } from 'mobx';
import { router } from 'next/router';

/**
 * enums
 */
export const LAYOUT_TYPE = {
  DEFAULT: 'default',
  SEARCH: 'search',
};

class LayoutStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  /**
   * statics
   */
  static types = {
    default: {
      headerFlags: {
        logo: true,
        title: false,
        back: false,
        home: false,
        category: false,
        filter: false,
        fixed: false,
        plugins: {
          top: true,
          kakao: true,
          recent: true,
        },
      },
    },
    search: {
      headerFlags: {
        logo: false,
        title: true,
        back: true,
        home: false,
        category: true,
        filter: true,
        fixed: false,
        plugins: {
          top: true,
          kakao: true,
          recent: true,
        },
      },
    },
  };

  /**
   * observables
   */
  @observable type = LAYOUT_TYPE.DEFAULT;

  @observable headerFlags = LayoutStore.types.default.headerFlags;

  layoutHistory = ['/'];

  /**
   * computeds
   */
  /** @type {{title: string, category: object}} header info getter (depth-first-search) */
  @computed get headerInfo() {
    if (isBrowser && this.type === 'search') {
      const { searchByFilter: that } = this.root;

      if (that.defaultBody.categoryIds.length > 0) {
        const categoryId = parseInt(
          that.defaultBody.categoryIds[that.defaultBody.categoryIds.length - 1]
        );
        const stack = toJS(that.unfungibleCategories);
        let siblings = [stack[0]];
        let parentId;
        while (stack.length > 0) {
          const { id, title, children } = stack.pop();
          if (id === categoryId) {
            return {
              title,
              category: {
                id,
                parentId,
                siblings,
                children,
              },
            };
          }
          if (children) {
            siblings = children;
            parentId = id;
            stack.push.apply(stack, children);
          }
        }
      }
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
    }
    return {};
  }

  /** @type {number} */
  @computed get recentCount() {
    if (isBrowser) {
      return this.root.mypageRecentlySeen.list.length;
    }
    return 0;
  }

  /**
   * actions
   */
  /**
   * push current path to layout history array
   * @param {string} path
   */
  @action pushHistory = () => {
    const fullPath =
      window && window.location.pathname + window.location.search;
    if (fullPath) {
      if (this.layoutHistory.length > 10) {
        this.layoutHistory = ['/', ...this.layoutHistory.slice(5), fullPath];
      } else {
        this.layoutHistory.push(fullPath);
      }
    }
    return this.layoutHistory;
  };

  /**
   * initialize layout with required information
   * @param {string} type
   */
  @action initialize = (type = 'default') => {
    const { headerFlags } = LayoutStore.types[type];
    this.type = type;
    this.headerFlags = headerFlags;
    this.pushHistory();
  };
}

export default LayoutStore;
