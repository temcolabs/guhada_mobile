// 취소 사유 옵션
const cancelReason = {
  CHANGE_MIND: {
    code: 'CHANGE_MIND',
    label: '단순 변심',
    isFeeCharged: true, // 유저가 배송비를 지불해야하는지 여부. true면 유저가 지불
  },
  COLOR_SIZE_CHANGE: {
    code: 'COLOR_SIZE_CHANGE',
    label: '색상 및 사이즈 변경',
    isFeeCharged: true,
  },
  MISTAKE_ORDER: {
    code: 'MISTAKE_ORDER',
    label: '다른 상품 잘못 주문',
    isFeeCharged: true,
  },
  LATE_DELIVERY: {
    code: 'LATE_DELIVERY',
    label: '배송지연',
    isFeeCharged: false,
  },
  SOLD_OUT: { code: 'SOLD_OUT', label: '상품품절', isFeeCharged: false },
  SERVICE_UNSATISFIED: {
    code: 'SERVICE_UNSATISFIED',
    label: '서비스 불만족',
    isFeeCharged: false,
  },
  DIFFERENT_PRODUCT: {
    code: 'DIFFERENT_PRODUCT',
    label: '상품정보 상이',
    isFeeCharged: false,
  },
};

export const cancelReasonOptions = Object.keys(cancelReason).map(key => {
  const reason = cancelReason[key];
  return {
    value: reason.code,
    label: reason.label,
    isFeeCharged: reason.isFeeCharged,
  };
});

export default cancelReason;
