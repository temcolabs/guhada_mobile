import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { devLog } from 'childs/lib/common/devLog';
import Router from 'next/router';
import { pushRoute } from 'childs/lib/router';
import qs from 'qs';

export default class SpecialStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    // 이벤트 상세 데이터
    if (initialState.special?.specialDetail) {
      this.specialDetail = initialState.special?.specialDetail;
    }
  }

  @observable specialList = [];
  @observable specialDetail = [];
  @observable eventId;
  @observable status = {
    page: false,
    firstPurchasePopupIsOpen: false,
  };
  @observable id = '';
  @observable scrollPosition;
  @observable infinityStauts = true;
  @observable scrollDirection;
  @observable unitPerPage = 24;
  @observable order = 'DATE';
  @observable productCondition = 'ANY';
  @observable shippingCondition = 'ANY';
  @action
  getSpecialList = (value) => {
    if (!value?.value) {
      API.settle
        .get(`/plan/list?eventProgress=PROGRESS`)
        .then((res) => {
          this.specialListMain = res.data.data;
          this.specialList = res.data.data;
          this.status.page = true;
          devLog(toJS(this.specialList), 'special list');
        })
        .catch((err) => {
          console.error(err, 'special list get error');
          this.specialList = [];
        });
    } else {
      API.settle
        .get(`/plan/list?eventProgress=${value.value}`)
        .then((res) => {
          this.specialList = [...res.data.data];
          this.status.page = true;
          devLog(toJS(this.specialList), 'special list');
        })
        .catch((err) => {
          console.error(err, 'special list get error');
          this.specialList = [];
        });
    }
  };

  @action
  getSpecialDetail = ({ id, page = 1, order = this.order }) => {
    this.id = id;
    API.settle
      .get(`/plan/list/detail?`, {
        params: {
          eventId: id,
          page: page,
          searchProgress: order,
        },
      })
      .then((res) => {
        this.specialDetail = res.data.data;

        devLog(toJS(this.specialDetail), 'special detail');

        // else {
        //   this.root.alert.showConfirm({
        //     content: '존재하지 않는 기획전 입니다.',
        //     confirmText: '확인',
        //     onConfirm: () => {
        //       Router.push('/');
        //     },
        //     onCancel: () => {
        //       Router.push('/');
        //     },
        //   });
        // }
      })
      .catch((err) => {
        console.error(err, 'special detail get error');
        this.specialDetail = [];
      });
  };

  @action
  toSearch = ({
    category = '',
    brand = '',
    page = 1,
    unitPerPage = this.unitPerPage,
    order = this.order,
    filter = '',
    subcategory = '',
    enter = '',
    keyword = '',
    resultKeyword = '',
    condition = '',
    productCondition = 'ANY',
    shippingCondition = 'ANY',
    minPrice = '',
    maxPrice = '',
    eventIds = '',
  }) => {
    let query = Router.router.query;

    pushRoute(
      `/event/special/${eventIds}`
      // `/event/special/${eventIds}?${qs.stringify({
      //   category: category,
      //   brand: brand,
      //   page: page,
      //   unitPerPage: unitPerPage,
      //   order: order === null || order === '' ? 'DATE' : order,
      //   filter: filter,
      //   subcategory: subcategory,
      //   enter: 'store',
      //   keyword: keyword,
      //   resultKeyword: resultKeyword,
      //   condition: condition === '' ? query.condition : condition,
      //   productCondition: this.productCondition,
      //   shippingCondition: this.shippingCondition,
      //   minPrice: minPrice,
      //   maxPrice: maxPrice,
      // })}`
    );
    if (this.preUrl !== Router.asPath) this.deals = [];
  };

  @action
  getSpecialDeal = () => {
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
      '',
      this.eventId
    );
  };

  // @action
  // listenToScroll = () => {
  //   const winScroll =
  //     document.body.scrollTop || document.documentElement.scrollTop;

  //   const height =
  //     document.documentElement.scrollHeight -
  //     document.documentElement.clientHeight;

  //   const scrolled = winScroll / height;
  //   // 스트롤의 방향을 확인
  //   if (this.scrollPosition > scrolled) {
  //     return false;
  //   }
  //   this.scrollPosition = scrolled;

  //   if (this.scrollPosition > 0.7 && this.infinityStauts === true) {
  //     this.infinityStauts = false;
  //     this.page += 1;

  //     this.getSpecialDetail({ id: this.id, page: this.page });
  //   }
  // };
}
