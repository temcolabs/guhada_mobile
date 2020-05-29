import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import moment from 'moment';
import openPopupCenter from 'childs/lib/common/openPopupCenter';
import { dateFormat } from 'childs/lib/constant/date';
import orderService from 'childs/lib/API/order/orderService';
import { devLog } from 'childs/lib/common/devLog';
/**
 * 주문 데이터
 */
export default class OrderCompleteDetailStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable data = {}; // purhcaseId 기반 주문 완료 정보. 결제 정보, orderList 포함
  @observable receiptUrl = ''; // 영수증 주소
  
  // 주문 완료 데이터에는 상품 목록(orderProdGroup)이 있음.
  @computed get orderList() {
    return this.data.orderList || [];
  }

  /**
   * 주문 안에는 복수의 orderProdGroup(상품)이 있다. 그 중에서 하나 지정
   * 취소 ・ 교환 ・ 반품을 할 때 사용한다
   */
  @observable orderProdGroupId = null;

  @action setOrderProdGroupId = id => {
    this.orderProdGroupId = parseInt(id, 10); // 숫자로 저장
  };

  /**
   * 1개의 주문에서 개별 상품 데이터. orderProdGroupId로 구분한다
   */
  @computed get orderProdGroup() {
    return (
      this.orderList.find(
        order => order.orderProdGroupId === this.orderProdGroupId
      ) || {}
    );
  }

  /**
   * orderProdGroup이 가지고 있는 deal 아이디
   */
  @computed get orderProdGroupDealId() {
    return this.orderProdGroup?.dealId;
  }

  @computed get firstItemOfOrders() {
    return this.orderList?.length > 0 ? this.orderList[0] : null;
  }

  /**
   * 포맷된 주문 날짜. 목록에서 첫번째 항목의 날짜를 사용한다.
   */
  @computed get orderDateWithFormat() {
    return !!this.firstItemOfOrders
      ? moment(this.firstItemOfOrders?.orderTimestamp).format(
          dateFormat.YYYYMMDD_UI
        )
      : '-';
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
      // 주문 완료 데이터 가져오기
      const { data } = await orderService.getOrderComplete({ purchaseId });

      this.data = data.data;
      let pgKind = this.pgKind = data.data.payment.pgKind;      
      this.receiptUrl = await this.getReceitUrl(data.data?.pgTid, pgKind);
      
      devLog(this.data, 'getOrderComplete');
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 주문 완료 데이터 내에서 orderProdGroupId 에 매칭되는 항목을 가져온다.
   */
  getOrderItemByGroupId = orderProdGroupId => {
    return this.orderList.find(
      orderListItem => orderListItem.orderProdGroupId === orderProdGroupId
    );
  };

  /**
   * 영수증 주소 가져오기
   * @param pgTid ex) StdpayCARDguhadatest20190524185023438796
   */
  @action
  getReceitUrl = async (pgTid = '', pgKind) => {
    try {
      const { data } = await API.order.get(`/receiptAllUrlSearch`, {
        params: { tid: pgTid, pgKind: pgKind },
      });

      return data.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  /**
   * 영수증 팝업 열기
   */
  openReceiptPopup = (receiptUrl) => {
    if (!!receiptUrl) {
      openPopupCenter(receiptUrl, 'receit', 420, 540);
    } else {
      this.root.alert.showAlert('영수증 조회 주소를 찾을 수 없습니다.');
    }
  };
}
