import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import localStorage from 'childs/lib/common/localStorage';
import key from 'constant/key';
import _ from 'lodash';

export default class ProductRecentlySeenStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;

      this.MAX_ITEM = 20;
      this.list = observable([]);

      this.init();
    }
  }

  /**
   * 로컬 스토리지에서 리스트를 가져와 초기화한다
   */
  @action
  init = () => {
    const storageList = this.getListFromStorage();
    this.list = storageList || [];
  };

  @action
  getListFromStorage = () => {
    return localStorage.get(key.PRODUCT_RECENTLY_SEEN);
  };

  /**
   * 최근 본 상품 추가. deals 객체 전체를 그대로 저장.
   * 아이디가 중복이면 추가되지 않는다
   * 최대 개수 제한 있음
   *
   * @param {object} deals 상품 상세정보
   */
  @action
  addItem = (deals = {}) => {
    if (_.isNil(deals.dealsId)) {
      console.error('[addItem] dealsId가 없습니다.');
    } else {
      const isDuplicate =
        this.list.findIndex(item => item.dealsId === deals.dealsId) > -1;

      if (!isDuplicate) {
        const listItem = Object.assign({}, toJS(deals));
        this.list.splice(0, 0, listItem); // 맨 앞부터 추가
        this.list = this.list.slice(0, this.MAX_ITEM); // 최대 개수 조절

        localStorage.set(key.PRODUCT_RECENTLY_SEEN, toJS(this.list));
      }
    }
  };

  /**
   * 목록에서 전달된 아이디에 매칭되는 아이템 삭제
   */
  removeItem = (dealsId = '') => {
    const targetIndex = this.list.findIndex(item => item.dealsId === dealsId);

    if (targetIndex > -1) {
      this.list.splice(targetIndex, 1);
    }
  };
}
