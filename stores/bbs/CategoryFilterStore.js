import { observable, action, computed, reaction } from 'mobx';
import _ from 'lodash';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { devWarn } from 'childs/lib/common/devLog';
import {
  ALL_CATEGORY_ID,
  POPULAR_CATEGORY_ID,
} from 'components/community/list/useBBSSearchState';

/**
 * 게시판 카테고리 관리
 */
export default class CategoryFiterStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable
  communityCategoryId = null;

  // 특정 커뮤니티 카테고리의 필터
  @observable
  categoryFilters = []; //  array of { id: number, name: any, communityCategoryId: number }

  // 옵션 객체 형태로 변경. array of { label: string, value: any }
  @computed
  get categoryFilterOptions() {
    const options = this.categoryFilters.map(filter => ({
      value: filter.id,
      label: filter.name,
      communityCategoryId: filter.communityCategoryId,
    }));

    return options;
  }

  get categoryFiltersWithAllOptions() {
    const options = this.categoryFilterOptions.slice();

    // 카테고리 필터가 있으면 '전체' 옵션을 넣는다
    if (options.length > 0) {
      options.splice(0, 0, {
        value: null,
        label: '전체',
        communityCategoryId: null,
      });
    }
    return options;
  }

  /**
   * 카테고리(게시판)의 필터를 가져온다
   */
  @action
  getCategoryFilters = async communityCategoryId => {
    this.communityCategoryId = communityCategoryId;

    // 커뮤니티(게시판 카테고리) 아이디는 숫자
    if (_.isNumber(communityCategoryId)) {
      try {
        const { data } = await API.bbs.get(`/category/filter`, {
          params: {
            communityCategoryId,
          },
        });

        this.categoryFilters = data.data;
      } catch (e) {
        console.error(e);
        this.categoryFilters = [];
      }
    }
  };

  /**
   * 아이디로 카테고리 필터 가져오기
   */
  getCategoryFilterById = categoryFilterId => {
    const target =
      this.categoryFilters.find(c => c.id === parseInt(categoryFilterId)) || {};
    return target;
  };

  @action
  resetCategoryFilters() {
    this.categoryFilters = [];
  }
}
