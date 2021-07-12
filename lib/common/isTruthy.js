import { isNil as _isNil, isEmpty as _isEmpty } from 'lodash';

/**
 * 주어진 값이 null, undefined, 빈 배열, 빈 객체, 빈 문자열이 아니라면 true를 리턴한다
 * @param {*} v 검사할 값
 */
export default function isTruthy(v) {
  const isNumber = typeof v === 'number';
  const isSymbol = typeof v === 'symbol';
  return isNumber || isSymbol || (!_isNil(v) && !_isEmpty(v));
}

export function isFalsey(v) {
  return !isTruthy(v);
}
