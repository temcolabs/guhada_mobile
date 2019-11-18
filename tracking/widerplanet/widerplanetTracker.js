import { devLog } from '../../common/devLog';
import detectDevice from '../../common/detectDevice';
import { isBrowser } from '../../common/isServer';
import loadScript, { scriptIds } from '../../common/loadScript';

/**
 * http://tg.widerplanet.com/track/manual.php

  FAQ
  > 쇼핑몰인데 어떤 트래킹 태그를 삽입해야 하나요?
  공통, 아이템, 장바구니, 구매완료 총 4종류의 트래킹 태그를 설치하시면 되겠습니다.

  > 쇼핑몰이 아닌 일반 사이트인데 어떤 트래킹 태그를 삽입해야 하나요?
  공통 트래킹 태그와 전환 완료 트래킹 태그, 이렇게 2종류의 트래킹 태그를 설치하시면 됩니다.
  전환 완료 트래킹 태그는 전환 체크를 원하시는 페이지에 각각 설치하시면 되겠습니다.

  > 구매 완료 트래킹 태그와 전환 완료 트래킹 태그의 다른 점이 무엇인가요?
  마지막 라인 JS를 임포트 하는 부분로 async defer 속성 사용 여부가 두 트래킹 태그의 차이점입니다.
  메시지 팝업창을 띄우고 페이지를 이동시키는 경우 전환 완료 트래킹 태그를 설치하여야 합니다.

  > 전환 완료 페이지가 하나인데 전환의 종류는 여러개 입니다. 하나의 전환 완료 트래킹 태그만 설치해야 하나요?
  전환 트래킹 태그를 하나만 삽입 해야하며, 전환의 종류를 식별할 수 있도록 상품 식별 번호와 상품명을 각 전환마다 다르게 처리하시면 됩니다.
  전환 처리 파일 또는 전환 완료 페이지가 여러 개 존재한다면 전환 트래킹 태그 또한 각각 설치하셔야 합니다.
  주의하실 점은 전환 완료 페이지가 존재하지 않고 메시지 창을 띄운 후 페이지를 이동시키는 경우, 완료 메시지 창을 띄우는 소스 코드 이전에 전환 트래킹 태그를 삽입하여야 한다는 점입니다.

  > 사이트 특성상 Footer 파일이 없습니다. 한 파일에 홈 트래킹 태그와 다른 트래킹 태그(아이템, 장바구니, 전환)를 같이 삽입하여도 되나요?
  네, 문제없습니다. 공통 트래킹 태그와 그 외 트래킹 태그(아이템, 장바구니, 전환)가 동시에 한 페이지에 설치되어 있는 경우 공통 트래킹 태그는 실행되지 않도록 설계되어있습니다.

  > HTTPS 프로토콜을 사용하는데 추가적인 수정 없이도 트래킹 태그가 정상적으로 작동되나요?
  네, 정상 작동합니다. HTTPS 프로토콜 처리가 되어있습니다.

  > 트래킹 태그 설치 완료하였는데 확인은 어떻게 하나요?
  "Script 설치 후 체크" 메뉴에서 확인하실 수 있습니다.
 */

// 계정 아이디
const ACCOUNT_ID = 47494;

// 트래커 주소
const WIDER_PLANET_TRACKER_URL = '//cdn-aitg.widerplanet.com/js/wp_astg_4.0.js';

const getDeviceType = () => {
  const { isMobile } = detectDevice();
  const deviceType = isMobile ? 'mobile' : 'web';

  devLog('> deviceType for criteo tracker:', deviceType);
  return deviceType;
};

