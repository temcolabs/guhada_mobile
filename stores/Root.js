import UserStore from './UserStore';
import UiStatus from './UiStatus';
import LoginStore from './LoginStore';
import BrandsStore from './BrandsStore';
import CategoryStore from './CategoryStore';
import SearchStore from './SearchStore';
import SearchItemStore from './SearchItemStore';
import ProductAddStore from './ProductAddStore';
import ProductDetailStore from './ProductDetailStore';
import OrderPaymentStore from './orderpayment/OrderPaymentStore';
import OrderPaymentSuccessStore from './OrderPaymentSuccessStore';
import ShoppingCartStore from './ShoppingCartStore';
import ProductReviewStore from './productdetail/ProductReviewStore';
import ProductOptionStore from './productdetail/ProductOptionStore';
import ProductDetailLikeStore from './productdetail/ProductDetailLikeStore';
import AlertStore from './AlertStore';
import BookMarkStore from './BookMarkStore';
import AuthMobileStore from './AuthMobileStore';
import CustomerAuthenticationStore from './orderpayment/CustomerAuthenticationStore';
import SideTabStore from './orderpayment/SideTabStore';
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

class RootStore {
  constructor() {
    this.user = new UserStore(this);
    this.uistatus = new UiStatus(this);
    this.login = new LoginStore(this);
    this.brands = new BrandsStore(this);
    this.category = new CategoryStore(this);
    this.search = new SearchStore(this);
    this.searchitem = new SearchItemStore(this);
    this.productadd = new ProductAddStore(this);
    this.productdetail = new ProductDetailStore(this);
    this.orderpayment = new OrderPaymentStore(this);
    this.orderpaymentsuccess = new OrderPaymentSuccessStore(this);
    this.shoppingcart = new ShoppingCartStore(this);
    this.productreview = new ProductReviewStore(this);
    this.productoption = new ProductOptionStore(this);
    this.productDetailLike = new ProductDetailLikeStore(this);
    this.alert = new AlertStore(this);
    this.bookmark = new BookMarkStore(this);
    this.authmobile = new AuthMobileStore(this);
    this.customerauthentication = new CustomerAuthenticationStore(this);
    this.countdown = new CountdownStore(this);

    // order payment - 사이드 탭
    this.sidetab = new SideTabStore(this);
    this.productRecentlySeen = new ProductRecentlySeenStore(this);

    // 나의 주문
    // mypage - 나의주문
    this.myOrderList = new MyOrderListStore(this);
    // mypage - 상품상세
    this.myOrderDetail = new MyOrderDetailStore(this);
    // mypage - 포인트
    this.mypagePoint = new MypagePointStore(this);
    // mypage - 충전
    this.mypagePointCharge = new MypagePointChargeStore(this);
    // mypage - 리뷰
    this.mypagereview = new MypageReviewStore(this);
    // mypage - 쿠폰
    this.mypageCoupon = new MypageCouponStore(this);
    // mypage - 배송지관리
    this.mypageAddress = new MypageAddressStore(this);
    // mypage - 찜한상품
    this.mypageLike = new MypageLikeStore(this);

    this.toast = new ToastStore(this);
  }
}

export default RootStore;
