import { devLog } from 'childs/lib/common/devLog';
import detectDevice from 'childs/lib/common/detectDevice';
import { isBrowser } from 'childs/lib/common/isServer';
import loadScript, { scriptIds } from 'childs/lib/dom/loadScript';
import likeCss from 'components/productdetail/ProductDetailName.module.scss';
import cartCss from 'components/productdetail/CartAndPurchaseButton.module.scss';

const device = (() => {
  let userAgent = detectDevice().device;
  switch (userAgent) {
    case 'desktop':
      return 'W';
    case 'tablet':
      return 'B';
    default:
      return 'M'; // mobile
  }
})();

const mobonTracker = {
  /**
   * 상품 상세
   */
  productDetail: deals => {
    console.log('mobonTracker', deals);
    if (isBrowser && !!deals) {
      const {
        dealId,
        name,
        sellPrice,
        discountPrice,
        totalStock,
        imageUrls,
        tag,
      } = deals;
      const category = tag?.length ? tag.split('/') : [];

      // const shoppingCartBtnSelector = '[class^=shoppingCart__btn]';
      // const likeBtnSelector = '[class^=like__btn]';
      let shoppingCartBtnSelector = cartCss.shoppingCart__btn;
      let likeBtnSelector = likeCss.like__btn;

      loadScript(null, {
        id: scriptIds.MOBON_TRACKER,
        replaceExisting: true,
        innerHTML: `
          var ENP_VAR = {
            collect: {},
            conversion: { product: [] },
          };
          ENP_VAR.collect.productCode = '${dealId}';
          ENP_VAR.collect.productName = '${name}';
          ENP_VAR.collect.price = '${sellPrice}';
          ENP_VAR.collect.dcPrice = '${discountPrice}';
          ENP_VAR.collect.soldOut = '${!!totalStock ? 'N' : 'Y'}';
          ENP_VAR.collect.imageUrl = '${imageUrls.length ? imageUrls[0] : ''}';
          ENP_VAR.collect.topCategory = '${
            category.length > 3 ? category[category.length - 4] : ''
          }';
          ENP_VAR.collect.firstSubCategory = '${
            category.length > 2 ? category[category.length - 3] : ''
          }';
          ENP_VAR.collect.secondSubCategory = '${
            category.length > 1 ? category[category.length - 2] : ''
          }';
          ENP_VAR.collect.thirdSubCategory = '${
            category.length ? category[category.length - 1] : ''
          }';

          (function(a, g, e, n, t) {
            a.enp =
              a.enp ||
              function() {
                (a.enp.q = a.enp.q || []).push(arguments);
              };
            n = g.createElement(e);
            n.async = !0;
            n.defer = !0;
            n.src = 'https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js';
            t = g.getElementsByTagName(e)[0];
            t.parentNode.insertBefore(n, t);
          })(window, document, 'script');
        `,
      });

      devLog(
        `[mobonTracker.productDetail]`,
        device,
        deals,
        category,
        shoppingCartBtnSelector,
        likeBtnSelector
      );

      /* 상품수집 */
      window.enp('create', 'collect', 'guhada9', { device });

      /* 장바구니 버튼 타겟팅 (이용하지 않는 경우 삭제) */
      window.enp('create', 'cart', 'guhada9', {
        device,
        btnSelector: `.${shoppingCartBtnSelector}`,
      });

      /* 찜 버튼 타겟팅 (이용하지 않는 경우 삭제) */
      window.enp('create', 'wish', 'guhada9', {
        device,
        btnSelector: `.${likeBtnSelector}`,
      });
    }
  },

  /**
   * 장바구니
   */
  shoppingCart: cartData => {
    if (isBrowser) {
      const { totalPaymentPrice, cartItemResponseList } = cartData;
      const products = cartItemResponseList.map(item => ({
        productCode: item.dealId?.toString(),
        productName: item.dealName,
        price: item.sellPrice?.toString(),
        dcPrice: item.discountPrice?.toString(),
        qty: item.currentQuantity?.toString(),
      }));

      loadScript(null, {
        id: scriptIds.MOBON_TRACKER,
        replaceExisting: true,
        innerHTML: `
          var ENP_VAR = { conversion: { product: ${JSON.stringify(
            products
          )} } };
          ENP_VAR.conversion.totalPrice = '${totalPaymentPrice.toString()}';
          ENP_VAR.conversion.totalQty = '${cartItemResponseList.length}';

          (function(a, g, e, n, t) {
            a.enp =
              a.enp ||
              function() {
                (a.enp.q = a.enp.q || []).push(arguments);
              };
            n = g.createElement(e);
            n.async = !0;
            n.defer = !0;
            n.src =
              'https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js';
            t = g.getElementsByTagName(e)[0];
            t.parentNode.insertBefore(n, t);
          })(window, document, 'script');
        `,
      });

      devLog(`[mobonTracker.shoppingCart]`, device, cartData, products);

      window.enp('create', 'conversion', 'guhada9', {
        device: `${device}`,
        paySys: 'naverPay',
      });
    }
  },

  /**
   * 주문 완료
   */
  purchaseComplete: successInfo => {
    if (isBrowser) {
      const { orderNumber, totalOrderPrice, orderList } = successInfo;
      const products = orderList.map(order => ({
        productCode: order.dealId?.toString(),
        productName: order.prodName,
        price: order.orderPrice?.toString(),
        dcPrice: order.discountPrice?.toString(),
        qty: order.quantity?.toString(),
      }));

      loadScript(null, {
        id: scriptIds.MOBON_TRACKER,
        replaceExisting: true,
        innerHTML: `
          var ENP_VAR = { conversion: { product: ${JSON.stringify(
            products
          )} } };

          ENP_VAR.conversion.ordCode = ${orderNumber};
          ENP_VAR.conversion.totalPrice = ${totalOrderPrice};
          ENP_VAR.conversion.totalQty = ${orderList.length};

          (function(a, g, e, n, t) {
            a.enp =
              a.enp ||
              function() {
                (a.enp.q = a.enp.q || []).push(arguments);
              };
            n = g.createElement(e);
            n.async = !0;
            n.defer = !0;
            n.src =
              'https://cdn.megadata.co.kr/dist/prod/enp_tracker_self_hosted.min.js';
            t = g.getElementsByTagName(e)[0];
            t.parentNode.insertBefore(n, t);
          })(window, document, 'script');
        `,
      });

      devLog(`[mobonTracker.purchaseComplete]`, device, successInfo, products);

      window.enp('create', 'conversion', 'guhada9', { device });
      window.enp('send', 'conversion', 'guhada9');
    }
  },
};

export default mobonTracker;
