import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'lib/isServer';
import moment from 'moment';
import { dateFormat } from 'constant/date';
import dateArrayToString from 'lib/array/dateArrayToString';

/**
 * 내 주문 목록
 */
export default class OrderDetailStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable data = {}; // 주문 상세
  @observable receiptUrl = ''; // 영수증 주소

  @computed get orderList() {
    return Array.isArray(this.data.orderList) ? this.data.orderList : [];
  }

  @computed get firstItemOfOrders() {
    return Array.isArray(this.data.orderList) && this.data.orderList.length > 0
      ? this.data.orderList[0]
      : null;
  }
  /**
   * 주문 날짜. 목록에서 첫번째 항목의 날짜를 사용한다.
   */
  @computed get orderDate() {
    if (this.firstItemOfOrders) {
      const dateString = dateArrayToString(this.firstItemOfOrders.orderDate);

      return moment(dateString).format(dateFormat.YYYYMMDD);
    } else {
      return '-';
    }
  }

  // 완전한 주소가 되도록 데이터를 조합해서 보여준다
  @computed get addressInView() {
    if (this.data.shippingAddress) {
      const { zipcode, roadAddress, addressDetail } = this.data.shippingAddress;
      // addressBasic = 지번 주소
      return `${zipcode} ${roadAddress} ${addressDetail}`; // 우편번호, 도로명주소, 상세주소
    } else {
      return '';
    }
  }

  /**
   * 주문 상세 조회
   */
  @action
  getOrderComplete = async purchaseId => {
    try {
      const { data: orderResData } = await API.order.get(
        `/order/order-complete/${purchaseId}`
      );
      this.data = orderResData.data;

      const { data: receitResData } = await API.order.get(`/receiptUrlSearch`, {
        params: {
          tid: this.data.pgTid,
        },
      });

      this.receiptUrl = receitResData.data;
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 영수증 주소 가져오기
   * @param tid ex) StdpayCARDguhadatest20190524185023438796
   */
  @action
  getReceitUrl = (tid = '') => {
    API.order.get(`/receiptUrlSearch`, { params: { tid } });
  };
}
