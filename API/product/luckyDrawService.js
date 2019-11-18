import API from '../../API';

/**
 * 럭키드로우
 * http://dev.product.guhada.com/swagger-ui.html#/lucky-draw-controller
 */
export default {
  /**
   * 목록 가져오기
   */
  getLuckyDraws: () => {
    return API.product.get(`/lucky-draws`);
  },

  /**
   * 신청 확인
   */
  requestLuckyDraws: ({ dealId }) => {
    return API.product.post(`/lucky-draws/request`, {
      dealId,
    });
  },

  /**
   * 당첨자 확인
   */
  requestLuckyDraws: ({ dealId }) => {
    return API.product.post(`/lucky-draws/winner-check/`, {
      params: {
        dealId,
      },
    });
  },
};
