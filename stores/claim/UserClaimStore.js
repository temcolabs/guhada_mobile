import { observable, action, computed, runInAction } from 'mobx';
import userClaimService from 'childs/lib/API/claim/userClaimService';
import { isBrowser } from 'childs/lib/common/isServer';

/**
 * 구하다 문의하기 관련
 */
export default class UserClaimStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable
  userClaimTypes = [];

  @observable
  selectedClaimCategoryCode = null;

  @action
  handleChangeClaimCategory = (code) => {
    this.selectedClaimCategoryCode = code;
  };

  /**
   * select 컴포넌트에서 사용할 타입
   * 싱위 카테고리 선택
   */
  @computed
  get userClaimCategoryOptions() {
    return this.userClaimTypes.map((category) => ({
      label: category.description,
      value: category.code,
    }));
  }

  /**
   * select 컴포넌트에서 사용할 타입
   * 선택한 카테고리의 children 배열에 있는 코드들
   */
  @computed
  get userClaimCodeOptions() {
    return this.userClaimTypes
      .find((category) => category.code === this.selectedClaimCategoryCode)
      ?.children?.map((childType) => ({
        label: childType.description,
        value: childType.code,
      }));
  }

  @action
  getUserClaimTypes = async () => {
    if (this.userClaimTypes?.length === 0) {
      try {
        const types = await userClaimService.getUserClaimTypes();
        this.userClaimTypes = types;
      } catch (e) {
        console.error(e);
      }
    }
  };

  @action
  createUserClaim = ({
    body = {
      title: '',
      content: '',
      imageUrls: [],
      typeCode: null, // 클레임 타입 데이터에서 code
    },
  }) => {
    return userClaimService.createUserClaim({
      userId: this.root.user?.userId,
      body,
    });
  };
}
