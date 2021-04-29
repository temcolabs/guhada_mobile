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
    name: '구하다 홈',
  },

  {
    // 홈 여성
    pagePath: '/index',
    asPath: '/home/women',
    name: '홈 여성',
  },

  {
    // 홈 남성
    pagePath: '/index',
    asPath: '/home/men',
    name: '홈 남성',
  },

  {
    // 홈 키즈
    pagePath: '/index',
    asPath: '/home/kids',
    name: '홈 키즈',
  },

  {
    // 선뭃하기
    pagePath: '/gift',
    asPath: '/gift',
    name: '선물하기',
  },

  {
    // 타임딜
    pagePath: '/home/timedeal',
    asPath: '/event/timedeal',
    name: '타임딜',
  },
  // ============================================================
  // 이벤트 - 타임딜_단독페이지
  // ============================================================
  {
    pagePath: `/event/timedealsingle`,
    asPath: `/event/timedealevent`,
  },
  // 이벤트 - 메인
  {
    pagePath: `/event/eventmain`,
    asPath: `/event`,
    name: `이벤트`,
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
  // 네이버 로그인 콜백
  {
    pagePath: '/login/callbacknaver',
    asPath: '/callbacknaver',
    name: '네이버 로그인 콜백',
  },
  // 약관동의
  {
    pagePath: '/login/termagreesns',
    asPath: '/login/termagreesns',
    name: '약관동의',
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

  // 약관 동의
  {
    pagePath: '/login/term',
    asPath: '/login/term',
    name: '약관 동의',
  },

  // 검색 결과
  {
    pagePath: '/search/search',
    asPath: '/search',
    name: '검색 결과',
  },

  // ============================================================
  // 마이페이지
  // ============================================================
  // 마이페이지 - 메인
  {
    pagePath: `/mypage`,
    asPath: `/mypage`,
    name: `마이페이지`,
  },
  // 마이페이지 - 나의 주문
  {
    pagePath: `/mypage/OrderCompleteList`,
    asPath: `/mypage/orders/complete/list`,
    name: '주문배송',
  },

  {
    pagePath: `/mypage/OrderCompleteDetail`,
    asPath: `/mypage/orders/complete/detail/:purchaseId`,
    name: `주문내역 상세`,
  },

  // *클레임 관련 라우트
  {
    pagePath: `/mypage/OrderClaimList`,
    asPath: `/mypage/orders/claim/list`,
    name: `취소 ・ 교환 ・ 반품`,
  },
  {
    pagePath: `/mypage/OrderClaimDetail`,
    asPath: `/mypage/orders/claim/detail`,
    name: `취소 ・ 교환 ・ 반품 상세`,
  },
  {
    pagePath: `/mypage/OrderCancelForm`,
    asPath: `/mypage/orders/claim/cancel/form`,
    name: `취소 신청`,
  },
  {
    pagePath: `/mypage/OrderCancelDone`,
    asPath: `/mypage/orders/claim/cancel/done`,
    name: `취소 신청 완료`,
  },
  {
    pagePath: `/mypage/OrderExchangeForm`,
    asPath: `/mypage/orders/claim/exchange/form`,
    name: `교환 신청`,
  },
  {
    pagePath: `/mypage/OrderExchangeForm`,
    asPath: `/mypage/orders/claim/exchange-edit/form`,
    name: `교환 신청 수정`,
  },
  {
    pagePath: `/mypage/OrderExchangeDone`,
    asPath: `/mypage/orders/claim/exchange/done`,
    name: `교환 신청 완료`,
  },
  {
    pagePath: `/mypage/OrderReturnForm`,
    asPath: `/mypage/orders/claim/return/form`,
    name: `반품 신청`,
  },
  {
    pagePath: `/mypage/OrderReturnForm`,
    asPath: `/mypage/orders/claim/return-edit/form`,
    name: `반품 신청 수정`,
  },
  {
    pagePath: `/mypage/OrderReturnDone`,
    asPath: `/mypage/orders/claim/return/done`,
    name: `반품 신청 완료`,
  },

  // 마이페이지 - 나의 혜택
  {
    pagePath: `/mypage/PointHistory`,
    asPath: `/mypage/point`,
    name: `포인트`,
  },
  {
    pagePath: `/mypage/PointChargeHistory`,
    asPath: `/mypage/point/charge`,
    name: `포인트 충전`,
  },
  {
    pagePath: `/mypage/CouponList`,
    asPath: `/mypage/coupon`,
    name: `쿠폰`,
  },
  {
    pagePath: `/mypage/CouponEvents`,
    asPath: `/mypage/coupon/event`,
    name: `쿠폰 - 이벤트`,
  },
  {
    pagePath: `/mypage/Token`,
    asPath: `/mypage/token`,
    name: `토큰`,
  },

  // 나의 활동
  {
    pagePath: `/mypage/ProductLikeList`,
    asPath: `/mypage/likes`,
    name: `찜한 상품`,
  },
  {
    pagePath: `/mypage/FollowStore`,
    asPath: `/mypage/follows`,
    name: `팔로우한 스토어`,
  },
  {
    pagePath: `/mypage/RecentlySeenList`,
    asPath: `/mypage/recents`,
    name: `최근 본 상품`,
  },

  // 마이페이지 - 나의 글
  {
    pagePath: `/mypage/ProductReview`,
    asPath: `/mypage/review`,
    name: `리뷰`,
  },
  {
    pagePath: `/mypage/ClaimPageMain`,
    asPath: `/mypage/claim`,
    name: `문의`,
  },
  {
    pagePath: `/mypage/Chatting`,
    asPath: `/mypage/chatting`,
    name: `채팅`,
  },

  // 마이페이지 - 회원 정보
  {
    pagePath: `/mypage/AddressManagement`,
    asPath: `/mypage/address`,
    name: `배송지 관리`,
  },
  // {
  //   pagePath: `/mypage/Membership`,
  //   asPath: `/mypage/membership`,
  //   name: `회원 등급`,
  // },
  // TODO: 회원정보 수정은 API가 완료되면 작업 진행
  {
    pagePath: `/mypage/UserInfomation`,
    asPath: `/mypage/me`,
    name: `회원정보 수정`,
  },

  // 상품 - 상세페이지
  {
    pagePath: '/product/productdetail',
    asPath: '/productdetail',
  },

  // 장바구니
  {
    pagePath: '/shoppingcart/shoppingcart',
    asPath: '/shoppingcart',
  },

  // 주문결제
  {
    pagePath: '/orderpayment/orderpayment',
    asPath: '/orderpayment',
  },

  // 주문성공
  {
    pagePath: '/orderpaymentsuccess/orderpaymentsuccess',
    asPath: '/orderpaymentsuccess',
  },

  // 셀러스토어 - 셀러스토어
  {
    pagePath: `/sellerstore/SellerStorePage`,
    asPath: `/store/:nickname`,
    name: `셀러스토어`,
  },

  //이벤트 - 상세페이지
  {
    pagePath: `/event/eventdetail`,
    asPath: `/event/detail/:id`,
    name: `이벤트 - 상세페이지`,
  },

  {
    pagePath: `/event/luckydraw`,
    asPath: `/event/luckydraw`,
    name: `럭키드로우`,
  },

  // ============================================================
  // 기획전
  // ============================================================
  {
    pagePath: `/event/special`,
    asPath: `/event/special`,
    name: `기획전`,
  },
  {
    pagePath: `/event/specialdetail`,
    asPath: `/event/special/:id`,
    name: `기획전 상세페이지`,
  },

  // ============================================================
  // 커뮤니티
  // ============================================================
  // 커뮤니티 루트
  {
    pagePath: `/community`,
    asPath: `/community`,
    name: `커뮤니티`,
  },

  // 게시판 글쓰기 에디터
  {
    pagePath: `/community/BBSEditor`,
    asPath: `/community/editor`,
    name: `글쓰기`,
  },

  // 커뮤니티 - 게시판. 게시판 이름(board) 파라미터로 구분
  {
    pagePath: `/community/BBSList`,
    asPath: `/community/board/:categoryId`,
    name: ``,
  },

  // 커뮤니티 - 게시판 글 조회
  {
    pagePath: `/community/BBSArticleView`,
    asPath: `/community/article/:id`,
    name: ``,
  },
];
