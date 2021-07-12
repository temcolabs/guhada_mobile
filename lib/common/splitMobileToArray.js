/**
 * 휴대전화 번호 분리
 * @param {string} mobile
 */
export default function splitMobileToArray(mobile = '') {
  if (!!mobile) {
    const regex =
      mobile.length === 10
        ? /^(\d{3})(\d{3})(\d{4})/
        : /^(\d{3})(\d{4})(\d{4})/;
    const result = regex.exec(mobile);

    return result && result.length >= 4
      ? [result[1], result[2], result[3]]
      : [];
  } else {
    return [];
  }
}
