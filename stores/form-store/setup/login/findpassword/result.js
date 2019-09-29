export default {
  fields: {
    password: {
      type: 'password',
      name: 'password',
      label: '비밀번호',
      placeholder: '새 비밀번호 (8자~15자)',
      rules: 'required|password',
    },
    passwordConfirm: {
      type: 'password',
      name: 'passwordConfirm',
      label: '비밀번호 확인',
      placeholder: '비밀번호 확인',
      autoComplete: 'passwordConfirm',
      rules: 'required|string|same:password',
    },
  },
};
