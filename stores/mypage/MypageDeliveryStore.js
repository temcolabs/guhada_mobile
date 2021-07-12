import { observable, action } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import { ORDER_COMPLETE_SAMPLE } from 'lib/constant/order/orderModel';

// 상태 진행 표시를 위해 CSS 컨트롤에 사용할 값.
export const statusClassName = {
  PASS: 'pass',
  CURRENT: 'current',
  YET: 'yet',
};

/**
 * 스마트택배(스윗트랙커) 배송정보조회 API doc
 * http://info.sweettracker.co.kr/apidoc
 */
export default class MypageDeliveryStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  // 배송 모달 열림 여부
  @observable
  isDeliveyTrackingModalOpen = false;

  @observable
  isQuickDeliveyTrackingModalOpen = false;

  @observable
  deliveryInfo = {};

  // level은 0 ~ 5 (0은 배송준비)
  shippingStatus = [
    // { label: '배송준비중', level: 1 }, // UI에서 사용안함
    { label: '집하완료', level: 2 },
    { label: '배송중', level: 3 },
    { label: '지점도착', level: 4 },
    { label: '배송출발', level: 5 },
    { label: '배송완료', level: 6 },
  ];

  @action
  getCurrentShippingStatus = (level) => {
    return this.shippingStatus.map((status = {}, statusIndex) => {
      if (level > status.level) {
        return Object.assign(status, { className: statusClassName.PASS });
      } else if (level === status.level) {
        return Object.assign(status, {
          className: statusClassName.CURRENT,
        });
      } else {
        return Object.assign(status, { className: statusClassName.YET });
      }
    });
  };

  /**
   * 배송조회 모달 열기
   * 주문 완료 배송조회, 교환 재배송 조회 모두에서 사용
   */
  @action
  openDeliveryTrackingModal = async ({ order = ORDER_COMPLETE_SAMPLE }) => {
    const isClaim = !!order.orderClaimId; // 교환 재배송이면 클레임 아이디가 있음.
    const companyNo = isClaim ? order.resendShipCompany : order.shipCompany;
    const invoiceNo = isClaim ? order.resendInvoiceNo : order.invoiceNo;
    const shipId = order.shipId;

    if (!!companyNo && !!invoiceNo) {
      try {
        this.deliveryInfo = await this.getDeliveryInfo({
          companyNo,
          invoiceNo,
        });

        this.isDeliveyTrackingModalOpen = true;
      } catch (e) {
        this.root.alert.showAlert('유효하지 않은 배송 정보입니다.');
        this.isDeliveyTrackingModalOpen = false;
        console.error(e);
      }
    } else if (order.shipMethod === 'QUICK') {
      this.deliveryInfo = await this.getQuickDeliveryInfo({ shipId });
      this.isQuickDeliveyTrackingModalOpen = true;
    } else {
      this.root.alert.showAlert('송장 정보가 없습니다.');
    }
  };

  closeDeliveryTrackingModal = () => {
    this.isDeliveyTrackingModalOpen = false;
    this.isQuickDeliveyTrackingModalOpen = false;
    this.resetDeliveryInfo();
  };

  /**
   * @param code 택배사 코드
   * @param invoice 송장번호
   */
  @action
  getDeliveryInfo = async ({ companyNo, invoiceNo }) => {
    const { data } = await API.ship.get(`/tracking/info`, {
      params: {
        companyNo,
        invoiceNo,
      },
    });
    return data.data;
  };

  /**
   * @param shipId shpping 코드
   */
  @action
  getQuickDeliveryInfo = async ({ shipId }) => {
    const { data } = await API.order.get(`/shipping/quick/info/${shipId}`);
    return data.data;
  };

  resetDeliveryInfo = () => {
    this.deliveryInfo = {};
  };
}
