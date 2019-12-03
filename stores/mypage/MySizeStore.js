import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { devLog } from 'childs/lib/common/devLog';
/**
 * 내 사이즈 관리
 */
export default class MySizeStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable mySize;

  @computed get isMySizeRegistered() {
    return !_.isNil(this.mySize);
  }

  @action
  getMySize = async () => {
    try {
      const { data } = await API.user.get(`/users/user-size`);
      this.mySize = data.data;
    } catch (e) {
      console.error(e);
    }
  };

  resetMySize = () => {
    this.mySize = undefined;
  };

  submitMySize = ({ mySize } = {}) => {
    devLog('submitMySize', mySize);
    console.log(`this.isMySizeRegistered`, this.isMySizeRegistered);

    if (this.isMySizeRegistered) {
      this.updateMySize({
        mySize,
      });
    } else {
      this.createMySize({
        mySize,
      });
    }
  };

  createMySize = async ({
    mySize = {
      bottom: 0,
      height: 0,
      shoe: 0,
      top: '',
      weight: 0,
    },
  }) => {
    try {
      const { data } = await API.user.post(`/users/user-size`, mySize);

      // 사이즈 최초 등록시 포인트가 지급된다
      const {
        savedPoint,
        dueSavedPoint,
        totalFreePoint,
        totalPaidPoint,
        saveTargetType,
        message,
      } = data.data;

      const savedPointResponse = {
        dueSavedPoint,
        message,
        saveTargetType,
        savedPoint,
        totalFreePoint,
        totalPaidPoint,
      };

      this.root.mypagePoint.openPointSavingModal(savedPointResponse);

      this.mySize = mySize;
    } catch (e) {
      console.error(e);
      this.root.alert.showAlert('오류가 발생했습니다.');
    }
  };

  /**
   * 내 사이즈 등록 || 수정
   */
  @action
  updateMySize = async ({
    mySize = {
      bottom: 0,
      height: 0,
      shoe: 0,
      top: '',
      weight: 0,
    },
  }) => {
    try {
      await API.user.put(`/users/user-size`, mySize);
      this.root.alert.showAlert(`내 사이즈가 수정되었습니다.`);
      this.mySize = mySize;
    } catch (e) {
      console.error(e);
      this.root.alert.showAlert('오류가 발생했습니다.');
    }
  };
}
