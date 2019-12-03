import API from 'childs/lib/API';

export default {
  /**
   * 이메일, 휴대폰 인증번호 확인
   */
  verifyCode: ({
    body = {
      verificationNumber: 111222, // 인증번호
      verificationTarget: 'youngilpark@temco.io', // email address or mobile number
      verificationTargetType: 'EMAIL', // EMAIL, MOBILE
    },
  }) => {
    return API.user.post(`/verify`, body);
  },
};
