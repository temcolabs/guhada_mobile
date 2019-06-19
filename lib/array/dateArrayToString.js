const padZeroToSingleDigit = (num = 0) => {
  return String(num).length === 1 ? '0' + num : num;
};

/**
 * 날짜 배열을 문자열로 변환한다.
 * 년, 월, 일로 구성된 배열만 지원한다.
 * @param {*} arr
 */
const dateArrayToString = (arr = [2019, 5, 10]) => {
  if (arr && arr.length === 3) {
    return arr.map(d => padZeroToSingleDigit(d)).join('-');
  } else {
    console.error(
      '[dateArrayToString]: [YYYY, MM, DD] 형식의 배열만 지원합니다.',
      arr
    );
    return;
  }
};

export default dateArrayToString;
