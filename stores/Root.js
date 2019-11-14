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

import LuckyDrawStore from './event/LuckyDrawStore';

class RootStore {
  constructor() {
    this.user = new UserStore(this);
    this.uistatus = new UiStatus(this);
    this.login = new LoginStore(this);
    this.brands = new BrandsStore(this);
    this.category = new CategoryStore(this);
    this.search = new SearchStore(this);
    this.searchitem = new SearchItemStore(this);
    this.productdetail = new ProductDetailStore(this);
    this.orderpayment = new OrderPaymentStore(this);
    this.orderPaymentBenefit = new OrderPaymentBenefitStore(this);
    this.orderpaymentsuccess = new OrderPaymentSuccessStore(this);
    this.cartAndPurchase = new CartAndPurchaseStore(this);
    this.shoppingCartSuccessModal = new ShoppingCartSuccessModalStore(this);
    this.shoppingcart = new ShoppingCartStore(this);
    this.productreview = new ProductReviewStore(this);
    this.productoption = new ProductOptionStore(this);
    // 상품 상세
    this.productDetailLike = new ProductDetailLikeStore(this);
    this.productDetailBookmark = new ProductDetailBookmarkStore(this);
    this.productDetailGallery = new ProductDetailGalleryStore(this);
    this.sellerfollow = new SellerFollowStore(this);

    this.seller = new SellerStore(this);
    this.alert = new AlertStore(this);
    this.bookmark = new BookMarkStore(this);
    this.authmobile = new AuthMobileStore(this);
    this.customerauthentication = new CustomerAuthenticationStore(this);
    this.countdown = new CountdownStore(this);

    // order payment - 사이드 탭
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
    this.history = new RouteHistoryStore(this);
    this.main = new MainStore(this);
    this.keyword = new KeywordStore(this);

    // 배송지

    this.address = new AddressStore(this);

    //판매자 문의하기
    this.sellerClaim = new SellerClaimStore(this);

    //무이자정보
    this.cardinterest = new CardInterestStore(this);

    /**
     * 이벤트
     */
    this.luckydraw = new LuckyDrawStore(this);
  }
}

export { root } from '../store';

export default RootStore;
