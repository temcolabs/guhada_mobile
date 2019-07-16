/**
 * 한자리 숫자 앞에 0을 붙인다.
 */
const prependZero = (num = '') => {
  if (num.toString().length === 1) {
    return '0' + num;
  }
  return num;
};

export default prependZero;
