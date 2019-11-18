/**
 * 배열을 객체 형태로 변환한다
 * @param {*} array 배열
 * @param {*} keyField 배열의 아이템 객체에서 키로 사용할 값의 필드
 */
const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

export const arrayToEnum = array =>
  Array.isArray(array)
    ? array.reduce((result, v) => {
        return Object.assign(result, { [v]: v });
      }, {})
    : {};

export default arrayToObject;
