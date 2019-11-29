import API from 'childs/lib/API';
import { snsTypes } from 'childs/lib/constant/sns';

/**
 * sns 로그인에 사용되는 body 데이터.
 * * snsType 필드는 각 로그인에 맞게 달라야 한다.
 */
const SNS_LOGIN_COMMON_BODY = {
  email: 'youngilpark@temco.io',
  profileJson: {
    snsId: 12345678,
    email: 'youngilpark@temco.io',
    familyName: '박',
    givenName: '영일',
    name: '박영일',
    imageUrl: 'photo.jpg',
  },
  snsId: 12345678,
  snsType: snsTypes.FACEBOOK,
};

export default {
  /**
   * 이메일, 패스워드 로그인
   */
  loginUser: ({ email, password }) => {
    return API.user.post(`/loginUser`, {
      email,
      password,
    });
  },

  facebookLogin: (body = SNS_LOGIN_COMMON_BODY) => {
    return API.user.post(`/sns-users/facebookLogin`, body);
  },
  googleLogin: (body = SNS_LOGIN_COMMON_BODY) => {
    return API.user.post(`/sns-users/googleLogin`, body);
  },
  kakaoLogin: (body = SNS_LOGIN_COMMON_BODY) => {
    return API.user.post(`/sns-users/kakaoLogin`, body);
  },
  naverLogin: (body = SNS_LOGIN_COMMON_BODY) => {
    return API.user.post(`/sns-users/naverLogin`, body);
  },
};
