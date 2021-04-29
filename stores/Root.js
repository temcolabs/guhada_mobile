import UserStore from './UserStore';
import UiStatus from './UiStatus';
import LoginStore from './LoginStore';
import BrandsStore from './BrandsStore';
import CategoryStore from './CategoryStore';
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
import SellerReviewStore from './productdetail/SellerReviewStore';

import CartAndPurchaseStore from './productdetail/CartAndPurchaseStore';
import ShoppingCartSuccessModalStore from './productdetail/ShoppingCartSuccessModalStore';
import AlertStore from './AlertStore';
import BookMarkStore from './BookMarkStore';
import AuthMobileStore from './AuthMobileStore';
import CustomerAuthenticationStore from './orderpayment/CustomerAuthenticationStore';

import OrderCompleteListStore from './myOrder/OrderCompleteListStore';
import OrderCompleteDetailStore from './myOrder/OrderCompleteDetailStore';
import OrderClaimFormStore from './myOrder/OrderClaimFormStore';
import OrderClaimListStore from './myOrder/OrderClaimListStore';
import MypagePointStore from './mypage/MypagePointStore.js';
import MypagePointChargeStore from './mypage/MypagePointChargeStore.js';
import MypageReviewStore from './mypage/MypageReviewStore';
import MypageCouponStore from './mypage/MypageCouponStore';
import MypageAddressStore from './mypage/MypageAddressStore';
import ProductRecentlySeenStore from './ProductRecentlySeenStore';
import MypageLikeStore from './mypage/MypageLikeStore';
import MypageRecentlySeenStore from './mypage/MypageRecentlySeenStore';
import MypageSellerClaimStore from './mypage/MypageSellerClaimStore';
import MypageFollowStore from './mypage/MypageFollowStore';
import MypageDashboardStore from './mypage/MypageDashboardStore';
import MypageTokenStore from './mypage/MypageTokenStore';
import MypageInquirieStore from './mypage/MypageInquirieStore';
import MySizeStore from './mypage/MySizeStore';
import MypageDeliveryStore from './mypage/MypageDeliveryStore';

import CountdownStore from './CountdownStore';
import ToastStore from './ToastStore';
import RouteHistoryStore from './RouteHistoryStore';
import MainStore from './MainStore';
import KeywordStore from './home/KeywordStore';
import AddressStore from './address/AddressStore';
import GiftStore from './GiftStore';
import SellerStore from './SellerStore';
import SellerClaimStore from './claim/SellerClaimStore';
import UserClaimStore from './claim/UserClaimStore';
import CardInterestStore from './CardInterestStore';

import EventMainStore from './event/EventMainStore';
import LuckyDrawStore from './event/LuckyDrawStore';
import EventPopupStore from './event/EventPopupStore';
import TimeDealStore from './event/TimeDealStore';
//기획전
import SpecialStore from './event/SpecialStore';
import SearchPlaceholderStore from './home/SearchPlaceholderStore';
// 커뮤니티
import BBSStore from './bbs';

// 신고하기
import ReportStore from './claim/ReportStore';

class RootStore {
  constructor(isServer, initialState) {
    this.user = new UserStore(this, initialState);
    this.uistatus = new UiStatus(this, initialState);
    this.login = new LoginStore(this, initialState);
    this.brands = new BrandsStore(this, initialState);
    this.category = new CategoryStore(this, initialState);
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
    this.sellerReview = new SellerReviewStore(this, initialState);

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
    this.gift = new GiftStore(this, initialState);
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

    /**
     * 마이페이지
     */
    // 나의 주문
    this.orderCompleteList = new OrderCompleteListStore(this, initialState); // 나의주문
    this.orderCompleteDetail = new OrderCompleteDetailStore(this, initialState); // 상품상세
    this.orderClaimList = new OrderClaimListStore(this, initialState); // 취소 ・ 교환 ・ 반품 리스트
    this.orderClaimForm = new OrderClaimFormStore(this, initialState); // 취소 ・ 교환 ・ 반품 신청

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
    this.mypageInquiry = new MypageInquirieStore(this, initialState); // 문의
    this.mypageRecentlySeen = new MypageRecentlySeenStore(this, initialState); // 최근본상품
    this.mySize = new MySizeStore(this, initialState); // 내 사이즈 정보
    this.myDelivery = new MypageDeliveryStore(this, initialState); // 배송정보 스토어
    this.mypageFollow = new MypageFollowStore(this, initialState); // 팔로우 스토어
    this.mypageDashboard = new MypageDashboardStore(this, initialState); // 상단 대시보드
    this.mypageSellerClaim = new MypageSellerClaimStore(this, initialState); // 판매자 문의하기
    this.mypageToken = new MypageTokenStore(this, initialState); // 토큰

    this.toast = new ToastStore(this, initialState);
    this.history = new RouteHistoryStore(this, initialState);
    this.main = new MainStore(this, initialState);
    this.keyword = new KeywordStore(this, initialState);

    // 배송지

    this.address = new AddressStore(this, initialState);

    this.sellerClaim = new SellerClaimStore(this, initialState); // 판매자 문의하기
    this.userClaim = new UserClaimStore(this, initialState); // 유저 문의하기
    this.report = new ReportStore(this, initialState); // 신고하기

    //무이자정보
    this.cardinterest = new CardInterestStore(this, initialState);

    // 이벤트 메인
    this.eventmain = new EventMainStore(this, initialState);
    this.luckyDraw = new LuckyDrawStore(this, initialState);
    this.eventpopup = new EventPopupStore(this, initialState);
    this.timedeal = new TimeDealStore(this, initialState);

    //기획전
    this.special = new SpecialStore(this, initialState);
    this.searchHolder = new SearchPlaceholderStore(this, initialState);

    /**
     * 커뮤니티
     */
    this.bbs = new BBSStore(this, initialState);
  }
}

export { root } from '../store';

export default RootStore;
