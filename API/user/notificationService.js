import API from 'childs/lib/API';

export default {
  /**
   * 인증메일 발송
   */
  sendEmailToVerify: ({
    body = {
      email: 'youngilpark@temco.io', // 필수
      name: '박영일', // 옵션
    },
  }) => {
    return API.user.post(`/verify/sendEmail`, body);
  },

  /**
   * 휴대폰 인증번호 발송
   */
  sendSMSToVerify: ({
    body = {
      email: 'youngilpark@temco.io',
      mobile: '01094342999',
      name: '박영일',
    },
  }) => {
    return API.user.post(`/verify/sendMobile`, body);
  },
};
