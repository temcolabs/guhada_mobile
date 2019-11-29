import API from 'childs/lib/API';

/**
 * 특정 셀러에게서 내가 주문한 상품을 가져온다
 *
 * http://dev.order.guhada.com/swagger-ui.html#/order-review-controller
 */
export default {
  /**
   * 특정 셀러에게서 내가 주문한 상품을 가져온다
   */
  getMyDealsFromSeller: ({ sellerId }) => {
    if (!sellerId) {
      console.error(`[getMyDealsFromSeller] sellerId is`, sellerId);
      return null;
    } else {
      return API.order.get(`/order-review/seller-inquire-order`, {
        params: {
          sellerId,
        },
      });
    }
  },
};
