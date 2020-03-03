import { observable, action, computed } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import isFunction from 'childs/lib/common/isFunction';
import {
  ALL_CATEGORY_ID,
  POPULAR_CATEGORY_ID,
} from 'components/community/list/useBBSSearchState';

/**
 * 게시판 카테고리 관리
 *
 * * 커뮤니티(게시판 묶음)는 카테고리(게시판) 목록을 포함하고 있다.
 */
export default class CategoryStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  // 카테고리 데이터를 모두 가져온 후 실행할 작업 목록
  @observable categoryJobStack = [];

  /**
   * 카테고리를 가져온 후에 실행하도록 보장할 job을 등록한다
   */
  @action
  pushJobForCategory = (job = () => {}) => {
    if (isFunction(job)) {
      if (this.hasCategoryData) {
        job();
      } else {
        this.categoryJobStack.push(job);
      }
    }
  };

  /**
   * 게시판의 상위 카테고리에 해당한다
   * communityPropType[]
   */
  @observable
  communities = [];

  /**
   * 모든 키테고리 데이터
   */
  @observable
  allCategories = [];

  // 카테고리 데이터를 가져왔는지
  @computed
  get hasCategoryData() {
    return this.allCategories.length > 0;
  }

  // 기본 카테고리
  @computed
  get defaultCategoryId() {
    return this.allCategories.length > 0 ? this.allCategories[0].id : null;
  }

  @computed
  get allCategoryOptions() {
    return this.allCategories.map(category => ({
      label: category.name,
      value: category.id,
    }));
  }

  @observable
  categoriesByCommunity = []; // array of [{ community, categories }]

  @action
  getCommunities = async () => {
    // 커뮤니티와 카테고리는 함께 가져온다. 이미 데이터를 가져왔으면 진행하지 않는다.
    if (this.hasCategoryData) {
      return;
    }

    try {
      // ! 페이지네이션 가능한 데이터지만 현재 상위 카테고리가가 2개여서 무시하고 개발 진행
      const { data } = await API.bbs.get(`/community`);
      const communities = data.data.content;

      this.communities = communities;
      this.getCategories(communities);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 커뮤니티 - 카테고리 상하관계.
   */
  @action
  getCategories = async (communities = []) => {
    try {
      let categories = [];
      const communityIds = communities.map(c => c.id);

      // 커뮤니티별 카테고리 데이터를 가져온다
      for (const communityId of communityIds) {
        const { data } = await API.bbs.get(`/category`, {
          params: {
            communityId,
          },
        });

        categories = categories.concat(data.data.content);
      }

      // 모든 카테고리
      this.allCategories = categories;

      // 커뮤니티 아이디로 카테고리를 가져올 수 있도록 데이터를 병합
      this.categoriesByCommunity = communities.map(community => {
        return {
          community,
          categories: categories.filter(
            category => category.communityId === community.id
          ),
        };
      });

      // 커뮤니티 데이터를 가져온 후에 실행할 작업들 진행
      while (this.categoryJobStack.length > 0) {
        const job = this.categoryJobStack.pop();
        job();
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 카테고리 이름 가져오기
   */
  getCategoryById = (categoryId = 0) => {
    if (this.allCategories.length > 0) {
      switch (categoryId) {
        // TODO: 전체글, 인기글의 검색을 위한 categoryId 확인 필요
        case ALL_CATEGORY_ID:
          return { name: '전체글' };

        case POPULAR_CATEGORY_ID:
          return { name: '인기글' };

        default:
          const target =
            this.allCategories.find(c => c.id === parseInt(categoryId)) || {};
          return target;
      }
    } else {
      return {};
    }
  };
}
