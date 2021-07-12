/**
 * 구하다 서비스가 요구하는 유효한 비민번호 형식인지 확인.
 * @param {*} val
 */
export default function isValidPasswordStr(val = '') {
  // return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
  //   val
  // );
  return /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(val);
}

export function passwordValidMessage(val) {
  if (val.length < 8 || val.length > 15) {
    return '비밀번호는 8-15자 이내로 입력해주세요.';
  } else if (/^[0-9]+$/.test(val)) {
    return '비밀번호는 숫자로만 입력할수 없습니다.';
  } else if (/^[a-z]+$/.test(val)) {
    return '비밀번호는 영문으로만 입력할수 없습니다';
  } else if (/^[!@#$%^&*-]+$/.test(val)) {
    return '비밀번호는 특수문자로만 입력할수 없습니다';
  } else if (!/[0-9]/.test(val)) {
    return '하나 이상의 숫자를 포함해주세요.';
  } else if (!/[a-z]/.test(val)) {
    return '하나 이상의 영문을 포함해주세요.';
  } else if (!/[~!@#$%^&*()_+<>?:{}-]/.test(val)) {
    return '하나 이상의 특수문자를 포함해주세요.';
  }
}
