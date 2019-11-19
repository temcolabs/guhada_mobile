import { arrayToEnum } from 'lib/arrayToObject';

// 결제 수단
const paymentMethod = {
  CARD: { code: 'Card', label: '신용/체크카드' },
  VBANK: { code: 'VBank', label: '무통장입금' },
  DIRECT_BANK: { code: 'DirectBank', label: '실시간 계좌이체' },
  TOKEN: { code: 'TOKEN', label: '토큰결제' },
};

// select 옵션
export const paymentMethodOptions = Object.keys(paymentMethod).map(
  paymentKey => ({
    value: paymentMethod[paymentKey].code,
    label: paymentMethod[paymentKey].label,
  })
);

// enum 형태
export const paymentMethodTypes = arrayToEnum(
  paymentMethodOptions.map(option => option.value)
);

export default paymentMethod;
