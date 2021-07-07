import loadScript, { scriptIds } from '../../dom/loadScript';
import { isBrowser } from '../../common/isServer';
import detectDevice from '../../common/detectDevice';
import sessionStorage from 'childs/lib/common/sessionStorage';
import { gtagUtmSave } from 'childs/lib/tracking/google/gtagUtmHelper';

const GTAG_ID = 'AW-722841005';
const UA_GTAG_ID = 'UA-145072876-1';
const GTAG_TRACKER_URL = '//www.googletagmanager.com/gtag/js';

const getDeviceType = () => {
  const { isMobile } = detectDevice();
  const deviceType = isMobile ? 'mobile' : 'web';

  return deviceType;
};

export default {
  visit: () => {
    gtagUtmSave();
    loadScript(`${GTAG_TRACKER_URL}?id=${GTAG_ID}`, {
      async: true,
      id: scriptIds.GTAG_TRACKER,
      replaceExisting: true,
      onLoad: () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag('js', new Date());

        const campaign = sessionStorage.get('UTM');
        if (campaign && typeof campaign === 'object') {
          gtag('config', GTAG_ID, { campaign });
        } else {
          gtag('config', GTAG_ID);
        }

        gtag('config', UA_GTAG_ID);
        window.ga('create', UA_GTAG_ID, 'auto');
        window.ga('send', 'pageview');
      },
    });
  },
  signup: (url) => {
    if (isBrowser) {
      let signupUrl = window.location.origin + url;

      var callback = function() {
        if (typeof url != 'undefined') {
          window.location = signupUrl;
        }
      };

      if (getDeviceType() === 'web') {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/-rrECP2WhrkBEK3b1tgC`,
          event_callback: callback,
        });
      } else {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/-vLUCPrjlrkBEK3b1tgC`,
          event_callback: callback,
        });
      }
      return false;
    }
  },
  shoppingCart: () => {
    if (isBrowser) {
      if (getDeviceType() === 'web') {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/Vr_zCOyXhrkBEK3b1tgC`,
        });
      } else {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/DEJ2CKaZhrkBEK3b1tgC`,
        });
      }
    }
  },
  purchaseComplete: (successInfo) => {
    if (isBrowser) {
      const gtagObj = {
        transaction_id: `${successInfo.orderNumber}`,
        value: successInfo.totalPaymentPrice,
        currency: 'KRW',
        items: successInfo.orderList.map(
          ({ productId, prodName, quantity, orderPrice }) => ({
            id: `${productId}`,
            name: prodName,
            quantity: quantity,
            price: orderPrice,
          })
        ),
      };

      const campaign = sessionStorage.get('UTM');
      if (campaign && typeof campaign === 'object') {
        Object.assign(gtagObj, { campaign });
        gtag('config', GTAG_ID, { campaign });
      }

      gtag('event', 'purchase', gtagObj);

      if (getDeviceType() === 'web') {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/F0coCPmVhrkBEK3b1tgC`,
          value: successInfo.totalPaymentPrice,
          currency: 'KRW',
          transaction_id: '',
        });
      } else {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/PIJaCJuTobkBEK3b1tgC`,
          value: successInfo.totalPaymentPrice,
          currency: 'KRW',
          transaction_id: '',
        });
      }
    }
  },
  gaEvent: {
    luckyDrawRequest() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt1');
    },
    luckyDrawLogin() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt2');
    },
    luckyDrawSignup() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt3');
    },
    luckyDrawNaverSignup() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt4');
    },
    luckyDrawKakaoSignup() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt5');
    },
    luckyDrawFacebookSignup() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt6');
    },
    luckyDrawGoogleSignup() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt7');
    },
    addShoppingCart() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt8');
    },
    luckyDrawAuthButton() {
      window.ga('send', 'event', 'Mobile', 'Mobile_bt9');
    },
  },
};
