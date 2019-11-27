export default {
  shoppingCart: ({
    dealId = null,
    productId = null,
    brandId = null,
    sellerId = null,
    season = null,
    name = null,
    sellPrice = null,
    discountPrice = null,
  }) => {
    kochava.activity('Add_To_Cart', {
      dealId,
      productId,
      brandId,
      sellerId,
      season,
      name,
      sellPrice,
      discountPrice,
    });
  },
  purchaseComplete: ({ successInfo }) => {
    for (let i = 0; i < successInfo.orderList.length; i++) {
      kochava.activity('Buy_Product', {
        dealId: successInfo.orderList[i].dealId,
        season: successInfo.orderList[i].season,
        name: successInfo.orderList[i].prodName,
        sellPrice: successInfo.orderList[i].orderPrice,
        discountPrice: successInfo.orderList[i].discountPrice,
        brandId: successInfo.orderList[i].brandName,
        sellerId: successInfo.orderList[i].sellerId,
      });
    }
  },
};
