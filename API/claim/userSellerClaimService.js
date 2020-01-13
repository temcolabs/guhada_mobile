import API from 'childs/lib/API';

export default {
  /**
   * 내가 작성한 판매자 문의 모두 가져오기
   *
   * ! 셀러 클레임 목록은 페이지가 0부터 시작함 ...
   */
  getSellerClaims: ({ userId = 0, pageNo = 0, size = 5 }) => {
    return API.claim.get(`/users/${userId}/seller-claims`, {
      params: {
        pageNo,
        size,
      },
    });
  },
  deleteSellerClaim: ({ userId, id }) => {
    return API.claim.delete(`/users/${userId}/seller-claims/${id}`);
  },
};
