import loadScript, { scriptIds } from 'childs/lib/dom/loadScript';
import detectDevice from 'childs/lib/detectDevice';
import { devLog } from 'lib/devLog';
import isEmailString from 'childs/lib/isEmailString';

// 트래커 주소
const CRITEO_TRACKER_URL = '//static.criteo.net/js/ld/ld.js';

const getDeviceType = () => {
  const { isTablet, isMobile } = detectDevice();
  const deviceType = isTablet ? 't' : isMobile ? 'm' : 'd';

  devLog('> deviceType for criteo tracker:', deviceType);
  return deviceType;
};

// 크리테오 계정 아이디
const CRITEO_ACCOUNT_ID = 65280;

/**
 * 제품 아이디는 문자열이어야 한다.
 * @param {*} id
 */
const formatProductId = id => {
  return !!id ? String(id) : '';
};

/**
 * 가격은 소수점 둘째자리까지
 * @param {*} price
 */
const formatPrice = price => {
  return typeof price === 'number' ? price.toFixed(2) : price;
};

/**
 * SNS 가입 사용자는 이메일 필드에 다른 데이터가 들어있을 수 있다.
 */
const formatEmail = email => {
  return isEmailString(email) ? email : '';
};

/**
 *
 * * 가격은 소수점 둘째자리까지 변환. 문자열
 * * 제품 아이디는 문자열
 * * 사이트 타입: 모바일용의 m, 테블릿용의 t, 데스크탑용의 d
 * ! email이 필요한 트래킹은 로그인한 상태에서만 실행한다.
 *
 * 태그 설정 Criteo OneTag는 설정하기 쉽습니다. 대부분의 사이트에서 절차는 20분에서 2시간 정도 걸립니다.
 * https://integrate.criteo.com/home/tags/implement?advertiserId=59668&partnerId=65280
 *
 */
