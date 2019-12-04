import API from 'childs/lib/API';

export default {
  /**
   * 구매확정 적립 예정 포인트

   const data = {
      dueSavePointList: [
        {
          // * 구매 확정시 적립 예정
          dueSaveType: 'BUY',
          totalPoint: 500,
        },
        {
          // * 리뷰 작성시 적립 예정
          dueSaveType: 'REVIEW',
          totalPoint: 2000,
        },
      ],
    };
   */
  getConfirmDueSave: ({ orderProdGroupId } = {}) => {
    return API.benefit.get(
      `/process/product-confirm/due-save/${orderProdGroupId}`
    );
  },
};
