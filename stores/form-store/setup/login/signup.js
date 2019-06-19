export default {
  fields: {
    email: {
      name: 'email',
      label: '이메일',
      placeholder: '아이디 (이메일)',
      rules: 'required|email|string|between:5,25',
    },
    emailCheck: {},
    password: {
      name: 'password',
      label: '비밀번호',
      placeholder: '비밀번호',
      rules:
        'required|string|regex:/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/',
    },
    passwordConfirm: {
      name: 'passwordConfirm',
      label: '비밀번호',
      placeholder: '비밀번호 확인',
      autoComplete: 'passwordConfirm',
      rules: 'required|string|same:password',
    },
  },
};
