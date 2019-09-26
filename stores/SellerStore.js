import { observable, action, computed, toJS } from 'mobx';
import API from 'lib/API';
import { devLog } from 'lib/devLog';
import bookmarkTarget from 'constant/user/bookmarkTarget';
import { isBrowser } from 'lib/isServer';
import _ from 'lodash';

export default class SellerStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }
  // 셀러 정보
  @observable seller = {};

  @action getSellerDetail = (sellerId = -1) => {
    API.user.get(`/sellers/${sellerId}`).then(res => {
      const { data } = res;
      this.seller = data.data;
    });
  };

  // 출고지 배송지 정보
  @observable shipmentInfo = {};

  /**
   * sellerId 와 departureOrReturnId 로 출고, 반품지 정보 가져오기
   * http://dev.user.guhada.com/swagger-ui.html#/seller-controller/getDepartureOrReturnUsingGET
   */
  @action getShipmentInfo = ({ sellerId, departureOrReturnId }) => {
    API.user.get(
      `/sellers/${sellerId}/departures-and-returns/${departureOrReturnId}`
    );
  };

  @observable sellerStore;
  @observable dealsOfSellerStore = [];
  @observable countOfDeals;
  @observable page = 1;
  @observable unitPerPage = 14;
  @observable order = 'DATE';
  @observable sellerStoreFollow = [];
  @observable storeFollowBool = false;
  @action
  getSellerStore = sellerId => {
    API.user
      .get(`sellers/${sellerId}/store`)
      .then(res => {
        let data = res.data;
        this.sellerStore = data.data;
      })
      .catch(e => {
        devLog('getSellerStore', e);
      });
  };

  @action
  getSellerStoreDeal = sellerId => {
    API.search
      .get(
        `/ps/search/seller/${sellerId}?page=${this.page}&unitPerPage=${
          this.unitPerPage
        }&order=${this.order}`
      )
      .then(res => {
        let data = res.data;
        // this.dealsOfSellerStore = data.data.deals;
        this.setSellerStoreItem(data.data.deals);
        this.countOfDeals = data.data.countOfDeals;
      });
  };

  @action
  setSellerStoreItem = item => {
    let newDeals = this.dealsOfSellerStore;

    this.dealsOfSellerStore = newDeals.concat(item);
  };

  @action
  getFollowSellerStore = id => {
    const userId = this.root.login.loginInfo.userId;
    API.user
      .get(`/users/${userId}/bookmarks`, {
        params: {
          target: bookmarkTarget.SELLER,
        },
      })
      .then(res => {
        this.sellerStoreFollow = res.data.data.content;

        let checkFollow = this.sellerStoreFollow.findIndex(
          i => i.targetId.toString() === id
        );
        if (checkFollow === -1) {
          this.storeFollowBool = false;
        } else {
          this.storeFollowBool = true;
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  @action
  setFollowSellerStore = id => {
    API.user
      .post(`/users/bookmarks`, {
        target: bookmarkTarget.SELLER,
        targetId: id,
      })
      .then(res => {
        this.getFollowSellerStore(id);
      })
      .catch(e => {
        let resultCode = _.get(e, 'data.resultCode');
        let message = _.get(e, 'data.message');
        if (resultCode === 6017) this.root.alert.showAlert(message);
      });
  };

  @action
  delFollowSellerStore = id => {
    API.user
      .delete(`/users/bookmarks`, {
        params: {
          target: bookmarkTarget.SELLER,
          targetId: id,
        },
      })
      .then(res => {
        this.getFollowSellerStore(id);
      })
      .catch(e => {
        let resultCode = _.get(e, 'data.resultCode');
        let message = _.get(e, 'data.message');
        if (resultCode === 6017) this.root.alert.showAlert(message);
      });
  };
}