export default {
  /**
   * 홈페이지
    귀하 홈페이지의 코드를 실행합니다. 귀하 사이트의 어느 버전이 setSiteType를 통해 표시되는지 나타냅니다. 모바일용의 m, 테블릿용의 t, 데스크탑용의 d의 용도. setEmail에서, MD5 해시 함수를 이용하여 고객 email 주소나암호화된 email 주소를 전달합니다. setAccount 파라미터는 귀하 계정의 고유 ID입니다.

    @param email 사용자 이메일
    @param userId 사용자 아이디
    @param type 타입. 데스크탑 d, 모바일 m, 태블릿 t
   */
  homepage: ({ email = '' }) => {
    loadScript(CRITEO_TRACKER_URL, {
      id: scriptIds.CRITEO_TRACKER,
      async: true,
      onLoad: () => {
        const params = [
          { event: 'setAccount', account: CRITEO_ACCOUNT_ID }, // account 고유값 고정
          { event: 'setEmail', email: formatEmail(email) },
          { event: 'setSiteType', type: getDeviceType() },
          { event: 'viewHome' },
        ];

        console.log(`[CRITEO_TRACKER] viewHome`, ...params);

        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(...params);
      },
    });
  },

  /**
   * 목록 페이지
     목록, 카테고리 또는 검색 결과 페이지에서 코드를 실행합니다. viewList를 통해 페이지에 표시되는 상위 세 제품의 제품 ID를 전달합니다.

     @param email 사용자 이메일
     @param deslIds 검색 결과 상위 3개의 dealId 로 구성된 배열
   */
  searchResults: ({ dealIds = [], email }) => {
    loadScript(CRITEO_TRACKER_URL, {
      id: scriptIds.CRITEO_TRACKER,
      async: true,
      onLoad: () => {
        const params = [
          { event: 'setAccount', account: CRITEO_ACCOUNT_ID },
          { event: 'setEmail', email: formatEmail(email) },
          { event: 'setSiteType', type: getDeviceType() },
          {
            event: 'viewList',
            item: dealIds.map(dealId => formatProductId(dealId)),
          },
        ];

        console.log(`[CRITEO_TRACKER] viewList`, ...params);

        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(...params);
      },
    });
  },

  /**
    제품 페이지
    저희는 귀하의 제품 feed에서 제품 페이지 URL과 ID를 추출했습니다. 드롭 다운에서 Criteo OneTag를 생성하고자 페이지 및 제품 ID를 선택합니다. 모든 제품 페이지에서 Criteo OneTag를 실행하고 보기항목을 통해 제품 ID를 제공합니다..

    @param email 사용자 이메일
   */
  productDetail: ({ email, dealId }) => {
    loadScript(CRITEO_TRACKER_URL, {
      id: scriptIds.CRITEO_TRACKER,
      async: true,
      onLoad: () => {
        const params = [
          { event: 'setAccount', account: CRITEO_ACCOUNT_ID },
          { event: 'setEmail', email: formatEmail(email) },
          { event: 'setSiteType', type: getDeviceType() },
          { event: 'viewItem', item: formatProductId(dealId) },
        ];

        console.log(`[CRITEO_TRACKER] viewItem`, ...params);

        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(...params);
      },
    });
  },

  /**
   * 바스켓 페이지
    바스켓에 추가되는 각 제품의 경우, 제품 ID, 수량 (해당 제품의 개수) 및 가격을 viewBasket에 전달해야 합니다 . 단가는 통화 기호없이 소수 분리자로서 점을 이용하여 포맷해야 합니다. 예, 9999.99.

   */
  addDealToCart: ({
    email,
    items = [
      {
        id: null,
        price: 0,
        quantity: 0,
        /* 사용자의 바스켓에 각 항목에 대한 라인을 추가합니다 */
      },
    ],
  }) => {
    loadScript(CRITEO_TRACKER_URL, {
      id: scriptIds.CRITEO_TRACKER,
      async: true,
      onLoad: () => {
        const params = [
          { event: 'setAccount', account: CRITEO_ACCOUNT_ID },
          { event: 'setEmail', email: formatEmail(email) },
          { event: 'setSiteType', type: getDeviceType() },
          {
            event: 'viewBasket',
            item: items.map(item => ({
              ...item,
              price: formatPrice(item.price),
              id: formatProductId(item.id), // * 아이디는 문자열로 변환되어야 한다
            })),
          },
        ];

        console.log(`[CRITEO_TRACKER] viewBasket`, ...params);

        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(...params);
      },
    });
  },

  /**
   * 매출 확인 페이지
    구매 완료 후에 고객이 보는 페이지인 매출 확인 페이지에서 하기 코드를 실행합니다. 이 실행은 trackTransaction에서 거래 ID나 주문 ID에도 전달되는 것 외에는 바스켓 페이지의 실행과 유사합니다. 세부 내용 »
    귀하의 사이트(PayPal, 전신 송금, 신용 카드)를 위한 모든 다른 지불 방법들에 대해 Criteo OneTag를 통합했는지 확인하십시오. 세부 내용 »
   */
  purchaseComplete: ({
    email,
    transaction_id,
    items = [
      {
        id: null, // dealId
        price: 0, // 할인 가격. discountPrice. salePrice
        quantity: 0,
        /* 사용자의 바스켓에 각 항목에 대한 라인을 추가합니다 */
      },
    ],
  }) => {
    loadScript(CRITEO_TRACKER_URL, {
      id: scriptIds.CRITEO_TRACKER,
      async: true,
      onLoad: () => {
        const params = [
          { event: 'setAccount', account: CRITEO_ACCOUNT_ID },
          { event: 'setEmail', email: formatEmail(email) },
          { event: 'setSiteType', type: 'm' },
          {
            event: 'trackTransaction',
            id: transaction_id,
            item: items.map(item => ({
              ...item,
              price: formatPrice(item.price),
              id: formatProductId(item.id), // * 아이디는 문자열로 변환되어야 한다
            })),
          },
        ];

        console.log(`[CRITEO_TRACKER] trackTransaction`, ...params);

        console.log(params[1].email);
        window.criteo_q = window.criteo_q || [];
        window.criteo_q.push(...params);
      },
    });
  },
};
