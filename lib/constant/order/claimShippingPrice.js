import { arrayToEnum } from 'lib/common/arrayToObject';

// 교환반품 배송비 옵션
const claimShippingPrice = {
  NONE: { code: 'NONE', label: '판매자 부담' }, // 판매자 귀책 사유가 아닐 때는 배송비 없음
  BOX: { code: 'BOX', label: '박스에 동봉' },
  DIRECT_SEND: { code: 'DIRECT_SEND', label: '판매자에게 직접 송금' },
};

export const claimShippingPriceTypes = arrayToEnum(
  Object.keys(claimShippingPrice)
);

export const claimShippingPriceOptions = Object.keys(claimShippingPrice)
  .map((key) => {
    const reason = claimShippingPrice[key];
    return {
      value: reason.code,
      label: reason.label,
    };
  })
  .filter((opt) => opt.value !== 'NONE');

export default claimShippingPrice;
