import UserStore from './UserStore';
import UiStatus from './UiStatus';
import LoginStore from './LoginStore';
import BrandsStore from './BrandsStore';
import CategoryStore from './CategoryStore';
import SearchStore from './SearchStore';
import SearchItemStore from './SearchItemStore';
import ProductDetailStore from './productdetail/ProductDetailStore';
import OrderPaymentStore from './orderpayment/OrderPaymentStore';
import OrderPaymentBenefitStore from './orderpayment/OrderPaymentBenefitStore';
import OrderPaymentSuccessStore from './OrderPaymentSuccessStore';
import ShoppingCartStore from './shoppingcart/ShoppingCartStore';
import ProductReviewStore from './productdetail/ProductReviewStore';
import ProductOptionStore from './productdetail/ProductOptionStore';

// 상품상세
import ProductDetailLikeStore from './productdetail/ProductDetailLikeStore';
import ProductDetailBookmarkStore from './productdetail/ProductDetailBookmarkStore';
import ProductDetailGalleryStore from './productdetail/ProductDetailGalleryStore';
import SellerFollowStore from './productdetail/SellerFollowStore';

import CartAndPurchaseStore from './productdetail/CartAndPurchaseStore';
import ShoppingCartSuccessModalStore from './productdetail/ShoppingCartSuccessModalStore';
import AlertStore from './AlertStore';
import BookMarkStore from './BookMarkStore';
import AuthMobileStore from './AuthMobileStore';
import CustomerAuthenticationStore from './orderpayment/CustomerAuthenticationStore';
import MyOrderListStore from './myOrder/OrderListStore';
import MyOrderDetailStore from './myOrder/OrderDetailStore';
import MypagePointStore from './mypage/MypagePointStore.js';
import MypagePointChargeStore from './mypage/MypagePointChargeStore.js';
import MypageReviewStore from './mypage/ReviewStore';
import MypageCouponStore from './mypage/MypageCouponStore';
import MypageAddressStore from './mypage/MypageAddressStore';
import ProductRecentlySeenStore from './ProductRecentlySeenStore';
import MypageLikeStore from './mypage/MypageLikeStore';
import CountdownStore from './CountdownStore';
import ToastStore from './ToastStore';
import RouteHistoryStore from './RouteHistoryStore';
import MainStore from './MainStore';
import KeywordStore from './home/KeywordStore';
import AddressStore from './address/AddressStore';
import SellerStore from './SellerStore';
import SellerClaimStore from './claim/SellerClaimStore';
import CardInterestStore from './CardInterestStore';

import EventMainStore from './event/EventMainStore';
import LuckyDrawStore from './event/LuckyDrawStore';

class RootStore {
  constructor(isServer, initialState) {
    this.user = new UserStore(this, initialState);
    this.uistatus = new UiStatus(this, initialState);
    this.login = new LoginStore(this, initialState);
    this.brands = new BrandsStore(this, initialState);
    this.category = new CategoryStore(this, initialState);
    this.search = new SearchStore(this, initialState);
    this.searchitem = new SearchItemStore(this, initialState);
    this.productdetail = new ProductDetailStore(this, initialState);
    this.orderpayment = new OrderPaymentStore(this, initialState);
    this.orderPaymentBenefit = new OrderPaymentBenefitStore(this, initialState);
    this.orderpaymentsuccess = new OrderPaymentSuccessStore(this, initialState);
    this.cartAndPurchase = new CartAndPurchaseStore(this, initialState);
    this.shoppingCartSuccessModal = new ShoppingCartSuccessModalStore(
      this,
      initialState
    );
    this.shoppingcart = new ShoppingCartStore(this, initialState);
    this.productreview = new ProductReviewStore(this, initialState);
    this.productoption = new ProductOptionStore(this, initialState);
    // 상품 상세
    this.productDetailLike = new ProductDetailLikeStore(this, initialState);
    this.productDetailBookmark = new ProductDetailBookmarkStore(
      this,
      initialState
    );
    this.productDetailGallery = new ProductDetailGalleryStore(
      this,
      initialState
    );
    this.sellerfollow = new SellerFollowStore(this, initialState);

    this.seller = new SellerStore(this, initialState);
    this.alert = new AlertStore(this, initialState);
    this.bookmark = new BookMarkStore(this, initialState);
    this.authmobile = new AuthMobileStore(this, initialState);
    this.customerauthentication = new CustomerAuthenticationStore(
      this,
      initialState
    );
    this.countdown = new CountdownStore(this, initialState);

    // order payment - 사이드 탭
    this.productRecentlySeen = new ProductRecentlySeenStore(this, initialState);

    // 나의 주문
    // mypage - 나의주문
    this.myOrderList = new MyOrderListStore(this, initialState);
    // mypage - 상품상세
    this.myOrderDetail = new MyOrderDetailStore(this, initialState);
    // mypage - 포인트
    this.mypagePoint = new MypagePointStore(this, initialState);
    // mypage - 충전
    this.mypagePointCharge = new MypagePointChargeStore(this, initialState);
    // mypage - 리뷰
    this.mypagereview = new MypageReviewStore(this, initialState);
    // mypage - 쿠폰
    this.mypageCoupon = new MypageCouponStore(this, initialState);
    // mypage - 배송지관리
    this.mypageAddress = new MypageAddressStore(this, initialState);
    // mypage - 찜한상품
    this.mypageLike = new MypageLikeStore(this, initialState);

    this.toast = new ToastStore(this, initialState);
    this.history = new RouteHistoryStore(this, initialState);
    this.main = new MainStore(this, initialState);
    this.keyword = new KeywordStore(this, initialState);

    // 배송지

    this.address = new AddressStore(this, initialState);

    //판매자 문의하기
    this.sellerClaim = new SellerClaimStore(this, initialState);

    //무이자정보
    this.cardinterest = new CardInterestStore(this, initialState);

    // 이벤트 메인
    this.eventmain = new EventMainStore(this, initialState);
    this.luckyDraw = new LuckyDrawStore(this, initialState);
  }
}

export { root } from '../store';

export default RootStore;
