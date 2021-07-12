const sns = require('./sns');

// 검색엔진 최적화를 위한 상수
module.exports = {
  TITLE: '구하다',
  DESCRIPTION:
    '유럽 부티크 신상이 실시간 업데이트되는 블록체인 기반의 똑똑한 명품 직구 플랫폼',

  // window.location.origin에 해당하는 값
  BASE_URL: process.env.BASE_URL,

  // 키워드
  KEYWORDS:
    '명품, 쇼핑몰, 패션, 럭셔리, 트렌드, 쇼핑, 명품시계, 정품, 명품가방, 버킷백, 벨트, 명품쇼핑, 중고명품, 세일, 쿠폰, 특가, 기획전, 프리미엄',

  // 제작자
  AUTHOR: '구하다',

  // 기본 메인 이미지
  MAIN_IMAGE: `/public/appicon/guhada-icon-512.png`,

  GOOGLE_SITE_VERIFICATION: 'pNZ8iQTxAxE_4Le0CrNz7CKZYbK77vs-AUr_gTHFjKA',
  NAVER_SITE_VERIFICATION: '1afd6b85b3b1b6b0030bc86e1c392cd057b33b4c',

  FB_APP_ID: sns.snsAppKey.FACEBOOK,
  APP_NAME: '구하다',

  // iOS 앱 정보
  IOS_APPSTORE_ID: 'id1478120259',
  IOS_APP_NAME: '구하다',
  // 안드로이드 앱  정보
  ANDROID_APP_NAME: 'io.temco.guhada',
  ANDROID_PACKAGE_ID: '구하다`',
};
