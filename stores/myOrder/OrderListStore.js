import { observable, action, computed, toJS } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/isServer';
import moment from 'moment';
import { dateFormat } from 'constant/date';
import purchaseStatus from 'constant/purchaseStatus';

/**
 * 내 주문 목록
 *
 * 주문 완료 목록,
 * 주문 취소 목록을 함께 관리한다.
 *
 */
export default class OrderListStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }

    // 기본 기간
    this.defaultPeriod = {
      startDate: moment()
        .subtract(7, 'days')
        .format(dateFormat.YYYYMMDD),
      endDate: moment().format(dateFormat.YYYYMMDD),
    };
  }

  // 나의 주문 상태
  @observable
  myOrderStatus = {
    deliveryComplete: 0,
    paymentComplete: 0,
    prepareProduct: 0,
    sending: 0,
    waitingPayment: 0,
  };

  // 주문 취소, 교환, 반품 상태
  @observable
  myCancelOrderStatus = {
    cancelOrder: 0,
    exchangeOrder: 0,
    returnOrder: 0,
  };

  // 나의 주문리스트
  @observable
  orderItemList = [];

  // 주문 취소 리스트
  @observable
  orderCancelItemList = [];

  // 조회 기간
  @observable
  period = toJS(this.defaultPeriod);

  // 페이지
  @observable
  page = 1;

  @observable
  totalPage = 1;

  @observable
  itemsCountPerPage = 10;

  @observable
  isLoadingList = false; // 목록 비동기 호출 과정 중인지

  @action initPeriod = () => {
    this.period = toJS(this.defaultPeriod);
  };

  @action
  getMyOrderStatus = async params => {
    try {
      const { data } = await API.order.get(`/order/my-orders-status`, {
        params,
      });
      this.myOrderStatus = data.data;
    } catch (e) {
      console.error('/order/my-orders-status', e);
    }
  };

  @action
  getMyCancelOrderStatus = async (params = {}) => {
    try {
      const { data } = await API.order.get(
        `/order/my-cancel-orders-status/${this.period.startDate}/${
          this.period.endDate
        }`
      );

      this.myCancelOrderStatus = data.data;
    } catch (e) {
      console.error('/order/my-orders-status', e);
    }
  };

  @action
  getMyOrders = async ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
    pageNo = this.page,
  } = {}) => {
    this.period = {
      startDate,
      endDate,
    };

    this.page = pageNo;

    this.isLoadingList = true;

    try {
      const { data } = await API.order.get(
        `/order/my-orders/${startDate}/${endDate}/${pageNo}`
      );

      const result = data.data;

      const { orderItemList, page, totalPage } = result;

      this.orderItemList = orderItemList;
      this.page = page;
      this.totalPage = totalPage;
    } catch (e) {
      // this.root.alert.showAlert({ content: '목록을 불러오지 못했습니다.' });
      console.error(e);
    } finally {
      this.isLoadingList = false;
    }
  };

  /**
   * 주문 취소 목록
   *
   * TODO: getMyOrders 메소드를 그대로 사용하고 있음.
   * 취소 항목만 가져오도록 수정 필요. API 확인
   */
  getMyCancelOrders = async ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
    pageNo = this.page,
  } = {}) => {
    this.period = {
      startDate,
      endDate,
    };

    this.page = pageNo;

    try {
      const { data } = await API.order.get(
        `/order/my-orders/${startDate}/${endDate}/${pageNo}` // FIXME:
      );

      const result = data.data;

      const { orderItemList, page, totalPage } = result;

      this.orderCancelItemList = orderItemList; // FIXME:
      this.page = page;
      this.totalPage = totalPage;
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 조회 기간 변경
   */
  changePeriod = ({ startDate, endDate }) => {
    this.startDate = startDate;
    this.endDate = endDate;
  };

  getOrderActions = () => {};
}
