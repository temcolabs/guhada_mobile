/**
 * 배송 메모 옵션
 */

const shippingMessage = {
  BEFORE_CALL: {
    code: 'BEFORE_CALL',
    label: '배송 전에 연락주세요',
  },
  PUT_DOOR: {
    code: 'PUT_DOOR',
    label: '문 앞에 놓아주세요',
  },
  SECURITY: {
    code: 'SECURITY',
    label: '부재시 경비실에 맡겨주세요',
  },
  CALL_IF_ABSENT: {
    code: 'CALL_IF_ABSENT',
    label: '부재시 전화 주세요.',
  },
  POSTBOX: {
    code: 'POSTBOX',
    label: '무인택배함에 넣어주세요.',
  },
  SELF: {
    code: 'SELF',
    label: '직접입력',
  },
};

export const shippingMessageOptions = Object.keys(shippingMessage)
  .map(key => {
    const reason = shippingMessage[key];
    return {
      value: reason.code,
      label: reason.label,
    };
  })
  .filter(opt => opt.value !== 'NONE');

export default shippingMessage;
