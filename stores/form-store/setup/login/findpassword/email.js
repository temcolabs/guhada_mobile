import hooks from '../../../hooks/login/findpassword/EmailHooksField';

export default {
  fields: {
    name: {
      name: 'name',
      label: '이름',
      placeholder: '이름',
      rules: 'required|string',
    },
    email: {
      name: 'email',
      label: '이메일',
      placeholder: '아이디 (이메일)',
      rules: 'required|email|string|between:5,25',
      hooks,
    },
    resendButton: {
      label: '재전송',
      value: false,
    },
    verificationNumber: {
      type: 'number',
      value: '',
      name: 'verificationNumber',
      label: 'verificationNumber',
      placeholder: '인증번호 (6자리 숫자 입력)',
      hooks,
    },
  },
};
