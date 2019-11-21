const sns = require('./sns');

// 검색엔진 최적화를 위한 상수
module.exports = {
  title: '구하다',
  description:
    '명품 특가 타임딜! 정품 100% 보장! 전 상품 무료 배송! 명품쇼핑의 즐거움을 구하다',

  // window.location.origin에 해당하는 값
  baseUrl: process.env.BASE_URL,

  // 키워드
  keywords:
    '명품, 쇼핑몰, 패션, 럭셔리, 트렌드, 쇼핑, 명품시계, 정품, 명품가방, 버킷백, 벨트, 명품쇼핑, 중고명품, 세일, 쿠폰, 특가, 기획전, 프리미엄',

  // 제작자
  author: '구하다',

  // 기본 메인 이미지
  mainImage: `/static/Guhada-LOGO.png`,

  fbAppId: sns.snsAppKey.FACEBOOK,
  appName: '구하다',

  // TODO: 앱 아이디
  appstoreId: undefined, // iOS 앱
  androidPackageId: undefined, // 안드로이드 앱 패키지 아이디
};
