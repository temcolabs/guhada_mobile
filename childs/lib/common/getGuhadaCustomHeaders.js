// const getCountryCode = require('./getCountryCode');
const key = require('../constant/key');
const localStorage = require('./localStorage');
const DEFAULT_LANG = 'ko'; // 기본 언어
const DEFAULT_COUNTRY = 'KR'; // 기본 국가
const isBrowser = typeof window === 'object';

/**
 * 구하다 커스텀 헤더 생성
 */
async function getGuhadaCustomHeaders() {
  // 플랫폼
  const platform = isBrowser
    ? /mobile/gi.test(navigator.userAgent)
      ? 'WM'
      : 'WP'
    : null;

  // 언어
  let languageCode = DEFAULT_LANG;

  if (isBrowser) {
    languageCode = localStorage.get(key.LANGUAGE_CODE);

    if (!languageCode) {
      const browserLanguage =
        navigator.language || navigator.userLanguage || '';

      languageCode = /(\w{2})-?(\w{2})?/.exec(browserLanguage)[1]; // 매칭 문자열에서 첫번째 그룹 추출

      localStorage.set(key.LANGUAGE_CODE, languageCode);
    }
  }

  // 서버 버전
  // TODO: 서버 버전 관리할 방법 필요. response에 버전을 명시해 준다면 가져올 수 있음
  const version = '0.0.1';

  // 국가코드
  let countryCode = DEFAULT_COUNTRY;

  return {
    'x-guhada-accesstime': +new Date(),
    'x-guhada-country': countryCode,
    'x-guhada-language': languageCode,
    'x-guhada-platform': platform,
    'x-guhada-version': version,
  };
}

module.exports = getGuhadaCustomHeaders;