export default {
  /**
   * 공통 (쇼핑몰, 일반 사이트)
사이트 모든 영역에서 공통적으로 사용되는 파일 하단에 설치합니다. (수정없이 그대로 복사&붙여넣기 해주세요)
(footer 또는 bottom 과 같은 이름의 파일이며, index 파일 또는 main 파일에서 include 되는 파일입니다.)
* 공통 태그는 타 태그(아이템, 장바구니, 구매완료, 전환 완료)보다 하단에 위치하여야 합니다.
   */
  common: ({ userId } = {}) => {
    devLog(`[widerplanet tracker] userId`, userId);

    if (isBrowser) {
      loadScript(null, {
        id: scriptIds.WIDERPLANET_TRACKER + '_common_conversion',
        async: false,
        innerHTML: `
            var wptg_tagscript_vars = wptg_tagscript_vars || [];
            wptg_tagscript_vars.push(function() {
              return {
                /*고객넘버 등 Unique ID (ex. 로그인  ID, 고객넘버 등 )를 암호화하여 대입. *주의 : 로그인 하지 않은 사용자는 어떠한 값도 대입하지 않습니다.*/
                wp_hcuid: ${userId},
                ti: ${ACCOUNT_ID} /*광고주 코드 */,
                ty: "Home" /*트래킹태그 타입 */,
                device: "${getDeviceType()}" /*디바이스 종류  (web 또는  mobile)*/,
              };
            });
          `,
      });

      loadScript(WIDER_PLANET_TRACKER_URL, {
        async: true,
        id: scriptIds.WIDERPLANET_TRACKER,
      });
    }
  },

  /**
   * 아이템 상세 (쇼핑몰)
    상품 상세페이지 하단에 삽입하신 후 '상품 ID', '상품명' 변수를 'i', 't'에 대입합니다.
   */
  productDetail: ({ dealId, userId, items = [] } = {}) => {
    if (isBrowser) {
      loadScript(null, {
        id: scriptIds.WIDERPLANET_TRACKER + '_producdetail_conversion',
        async: false,
        innerHTML: `
            var wptg_tagscript_vars = wptg_tagscript_vars || [];
            wptg_tagscript_vars.push(
            (function() {
              return {
                /* 고객넘버 등 Unique ID (ex. 로그인  ID, 고객넘버 등 )를 암호화하여 대입. *주의 : 로그인 하지 않은 사용자는 어떠한 값도 대입하지 않습니다.*/
                wp_hcuid: ${userId || ''},
                ti: ${ACCOUNT_ID},
                ty: "Item",
                device: "${getDeviceType()}",
                items: ${items},
                // items:[{i:"상품 ID",	t:"상품명 "}] /* i:<상품 식별번호  (Feed로 제공되는 상품코드와 일치하여야 합니다 .) t:상품명  */
              };
            }));
          `,
      });

      loadScript(WIDER_PLANET_TRACKER_URL, {
        async: true,
        id: scriptIds.WIDERPLANET_TRACKER,
      });
    }
  },

  /**
   * 장바구니 (쇼핑몰)
상품 리스트가 나오는 장바구니 페이지에 삽입합니다.

   */
  cart: ({ userId, items = [] } = {}) => {
    if (isBrowser) {
      loadScript(null, {
        id: scriptIds.WIDERPLANET_TRACKER + '_cart_conversion',
        async: false,
        innerHTML: `
            var wptg_tagscript_vars = wptg_tagscript_vars || [];
            wptg_tagscript_vars.push(
            (function() {
              return {
                wp_hcuid: ${userId || ''},
                /*고객넘버 등 Unique ID (ex. 로그인  ID, 고객넘버 등 )를 암호화하여 대입. *주의 : 로그인 하지 않은 사용자는 어떠한 값도 대입하지 않습니다.*/
                ti:${ACCOUNT_ID},
                ty:"Cart",
                device:"${getDeviceType()}",
                items: ${items},
                // items:[
                //   {i:"상품 ID",	t:"상품명 "} /* 첫번째 상품  - i:상품 식별번호  (Feed로 제공되는 식별번호와 일치 ) t:상품명 */
                //  ,{i:"상품 ID",	t:"상품명 "} /* 두번째 상품  - i:상품 식별번호  (Feed로 제공되는 식별번호와 일치 ) t:상품명  */
                // ]
              };
            }));
          `,
      });

      loadScript(WIDER_PLANET_TRACKER_URL, {
        async: true,
        id: scriptIds.WIDERPLANET_TRACKER,
      });
    }
  },

  /**
   * 구매완료 (쇼핑몰)
구매한 상품 개수만큼 ',{i:"상품ID", t:"상품명", p:"단가", q:"수량"}' 을 동적으로 생성해주셔야 하며, i, t, p, q 각각의 값에 해당 변수를 대입합니다.
(구매 완료 페이지가 존재하지 않고 완료 메시지 창을 띄운 후 다른 페이지로 이동해버리는 경우 전환 완료 트래킹 태그를 설치하여야 합니다.)
   */
  purchaseComplete: ({ userId, dealId, items } = {}) => {
    if (isBrowser) {
      loadScript(null, {
        id: scriptIds.WIDERPLANET_TRACKER + '_purchase_complete_conversion',
        async: false,
        innerHTML: `
            var wptg_tagscript_vars = wptg_tagscript_vars || [];
            wptg_tagscript_vars.push(
            (function() {
              return {
                wp_hcuid: ${userId || ''},
                /*고객넘버 등 Unique ID (ex. 로그인  ID, 고객넘버 등 )를 암호화하여 대입. *주의 : 로그인 하지 않은 사용자는 어떠한 값도 대입하지 않습니다.*/
                ti:${ACCOUNT_ID},
                ty:"PurchaseComplete",
                device:"${getDeviceType()}",
                items: ${items},
                // items:[
                //   {i:"상품 ID", t:"상품명 ", p:"단가 ", q:"수량 "} /* 첫번째 상품  - i:상품 식별번호 (Feed로 제공되는 식별번호와 일치 ) t:상품명  p:단가  q:수량  */
                //   ,{i:"상품 ID", t:"상품명 ", p:"단가 ", q:"수량 "} /* 첫번째 상품  - i:상품 식별번호 (Feed로 제공되는 식별번호와 일치 ) t:상품명  p:단가  q:수량  */
                // ]
              };
            }));
          `,
      });

      loadScript(WIDER_PLANET_TRACKER_URL, {
        async: true,
        id: scriptIds.WIDERPLANET_TRACKER,
      });
    }
  },
};
