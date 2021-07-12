import { isBrowser } from '../../common/isServer';
import detectDevice from '../../common/detectDevice';

const KAKAO_MOMENT_KEY = '5729108832452102212';

const getDeviceType = () => {
  const { isMobile } = detectDevice();
  const deviceType = isMobile ? 'mobile' : 'web';

  return deviceType;
};
export default {
  visit: () => {
    if (isBrowser) {
      if (kakaoPixel) {
        if (getDeviceType() === 'web') {
          kakaoPixel(KAKAO_MOMENT_KEY).pageView('visit_pc');
        } else {
          kakaoPixel(KAKAO_MOMENT_KEY).pageView('visit_m');
        }
      }
    }
  },
  signup: () => {
    if (isBrowser) {
      if (kakaoPixel) {
        if (getDeviceType() === 'web') {
          kakaoPixel(KAKAO_MOMENT_KEY).pageView();
          kakaoPixel(KAKAO_MOMENT_KEY).completeRegistration('registration_pc');
        } else {
          kakaoPixel(KAKAO_MOMENT_KEY).pageView();
          kakaoPixel(KAKAO_MOMENT_KEY).completeRegistration('registration_m');
        }
      }
    }
  },
  shoppingCart: () => {
    if (isBrowser) {
      if (kakaoPixel) {
        if (getDeviceType() === 'web') {
          kakaoPixel(KAKAO_MOMENT_KEY).pageView();
          kakaoPixel(KAKAO_MOMENT_KEY).viewCart('cart_pc');
        } else {
          kakaoPixel(KAKAO_MOMENT_KEY).pageView();
          kakaoPixel(KAKAO_MOMENT_KEY).viewCart('cart_m');
        }
      }
    }
  },
  purchaseComplete: ({ total_quantity, total_price }) => {
    if (isBrowser) {
      if (kakaoPixel) {
        kakaoPixel(KAKAO_MOMENT_KEY).pageView();
        kakaoPixel(KAKAO_MOMENT_KEY).purchase({
          total_quantity,
          total_price,
          currency: 'KRW',
          tag: 'purchase_m',
        });
      }
    }
  },
};
