import { observable, action, computed, toJS } from 'mobx';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import bookmarkTarget from 'childs/lib/constant/user/bookmarkTarget';
import { isBrowser } from 'childs/lib/common/isServer';
import _ from 'lodash';
import { loginStatus } from 'childs/lib/constant';
import { pushRoute } from 'childs/lib/router';
import qs from 'qs';
import Router from 'next/router';

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
  @observable nickname;
  @observable sellerId;
  @observable filterData;

  @observable productCondition = 'ANY';
  @observable shippingCondition = 'ANY';

  @action
  getSellerId = () => {
    API.user
      .get(`users/nickname/${this.nickname}`)
      .then(res => {
        let data = res.data;
        this.sellerId = data.data.id;

        this.getSellerStore();
        this.getSellerStoreDeal(this.sellerId);

        if (this.root.login.loginStatus === loginStatus.LOGIN_DONE)
          this.getFollowSellerStore(this.sellerId);
      })
      .catch(e => {
        console.log(e);
      });
  };

  @action
  getSellerStore = () => {
    API.user
      .get(`sellers/${this.sellerId}/store`)
      .then(res => {
        let data = res.data;
        this.sellerStore = data.data;
      })
      .catch(e => {
        devLog('getSellerStore', e);
      });
  };

  @action
  getInitSellerStoreItem = () => {
    this.page = 1;
  };

  @action
  getSellerStoreDeal = sellerId => {
    // 일반적인 카테고리 검색을 위해서 전체 카테고리 값을 불러오기 위한 api 콜
    API.search.get('/ps/search/all').then(async res => {
      API.search
        .post(
          `/ps/search/filter?page=${this.page}&unitPerPage=${
            this.unitPerPage
          }&order=${this.order}`,
          {
            searchResultOrder:
              this.order === null || this.order === '' ? 'DATE' : this.order,
            sellerIds: [sellerId],
          }
        )
        .then(res => {
          let data = res.data;
          if (this.page === 1) {
            this.dealsOfSellerStore = data.data.deals;
          } else {
            this.setSellerStoreItem(data.data.deals);
          }

          this.countOfDeals = data.data.countOfDeals;
          this.filterData = data.data.filterData;
        });
    });
  };

  @action
  toSearch = ({
    category = '',
    brand = '',
    page = 1,
    unitPerPage = 20,
    order = this.order,
    filter = '',
    subcategory = '',
    enter = '',
    keyword = '',
    resultKeyword = '',
    condition = '',
    filtered = false,
    productCondition = 'ANY',
    shippingCondition = 'ANY',
    minPrice = '',
    maxPrice = '',
  }) => {
    let query = Router.router.query;
    this.productCondition = productCondition;
    this.shippingCondition = shippingCondition;

    pushRoute(
      `/store/${this.nickname}?${qs.stringify({
        category: category,
        brand: brand,
        page: page,
        unitPerPage: unitPerPage,
        order: order === null || order === '' ? 'DATE' : order,
        filter: filter,
        subcategory: subcategory,
        enter: enter === '' ? query.enter : enter,
        keyword: keyword,
        resultKeyword: resultKeyword,
        condition: condition === '' ? query.condition : condition,
        filtered: filtered,
        productCondition: this.productCondition,
        shippingCondition: this.shippingCondition,
        minPrice: minPrice,
        maxPrice: maxPrice,
      })}`
    );
    if (this.preUrl !== Router.asPath) this.deals = [];
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
          i => i.targetId.toString() === id.toString()
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
        this.getSellerStore();
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
        this.getSellerStore();
      })
      .catch(e => {
        let resultCode = _.get(e, 'data.resultCode');
        let message = _.get(e, 'data.message');
        if (resultCode === 6017) this.root.alert.showAlert(message);
      });
  };
}
