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
import { getCategoryKey, getCategoryTitle } from 'utils';
import isTruthy from 'childs/lib/common/isTruthy';
import addCommaToArray from 'childs/lib/string/addCommaToArray';

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
  @observable brands;

  @observable productCondition = 'ANY';
  @observable shippingCondition = 'ANY';
  @observable category;
  @observable brand;
  @observable filter;
  @observable subcategory;
  @observable enter;
  @observable keyword;
  @observable resultKeyword;
  @observable condition;
  @observable filtered;
  @observable minPrice;
  @observable maxPrice;
  @observable checkedKeys = [];
  @observable checkedKeysId = [];

  @observable itemStatus = false;
  @action
  getSellerId = () => {
    API.user
      .get(`users/nickname/${this.nickname}`)
      .then(res => {
        let data = res.data;
        this.sellerId = data.data.id;

        this.getSellerStore();
        const { searchitem } = this.root;
        const query = Router.router.query;

        searchitem.deals = [];
        searchitem.preUrl = Router.asPath;
        searchitem.initDealspage();
        if (query.filtered === 'false') searchitem.initSearchFilterList();

        let brand = JSON.parse('[' + query.brand + ']');
        let subcategory = JSON.parse('[' + query.subcategory + ']');

        searchitem.getSearchByUri(
          brand,
          query.category,
          query.page,
          query.unitPerPage,
          query.order,
          query.filter,
          subcategory,
          query.enter,
          query.keyword,
          query.resultKeyword,
          query.condition,
          query.productCondition,
          query.shippingCondition,
          query.minPrice,
          query.maxPrice,
          this.sellerId
        );

        // this.root.searchitem.getSearchByUri();
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
      let categoryList = [];

      let brandList = [];
      if (this.brand) {
        if (this.brand.length > 0 && this.brand[0] != null) {
          this.brand.map(brand => {
            if (brand.id) brandList.push(brand.id);
            else brandList.push(brand);
          });
        }
      }

      if (this.subcategory[0] != null) {
        categoryList = [];
        categoryList = JSON.parse('[' + this.subcategory + ']');

        this.checkedKeys = [];
        this.checkedKeysId = [];

        categoryList.map(category => {
          this.checkedKeys.push(
            getCategoryKey(this.treeDataForFilter, category)
          );
          this.checkedKeysId.push(category);
        });
      } else {
        categoryList.push(this.categoryIds);
      }

      let filterList = [];

      if (!this.filter) {
        this.filter = '';
      }

      let filterCount = JSON.parse('[' + this.filter + ']');

      if (Array.isArray(toJS(filterCount))) {
        filterCount.map(filter => {
          filterList.push({ filterAttributeId: filter });
        });
      }

      let searchResultKeyword = [];
      if (isTruthy(this.keyword)) searchResultKeyword.push(this.keyword);
      if (isTruthy(this.resultKeyword))
        searchResultKeyword.push(this.resultKeyword);

      API.search
        .post(
          `/ps/search/filter?page=${this.page}&unitPerPage=${
            this.unitPerPage
          }&order=${this.order}`,
          {
            searchResultOrder:
              this.order === null || this.order === '' ? 'DATE' : this.order,
            sellerIds: [sellerId],
            brandIds: brandList,
            categoryIds: categoryList,
            filters: filterList,
            searchQueries: searchResultKeyword,
            searchCondition: this.condition === '' ? null : this.condition,
            productCondition: this.productCondition,
            shippingCondition: this.shippingCondition,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
          }
        )
        .then(res => {
          let data = res.data;
          if (this.page === 1) {
            this.dealsOfSellerStore = data.data.deals;
          } else {
            this.setSellerStoreItem(data.data.deals);
          }
          this.brands = data.data.brands;
          this.countOfDeals = data.data.countOfDeals;
          this.filterData = data.data.filterData;
          this.itemStatus = true;
        });
    });
  };

  @action
  initFilter = () => {
    this.filterBrand = [];
    this.filterData.map((data, dataKey) => {
      return data.attributes.map((attributes, attributesKey) => {
        if (
          !_.isNil(this.filterData[dataKey].attributes[attributesKey].filter)
        ) {
          this.filterData[dataKey].attributes[attributesKey].filter = false;
        }
      });
    });

    let query = Router.router.query;
    this.productCondition = query.productCondition;
    this.shippingCondition = query.shippingCondition;
    this.minPrice = '';
    this.maxPrice = '';
    this.resultKeyword = '';
  };

  @action
  clearFilter = () => {
    this.initFilter();
    this.toSearch({ resultKeyword: ' ' });
  };
  @action
  searchFilter = () => {
    let brandList = [];
    let filterList = [];
    let category;
    let subCategoryList = [];

    let brandListTitle = [];
    let filterListTitle = [];
    let categoryListTitle = [];
    let subCategoryListTitle = [];

    let query = Router.router.query;

    if (Number(this.minPrice) > Number(this.maxPrice)) {
      this.root.alert.showAlert('최대 가격은 최소 가격보다 커야 합니다.');
      return false;
    }

    // filter list push
    if (Array.isArray(toJS(this.filterData))) {
      this.filterData.map(filter => {
        filter.attributes.map(attr => {
          if (attr.filter) {
            filterList.push(attr.id);
            filterListTitle.push(attr);
          }
        });
      });
    }

    if (query.enter === 'brand') {
      brandList.push(query.brand.split(',')[0]);
    }

    // brand list push
    if (Array.isArray(toJS(this.filterBrand))) {
      this.filterBrand.map(brand => {
        brandList.push(brand.id);
        brandListTitle.push(brand);
      });
    }

    // subcategory list push
    if (Array.isArray(toJS(this.checkedKeysId))) {
      this.checkedKeysId.map(subcategory => {
        subCategoryListTitle.push({
          title: getCategoryTitle(this.locationFilter, subcategory),
          id: subcategory,
        });
      });
    }

    this.searchFilterList['brand'] = brandListTitle;
    this.searchFilterList['filter'] = filterListTitle;

    categoryListTitle.push({
      title: isTruthy(this.selectCategory)
        ? getCategoryTitle(this.locationFilter, toJS(this.selectCategory.id))
        : getCategoryTitle(this.locationFilter, query.category),
      id: isTruthy(this.selectCategory)
        ? toJS(this.selectCategory.id)
        : query.category,
    });
    this.searchFilterList['category'] = categoryListTitle;
    this.searchFilterList['subcategory'] = subCategoryListTitle;

    brandList = addCommaToArray(brandList);
    filterList = addCommaToArray(filterList);
    subCategoryList = addCommaToArray(this.checkedKeysId);
    category = isTruthy(this.selectCategory)
      ? toJS(this.selectCategory.id)
      : query.category;

    this.toSearch({
      category: category,
      brand: brandList,
      filter: filterList,
      subcategory: subCategoryList,
      keyword: query.keyword,
      resultKeyword: this.resultKeyword,
      filtered: true,
      productCondition: this.productCondition,
      shippingCondition: this.shippingCondition,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
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
    this.category = category;
    this.brand = brand;
    this.filter = filter;
    this.subcategory = subcategory;
    this.enter = enter;
    this.keyword = keyword;
    this.resultKeyword = resultKeyword;
    this.condition = condition;
    this.filtered = filtered;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
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
