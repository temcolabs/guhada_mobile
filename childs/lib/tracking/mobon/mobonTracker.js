import { devLog } from 'childs/lib/common/devLog';
import detectDevice from 'childs/lib/common/detectDevice';
import { isBrowser } from 'childs/lib/common/isServer';
import loadScript, { scriptIds } from 'childs/lib/dom/loadScript';

const mobonTracker = {
  /**
   * 상품 상세
   */
  productDetail: () => {},

  /**
   * 장바구니
   */
  shoppingCart: () => {},

  /**
   * 주문 완료
   */
  purchaseComplete: () => {},
};

export default mobonTracker;
