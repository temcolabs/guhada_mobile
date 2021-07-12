import detectDevice from '../common/detectDevice';
import { isBrowser } from '../common/isServer';

/**
 * 현재 웹페이지가 운영인지 확인.
 * @param {*} hostname 서버에서 실행할 땐 호스트네임을 직접 알아내서 전달해준다.
 */
const getIsProdHost = hostname => {
  if (isBrowser) {
    const { isTablet, isMobile } = detectDevice();
    const currentHostname =
      hostname || isBrowser ? window.location.hostname : '';

    return isTablet || isMobile
      ? // 모바일 prod 호스트 확인
        currentHostname === 'm.guhada.com'
      : // 데스크탑 prod 호스트
        currentHostname === 'www.guhada.com' ||
          currentHostname === 'web.guhada.com' ||
          currentHostname === 'guhada.com';
  } else {
    return false;
  }
};

export default getIsProdHost;
