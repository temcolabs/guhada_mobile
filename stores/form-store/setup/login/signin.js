import hooks from '../../hooks/login/SigninHooks';

export default {
  fields: {
    email: {
      name: 'email',
      label: '이메일',
      autoComplete: 'email',
      placeholder: '아이디 (이메일)',
      rules: 'required|email|string|between:5,25',
      // hooks,
    },
    password: {
      type: 'password',
      name: 'password',
      label: '비밀번호',
      autoComplete: 'password',
      placeholder: '비밀번호',
      rules: 'required|password',
      // rules:
      //   'required|string|regex:/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/',
    },
    saveid: {},
  },
};
