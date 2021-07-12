/**
 * 주문의 주문 상품 1개. 클레임일때만 들어가는 데이터 있음.
 */
export const ORDER_LIST_ITEM_SAMPLE = {
  // ============================================================
  // * 클레임(취소교환반품) 데이터
  claimStatus: null,
  // string
  // example: REQUEST_CANCEL 클레임 상태
  claimStatusText: null,
  // string example: 취소요청
  // 클레임 상태 메세지

  // ============================================================
  // * 공통 데이터
  brandName: 'string',
  // example: 구찌
  // 브랜드명
  dealId: 'integer($int64)',
  // example: 45223
  // 상품의 딜 아이디
  discountPrice: 'number',
  // example: 300000
  // 할인된 가격
  expireDate: 'string($date)',
  // example: 2019,5,15
  // 무통장 입금시 입금기한(무통장이 아니면경우 null)
  expireTimestamp: 'integer($int64)',
  // example: 1560390962
  imageName: 'string',
  // 무통장 입금시 입금기한(무통장이 아니면경우 null)
  // example: blahblahblahblahblahblah.png
  // 대표 이미지 파일명
  imageUrl: 'string',
  // example: https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/5fbf084283da49b7a45a0798f0c7d9ce
  // 대표 이미지 URL
  optionAttribute1: 'string',
  // example: 체리
  // 첫번째 옵션
  optionAttribute2: 'string',
  // example: 85
  // 두번째 옵션
  optionAttribute3: 'string',
  // example: 세모
  // 세번째 옵션
  orderDate: 'string($date)',
  // example: 2019,5,14
  // 주문일
  orderPrice: 'number',
  // example: 350000
  // 주문한 금액
  orderProdGroupId: 'integer($int64)',
  // example: 3121
  // 주문그룹 아이디
  orderTimestamp: 'integer($int64)',
  // example: 2019,5,14
  // 주문일
  originalPrice: 'number',
  // example: 350000
  // 원래 가격
  prodName: 'string',
  // example: 반팔 프린트 원피스
  // 상품명
  productId: 'integer($int64)',
  // example: 22
  // 상품 아이디
  purchaseConfirm: 'boolean',
  // example: false
  // 주문 확정여부
  purchaseId: 'integer($int64)',
  // example: 22
  // 구매 데이터의 아이디
  purchaseStatus: 'string',
  // example: PAYMENT_COMPLETE
  // 주문의 상태값
  purchaseStatusText: 'string',
  // example: 결제완료
  // 주문의 상태값 텍스트
  quantity: 'integer($int32)',
  // example: 1
  // 구매수량
  requestClaimTimestamp: 'integer($int64)',
  // example: 15603909620000
  // 주문의 클레임 요청일
  reviewId: 'integer($int64)',
  // example: 45223
  // 리뷰아이디 null이 아닌경우 리뷰가 존재
  season: 'string',
  // example: 19FW
  // 시즌
  sellerId: 'integer($int64)',
  // example: 25231
  // 판매자의 아이디
  sellerName: 'string',
  // example: 셀러구하다
  // 판매자의 이름
  shipCompleteDate: 'string($date)',
  // example: 2019-05-10
  // 배송완료일자
  shipCompleteTimestamp: 'integer($int64)',
  // example: 1560390962000
  // 배송완료일자
  shipPrice: 'number',
  // example: 2500
  // 배송비
  statusMessage: 'string',
  // example: 구매가 완료되었습니다. 이용해주셔서 감사합니다. 구매확정 이후 상품의 이용방법, 반품 등에 대한 문의는 판매자에게 문의해주세요.
  // 상태의 따른 메세지
};

export const PAYMENT_RESPONSE_SAMPLE = {
  amount: 'number',
  cardQuota: 'string',
  cashReceiptNo: 'integer($int32)',
  cashReceiptType: 'string',
  cashReceiptUsage: 'string',
  completeAt: 'string($date-time)',
  completeTimestamp: 'integer($int64)',
  method: 'string',
  mobileCorp: 'string',
  mobileNo: 'string',
  mobileVanCd: 'string',
  parentMethod: 'string',
  paymentStatus: 'string',
  pointPayment: 'integer($int64)',
  requestAt: 'string($date-time)',
  requestTimestamp: 'integer($int64)',
  vbankBankName: 'string',
  vbankDepositorName: 'string',
  vbankExpireAt: 'string($date-time)',
  vbankExpireTimestamp: 'integer($int64)',
  vbankNo: 'string',
  vbankRemitterName: 'string',
};

export const SHIPPING_ADDRESS_SAMPLE = {
  add: 'boolean',
  addressBasic: 'string',
  addressDefault: 'boolean',
  addressDetail: 'string',
  addressName: 'string',
  id: 'integer($int64)',
  message: 'string',
  messageCode: 'string',
  phone: 'string',
  receiverName: 'string',
  roadAddress: 'string',
  safetyNoUse: 'boolean',
  zipcode: 'string',
};

// 주문 완료 데이터
export const ORDER_COMPLETE_SAMPLE = {
  buyerEmail: 'string',
  // example: goodjoonhee@temco.io
  // 주문자 이메일

  buyerName: 'string',
  // example: 조준희
  // 주문자 명

  buyerPhone: 'string',
  // example: 010-5278-7366
  // 주문자 연락처

  defaultAddress: 'boolean',
  // example: true
  // 기본 배송지인지 여부

  orderList: [ORDER_LIST_ITEM_SAMPLE],
  orderNumber: 'integer($int64)',
  // example: 251231
  // 주문번호

  payment: PAYMENT_RESPONSE_SAMPLE,
  pgTid: 'string',
  // pg사 주문번호

  shippingAddress: SHIPPING_ADDRESS_SAMPLE,
  totalDiscountDiffPrice: 'number',
  // example: 30000
  // 총 할인 가격

  totalPaymentPrice: 'number',
  // example: 555000
  // 총 결제 금액

  totalProdPrice: 'number',
  // example: 550000
  // 상품의 총 가격

  totalShipPrice: 'number',
  // example: 5000
  // 배송비 총합
};
