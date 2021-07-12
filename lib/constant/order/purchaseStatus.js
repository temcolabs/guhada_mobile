import { arrayToEnum } from 'lib/common/arrayToObject';

/**
 * 주문 상태 상수
 * https://temcolabs.atlassian.net/browse/TECH-898
 */
const purchaseStatus = {
  REQUEST_ORDER: { code: 'REQUEST_ORDER', label: '결제 요청' },
  WAITING_PAYMENT: { code: 'WAITING_PAYMENT', label: '입금 대기중' },
  COMPLETE_PAYMENT: { code: 'COMPLETE_PAYMENT', label: '결제 완료' },
  FAILED_PAYMENT: { code: 'FAILED_PAYMENT', label: '결제 실패' },
  EXPIRED_PAYMENT: { code: 'EXPIRED_PAYMENT', label: '기간 만료' },
  SELLER_IDENTIFIED: { code: 'SELLER_IDENTIFIED', label: '주문 확인' },
  RELEASE_PRODUCT: { code: 'RELEASE_PRODUCT', label: '출고' },
  DELIVERING: { code: 'DELIVERING', label: '배송중' },
  DELIVERED: { code: 'DELIVERED', label: '배송 완료' },
  REQUEST_CANCEL: { code: 'REQUEST_CANCEL', label: '취소 요청' },
  COMPLETE_CANCEL: { code: 'COMPLETE_CANCEL', label: '취소 완료' },
  SALE_CANCEL: { code: 'SALE_CANCEL', label: '판매 취소' },
  WITHDRAW_CANCEL: { code: 'WITHDRAW_CANCEL', label: '취소 철회' },
  REQUEST_RETURN: { code: 'REQUEST_RETURN', label: '반품' },
  PICKING_RETURN: { code: 'PICKING_RETURN', label: '반품 수거중' },
  COMPLETE_PICK_RETURN: {
    code: 'COMPLETE_PICK_RETURN',
    label: '반품 수거완료',
  },
  COMPLETE_RETURN: { code: 'COMPLETE_RETURN', label: '반품 완료' },
  WITHDRAW_RETURN: { code: 'WITHDRAW_RETURN', label: '반품 철회' },
  REQUEST_EXCHANGE: { code: 'REQUEST_EXCHANGE', label: '교환 요청' },
  PICKING_EXCHANGE: { code: 'PICKING_EXCHANGE', label: '교환 수거중' },
  COMPLETE_PICK_EXCHANGE: {
    code: 'COMPLETE_PICK_EXCHANGE',
    label: '교환 수거완료',
  },
  RESEND_EXCHANGE: { code: 'RESEND_EXCHANGE', label: '교환 재배송중' },
  COMPLETE_EXCHANGE: { code: 'COMPLETE_EXCHANGE', label: '교환완료' },
  WITHDRAW_EXCHANGE: { code: 'WITHDRAW_EXCHANGE', label: '교환철회' },
};

export const purchaseStatusOptions = Object.keys(purchaseStatus).map((key) => ({
  value: purchaseStatus[key].code,
  label: purchaseStatus[key].label,
}));

export const purchaseStatusTypes = arrayToEnum(Object.keys(purchaseStatus));

export default purchaseStatus;
