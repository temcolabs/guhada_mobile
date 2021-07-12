import API from 'lib/API';

export default {
  /**
   * 연결된 SNS 계정 정보 가져옴
   * ex) "data": [ "KAKAO" ],
   */
  getSNSUsers: ({ userId } = {}) => {
    return API.user.get(`/sns-users/${userId}/sns-type`).then(({ data }) => {
      return data.data;
    });
  },
};
