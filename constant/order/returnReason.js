const returnReason = {
  MISTAKE_ORDER: {
    code: 'MISTAKE_ORDER',
    label: '다른 상품 잘못 주문',
    isFeeCharged: true,
  },
  SERVICE_UNSATISFIED: {
    code: 'SERVICE_UNSATISFIED',
    label: '서비스 불만족',
    isFeeCharged: false,
  },
  LATE_DELIVERY: {
    code: 'LATE_DELIVERY',
    label: '배송지연',
    isFeeCharged: false,
  },
  SOLD_OUT: {
    code: 'SOLD_OUT',
    label: '상품품절',
    isFeeCharged: false,
  },
  DELIVERY_OMITTED: {
    code: 'DELIVERY_OMITTED',
    label: '배송누락',
    isFeeCharged: false,
  },
  DAMAGED: { code: 'DAMAGED', label: '상품파손', isFeeCharged: false },
  DIFFERENT_PRODUCT: {
    code: 'DIFFERENT_PRODUCT',
    label: '상품정보 상이',
    isFeeCharged: false,
  },
  MISTAKE_DELIVERY: {
    code: 'MISTAKE_DELIVERY',
    label: '오배송',
    isFeeCharged: false,
  },
  DIFFERENT_OPTION: {
    code: 'DIFFERENT_OPTION',
    label: '색상등 다른 상품 잘못 배송',
    isFeeCharged: false,
  },
  ETC: { code: 'ETC', label: '기타', isFeeCharged: false },
};

export const returnReasonOptions = Object.keys(returnReason).map(key => {
  const reason = returnReason[key];
  return {
    value: reason.code,
    label: reason.label,
    isFeeCharged: reason.isFeeCharged,
  };
});

export default returnReason;
