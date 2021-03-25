import loadScript, { scriptIds } from '../../dom/loadScript';
import { isBrowser } from '../../common/isServer';
import detectDevice from '../../common/detectDevice';

const GTAG_ID = 'AW-722841005';
const GTAG_TRACKER_URL = '//www.googletagmanager.com/gtag/js';

const getDeviceType = () => {
  const { isMobile } = detectDevice();
  const deviceType = isMobile ? 'mobile' : 'web';

  return deviceType;
};
export default {
  visit: () => {
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

        gtag('config', GTAG_ID);
      },
    });
  },
  signup: url => {
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
  purchaseComplete: successInfo => {
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
      gtag('event', 'purchase', gtagObj);

      if (getDeviceType() === 'web') {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/F0coCPmVhrkBEK3b1tgC`,
          value: 1.0,
          currency: 'KRW',
          transaction_id: '',
        });
      } else {
        gtag('event', 'conversion', {
          send_to: `${GTAG_ID}/PIJaCJuTobkBEK3b1tgC`,
          value: 1.0,
          currency: 'KRW',
          transaction_id: '',
        });
      }
    }
  },
};
