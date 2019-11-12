/**
 * 0보다 같거나 ₩큰 한자리 숫자 앞에 0을 붙여준다
 */
export default (num = 0) => {
  const targetNum = Number(num);

  if (!Number.isNaN(targetNum)) {
    if (targetNum < 10 && targetNum > -1) {
      return `0${targetNum}`;
    } else {
      return targetNum;
    }
  } else {
    return num;
  }
};
