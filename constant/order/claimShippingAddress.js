export const claimShippingAddressTypes = {
  EXCHANGE_ADDRESS: 'EXCHANGE_ADDRESS',
  ORDER_ADDRESS: 'ORDER_ADDRESS',
  DEFAULT_ADDRESS: 'DEFAULT_ADDRESS',
  NEW_ADDRESS: 'NEW_ADDRESS',
};

/**
 * 교환상품 배송지 옵션.
 * 서버에 정의된 값은 아니며 UI에 사용하기 위해서 직접 정의한 값
 */
export const claimShippingAddressTypeOptions = [
  // { label: '교환 배송지', value: 'EXCHANGE_ADDRESS' },
  { label: '주문 배송지', value: 'ORDER_ADDRESS' },
  { label: '기본 배송지', value: 'DEFAULT_ADDRESS' },
  { label: '신규 배송지', value: 'NEW_ADDRESS' },
];
