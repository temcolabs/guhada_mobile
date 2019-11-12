import hooks from 'stores/form-store/hooks/login/luckydraw/SignupHooks';

export default {
  fields: {
    email: {
      name: 'email',
      label: '이메일',
      placeholder: '아이디 (이메일)',
      rules: 'required|email|string',
      hooks,
    },
    emailCheck: {},
    name: {
      type: 'text',
      name: 'name',
      label: '이름',
      placeholder: '이름',
      rules: 'required|string',
      hooks,
    },
    mobile: {
      type: 'tel',
      name: 'mobile',
      label: '전화번호',
      placeholder: '전화번호',
      value: '',
      hooks,
    },
    mobileButton: {
      label: '본인인증',
    },
    authMobile: {
      type: 'number',
      name: 'authMobile',
      label: '',
      placeholder: '인증번호',
      value: '',
      hooks,
    },
    authMobileButton: { label: '본인인증' },
    optionalAgree: {
      type: 'checkbox',
      id: 'optionalAgree',
      name: 'optionalAgree',
      label: '선택약관 전체동의',
      hooks,
    },
    agreeSaleTos: {
      type: 'checkbox',
      id: 'agreeSaleTos',
      name: 'agreeSaleTos',
      label: '판매이용약관',
      hooks,
    },
    agreeEmailReception: {
      type: 'checkbox',
      id: 'agreeEmailReception',
      name: 'agreeEmailReception',
      label: '이메일수신',
      hooks,
    },
    agreeSmsReception: {
      type: 'checkbox',
      id: 'agreeSmsReception',
      label: '문자수신',
      hooks,
    },
  },
};
