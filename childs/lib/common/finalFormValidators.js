import _ from 'lodash';
import isEmailString from '../string/isEmailString';
import isTruthy, { isFalsey } from './isTruthy';
import isValidPasswordStr from '../string/isValidPasswordStr';
import isValidMobileStr from '../string/isValidMobileStr';

/**
 * validator 조합
 * 파리미터로 전달된 함수를 실행하면서 발견한 첫번째 오류 메시지를 최종 값으로 전달한다.
 *
 * @param  {...any} validators
 */
export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

/**
 * null, undefined가 아니어야 함.
 */
export const required = v => (isFalsey(v) ? '이 값은 필수입니다.' : undefined);
export const requiredWithMessage = (message = '이 값은 필수입니다.') => v =>
  isFalsey(v) ? message : undefined;

/**
 * 빈 값이 아닐때만 유효성을 검사한다. => 필수값이 아님
 *
 * @param {function} validator
 */
export const validateWithValue = validator => v =>
  isTruthy(v) ? validator(v) : undefined;

// 빈 문자열이면 검사하지 않는다
export const validateStringHasLength = validator => v =>
  typeof v === 'string' && v.length === 0 ? undefined : validator(v);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const delayedValidation = validator => async v => {
  await sleep(300);
  return validator(v);
};

/**
 * 빈 문자열 검사
 */
export const notEmptyString = v =>
  !v || v.replace(/\s/g, '').length === 0 ? '빈 문자열입니다' : undefined;

/**
 * 이메일 형식인지 검사
 */

export const mustBeEmail = v =>
  isEmailString(v) ? undefined : '이메일 형식이 아닙니다.';

/**
 * 숫자인지 검사
 * @param {*} v
 */
export const mustBeNumber = v =>
  typeof v !== 'number' ? '이 값은 숫자여야 합니다' : undefined;

/**
 * boolean 값인지 확인
 */
export const mustBeBoolean = v =>
  typeof v !== 'boolean' ? '이 값은 예/아니오 중 하나여야 합니다.' : undefined;

export const mustBeTrue = (message = '이 값은 참이어야 합니다.') => v =>
  v === true ? undefined : message;

/**
 * 최소값 이상이어야 함. higher order function
 * @param {*} min
 */
export const minValue = min => value =>
  isNaN(value) || value >= min ? undefined : `${min}보다 큰 값이어야 합니다.`;

/**
 * 최대값 이하여야 함. higher order function
 * @param {*} max
 */
export const maxValue = max => value =>
  isNaN(value) || value <= max ? undefined : `${max}보다 작은 값이어야 합니다.`;

export const mustBeArray = v =>
  Array.isArray(v) ? undefined : '배열이 아닙니다';

/**
 * 빈 배열이 아니어야 함
 * @param {*} v
 */
export const notEmtpryArray = v =>
  Array.isArray(v) && v.length > 0
    ? undefined
    : '1개 이상의 항목을 포함해야 합니다.';

/**
 * 유효한 비밀번호인지 확인
 */
export const mustBePassword = v => {
  return isValidPasswordStr(v)
    ? undefined
    : '8~15자 영문 대 소문자, 숫자, 특수문자를 사용하세요.';
};

/**
 * 유효한 비밀번호인지 확인
 */
export const mustBeMobile = v => {
  return isValidMobileStr(v) ? undefined : '잘못된 휴대전화 번호입니다.';
};
