export const removeDash = (str = '') =>
  typeof str === 'string' ? str.replace(/-/g, '') : str;

export const isMobileNum = (num = '') => {
  const trimmed = removeDash(num);
  return /^01[0,1,6,7,8,9]\d{3,4}\d{4}$/.test(trimmed);
};

/**
 * 전화번호에 하이픈 추가. 모바일 번호만 변환한다
 */
export default function addHyphenToMobile(str = '') {
  if (typeof str === 'string' || typeof str === 'number') {
    const num = removeDash(str.toString());

    // 모바일 전화번호
    if (isMobileNum(num)) {
      return num.length <= 7
        ? num.replace(/(\d{3})(\d{1,4})/, '$1-$2')
        : num.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
    } else {
      // 일반 전화번호
      // 지역번호 서울 예외처리
      if (num.substring(0, 2).indexOf('02') === 0) {
        return num.replace(/(\d{2})(\d{3,4})(\d{4})$/, '$1-$2-$3');
      } else {
        return num.replace(/(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
      }
    }
  } else {
    return str;
  }
}

/**
 * input onBlur에서 사용한다.
 * 10자리의 전화번호는 가운데 자리를 3개로 해서 변환한다.
 */
export const confirmMobileFormat = (str = '') => {
  const num = removeDash(str.toString());
  return num.length === 10
    ? num.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3')
    : num.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
};
