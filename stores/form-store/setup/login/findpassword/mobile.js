import hooks from '../../../hooks/login/findpassword/MobileHooksField';

export default {
  fields: {
    name: {
      type: 'text',
      name: 'name',
      label: 'name',
      placeholder: '이름',
      rules: 'required|string',
    },
    email: {
      type: 'text',
      name: 'email',
      label: 'email',
      placeholder: '아이디 (이메일)',
    },
    mobile: {
      type: 'tel',
      name: 'mobile',
      label: 'mobile',
      placeholder: '휴대폰번호 (숫자만 입력)',
      hooks,
    },
    resendButton: {
      label: '재전송',
      value: false,
    },
    verificationNumber: {
      type: 'number',
      name: 'verificationNumber',
      label: 'verificationNumber',
      value: '',
      placeholder: '인증번호 (6자리 숫자 입력)',
      hooks,
    },
  },
};
