/**
 * 라우트 정의
 *
 * pagePath: /page 폴더 안에 있는 컴포넌트 경로. Link 컴포넌트의 href 속성.
 * asPath(=as): 브라우저 url에 표시되는 경로. Link 컴포넌트의 as 속성. 없으면 pagePath가 된다.
 */
module.exports = [
  {
    // 홈 화면
    pagePath: '/index',
    asPath: '/',
  },

  // 리턴 URL
  {
    // 나이스 본인인증 성공
    pagePath: '/returnUrl/niceAuthSuccess',
    asPath: '/phone-certification-result',
  },

  // 로그인
  {
    pagePath: '/login/login',
    asPath: '/login',
    name: '로그인',
  },

  // 회원가입
  {
    pagePath: '/login/signup',
    asPath: '/login/signup',
    name: '회원가입',
  },

  // 아이디 찾기
  {
    pagePath: '/login/findid',
    asPath: '/login/findid',
    name: '아이디 찾기',
  },

  // 아이디 찾기 결과
  {
    pagePath: '/login/findidresult',
    asPath: '/login/findidresult',
    name: '아이디 찾기 결과',
  },

  // 패스워드 찾기
  {
    pagePath: '/login/findpassword',
    asPath: '/login/findpassword',
    name: '패스워드 찾기',
  },

  // 패스워드 찾기 결과
  {
    pagePath: '/login/findpasswordresult',
    asPath: '/login/findpasswordresult',
    name: '패스워드 찾기 결과',
  },

  // 마이페이지
  {
    pagePath: '/mypage/MyPageMain',
    asPath: '/mypage',
    name: '마이페이지',
  },

  // 마이페이지 - 나의 주문
  {
    pagePath: '/mypage/OrderListInProgress',
    asPath: '/mypage/orders/inprogress',
    name: '주문배송',
  },

  {
    pagePath: '/mypage/OrderDetail',
    asPath: '/mypage/orders/detail/:purchaseId',
    name: '주문내역',
  },

  {
    pagePath: '/mypage/OrderListCanceled',
    asPath: '/mypage/orders/cancel-exchange-return',
    name: '취소, 교환, 반품',
  },

  {
    pagePath: '/mypage/OrderCancelForm',
    asPath: '/mypage/orders/cancel/form/:purchaseId',
    name: '취소 신청',
  },
  {
    pagePath: '/mypage/OrderCancelDone',
    asPath: '/mypage/orders/cancel/done/:purchaseId',
    name: '취소 신청 완료',
  },

  {
    pagePath: '/mypage/OrderExchangeForm',
    asPath: '/mypage/orders/exchange/form/:purchaseId',
    name: '교환 신청',
  },
  {
    pagePath: '/mypage/OrderExchangeDone',
    asPath: '/mypage/orders/exchange/done/:purchaseId',
    name: '교환 신청 완료',
  },
  {
    pagePath: '/mypage/OrderReturnForm',
    asPath: '/mypage/orders/return/form/:purchaseId',
    name: '반품 신청',
  },
  {
    pagePath: '/mypage/OrderReturnDone',
    asPath: '/mypage/orders/return/done/:purchaseId',
    name: '반품 신청 완료',
  },

  // 마이페이지 - 나의 혜택
  {
    pagePath: '/mypage/PointHistory',
    asPath: '/mypage/point',
    name: '포인트',
  },
  {
    pagePath: '/mypage/PointChargeHistory',
    asPath: '/mypage/point/charge',
    name: '포인트 충전',
  },
  {
    pagePath: '/mypage/CouponList',
    asPath: '/mypage/coupon',
    name: '쿠폰',
  },
  {
    pagePath: '/mypage/CouponEvents',
    asPath: '/mypage/coupon/event',
    name: '쿠폰 - 이벤트',
  },
  {
    pagePath: '/mypage/Token',
    asPath: '/mypage/token',
    name: '토큰',
  },

  // 나의 활동
  {
    pagePath: '/mypage/ProductLikeList',
    asPath: '/mypage/likes',
    name: '찜한 상품',
  },
  {
    pagePath: '/mypage/FollowingStoreList',
    asPath: '/mypage/followings',
    name: '팔로우한 스토어',
  },
  {
    pagePath: '/mypage/RecenltySeenProductList',
    asPath: '/mypage/recents',
    name: '최근 본 상품',
  },

  // 마이페이지 - 나의 글
  {
    pagePath: '/mypage/ProductReview',
    asPath: '/mypage/review',
    name: '상품 리뷰',
  },
  {
    pagePath: '/mypage/ClaimPageMain',
    asPath: '/mypage/claim',
    name: '상품 문의',
  },
  {
    pagePath: '/mypage/Chatting',
    asPath: '/mypage/chatting',
    name: '채팅',
  },

  // 마이페이지 - 회원 정보
  {
    pagePath: '/mypage/AddressManagement',
    asPath: '/mypage/address',
    name: '배송지 관리',
  },
  {
    pagePath: '/mypage/Membership',
    asPath: '/mypage/membership',
    name: '회원 등급',
  },
  {
    pagePath: '/mypage/UserInfomation',
    asPath: '/mypage/me',
    name: '회원정보 수정',
  },

  // 상품 - 상세페이지
  {
    pagePath: '/product/productdetail',
    asPath: '/product/productdetail',
  },

  // 장바구니
  {
    pagePath: '/shoppingcart/shoppingcart',
    asPath: '/shoppingcart',
  },
];
