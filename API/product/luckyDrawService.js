import API from 'childs/lib/API';

export const luckyDrawStatus = {
  NORMAL: 'NORMAL',
  READY: 'READY',
  START: 'START',
  REQUESTED: 'REQUESTED',
  OUT_OF_TIME: 'OUT_OF_TIME',
  WINNER_ANNOUNCEMENT: 'WINNER_ANNOUNCEMENT',
};

/**
 * 럭키드로우
 * http://dev.product.guhada.com/swagger-ui.html#/lucky-draw-controller
 */
export default {
  /**
   * 목록 가져오기
   * GET http://dev.product.guhada.com/lucky-draws
   */
  getLuckyDraws: () => {
    return API.product.get(`/lucky-draws`);
  },

  /**
   * 신청
   */
  requestLuckyDraws: ({ dealId }) => {
    return API.product.post(`/lucky-draws/request/${dealId}`);
  },

  /**
   * 당첨자 확인
   * 당첨이면 true, 아니면 false
   *
   * @return "data":{"title":"[변경금지] 럭키드로우 테스트 상품1","userName":"민*현(민*)"}
   */
  checkWinnerLuckyDraws: ({ dealId }) => {
    return API.product.get(`/lucky-draws/winner/${dealId}`);
  },
};
