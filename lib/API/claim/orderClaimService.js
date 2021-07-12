import API from 'lib/API';
import moment from 'moment';

export default {
  /**
   * 지정된 기간의 취소 ・ 교환 ・ 반품 상태 리턴
   *
   * data {
      cancelOrder: 1
      exchangeOrder: 4
      returnOrder: 3
     }
   */
  getMyCancelOrderStatusList: ({ startDate, endDate }) => {
    return API.claim.get(`/order-claim/my-cancel-orders-status-list`, {
      params: {
        startTimestamp: +moment(startDate).startOf('day'), // unix timestaamp
        endTimestamp: +moment(endDate).endOf('day'),
      },
    });
  },
};
