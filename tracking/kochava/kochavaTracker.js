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
    for (let i = 0; i < successInfo?.orderList?.length; i++) {
      kochava.activity('Buy_Product', {
        dealId: successInfo.orderList[i].dealId,
        season: successInfo.orderList[i].season
          ? successInfo.orderList[i].season
          : null,
        name: successInfo.orderList[i].prodName,
        originalPrice: successInfo.orderList[i].originalPrice,
        discountPrice: successInfo.orderList[i].discountPrice,
        brandName: successInfo.orderList[i].brandName,
        sellerId: successInfo.orderList[i].sellerId,
      });
    }
  },
};
