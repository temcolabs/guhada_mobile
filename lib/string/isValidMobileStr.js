/**
 * 유효한 휴대전화 번호인지 확인
 * @param {*} val
 */
export default function isValidMobileStr(val = '') {
  return (
    typeof val === 'string' && /^01\d{1}\d{7,8}$/.test(val.replace(/-/g, ''))
  );
}
