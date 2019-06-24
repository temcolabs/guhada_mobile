import hooks from '../../hooks/login/SignupHooksField';

export default {
  fields: {
    allagree_term: {
      type: 'checkbox',
      id: 'allagree_term',
      name: 'allagree_term',
      label: '전체동의',
      hooks,
    },
    requireAgree: {
      type: 'checkbox',
      id: 'requireAgree',
      name: 'requireAgree',
      label: '필수약관',
      hooks,
    },
    agreePurchaseTos: {
      type: 'checkbox',
      id: 'agreePurchaseTos',
      name: 'agreePurchaseTos',
      label: '구매이용약관',
      rules: 'boolean|accepted',
      hooks,
    },
    agreeCollectPersonalInfoTos: {
      type: 'checkbox',
      id: 'agreeCollectPersonalInfoTos',
      name: 'agreeCollectPersonalInfoTos',
      label: '개인정보 수집 및 이용동의',
      rules: 'boolean|accepted',
      hooks,
    },
    optionalAgree: {
      type: 'checkbox',
      id: 'optionalAgree',
      name: 'optionalAgree',
      label: '선택약관',
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
