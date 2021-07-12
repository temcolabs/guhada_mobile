import API from 'lib/API';

/**
 * http://dev.order.guhada.com/swagger-ui.html#/order-controller
 */
export default {
  /**
   * 주문 완료 데이터
   */
  getOrderComplete: ({ purchaseId }) => {
    return API.order.get(`/order/order-complete/${purchaseId}`);
  },

  /**
   * 배송지 주소 수정
   */
  updateShippingAddress: ({
    purchaseId,
    addShippingAddress,
    shippingAddress = {
      defaultAddress: false,
      zip: '',
      address: '',
      detailAddress: '',
      recipientMobile: '',
      recipientName: '',
      roadAddress: '',
      safetyMobile: false,
      shippingMessage: '',
      shippingName: '',
    },
  }) => {
    return API.order.post(
      `/order/order-update/shipping-address`,
      shippingAddress,
      {
        params: {
          purchaseId,
          addShippingAddress,
        },
      }
    );
  },

  /**
   * 장바구니 담기
   */
  addShoppingCart: async ({ dealId, dealOptionId, quantity }) => {
    const res = await API.order.post(`/cart/addCartItem/`, null, {
      params: {
        dealId,
        dealOptionId,
        quantity,
      },
    });

    return res;
  },
};
