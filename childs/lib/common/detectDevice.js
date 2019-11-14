import { isBrowser } from './isServer';
/**
 * 디바이스 탐지
 * @param {} userAgent
 */
const detectDevice = function(userAgent) {
  if (!isBrowser) {
    return {};
  } else {
    const ua = userAgent || navigator.userAgent.toLowerCase();

    const detect = () => {
      if (
        /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
          ua
        )
      ) {
        return 'tablet';
      } else if (
        /(mobile|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(
          ua
        )
      ) {
        return 'mobile';
      } else {
        return 'desktop';
      }
    };

    const device = detect();

    return {
      device: device,
      isTablet: device === 'tablet',
      isMobile: device !== 'desktop', // 태블릿도 모바일
      userAgent: ua,
    };
  }
};

export default detectDevice;
