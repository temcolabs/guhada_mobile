/**
 * 주문 상태 상수
 */
export default {
  REQUEST_ORDER: 'REQUEST_ORDER', // "결제 요청", //주문생성단계(주문Data에 REQUEST_ORDER가 있으면 비정상 주문임)
  WAITING_PAYMENT: 'WAITING_PAYMENT', // "입금 대기중", //무통장(가상계좌)주문 REQUEST_ORDER -> WAITING_PAYMENT 변경
  COMPLETE_PAYMENT: 'COMPLETE_PAYMENT', // "결제 완료", //신용카드,간편결제,실시간계좌이체,휴대폰 주문 REQUEST_ORDER->COMPLETE_PAYMENT 변경 : 무통장입금완료 WAITING_PAYMENT->COMPLETE_PAYMENT 변경
  FAILED_PAYMENT: 'FAILED_PAYMENT', // "결제 실패", //주문생성중 오류 REQUEST_ORDER->FAILED_PAYMENT 변경
  EXPIRED_PAYMENT: 'EXPIRED_PAYMENT', // "입금 기간 만료", //무통장주문 입금만료기간 초과 WAITING_PAYMENT->EXPIRED_PAYMENT 변경
  SELLER_IDENTIFIED: 'SELLER_IDENTIFIED', // "주문 확인", // 셀러 주문확인함
  RELEASE_PRODUCT: 'RELEASE_PRODUCT', // "출고",
  DELIVERING: 'DELIVERING', // "배송중",
  DELIVERED: 'DELIVERED', // "배송 완료",
  CANCEL: 'CANCEL', // "취소",
  RETURN: 'RETURN', // "반품",
  PART_RETURN: 'PART_RETURN', // "부분반품",
  EXCHANGE: 'EXCHANGE', // "교환",
  PART_EXCHANGE: 'PART_EXCHANGE', // "부분교환";
};
