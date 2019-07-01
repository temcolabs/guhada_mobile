import hooks from '../../../hooks/login/findid/MyinfoHooks';

export default {
  fields: {
    name: {
      type: 'text',
      name: 'name',
      label: '성명',
      placeholder: '성명',
      rules: 'required|string',
    },
    mobile: {
      type: 'tel',
      name: 'mobile',
      label: '휴대폰 번호',
      placeholder: '휴대폰 번호(숫자만 입력)',
      hooks,
    },
    resendButton: {
      label: '재전송',
      value: false,
    },
    joinAt: {},
    email: {},
    phoneNumber: {},
    authMobile: {},
    findId: {
      type: 'radio',
    },
  },
};
