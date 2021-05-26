import moment from 'moment';

/**
 * 두 시간의 차이
 * @param {Number} t1 기준 시간
 * @param {Number} t2 빼는 시간
 * @returns {Number} timestamp
 */
export function getTimeDiff(t1, t2) {
  const now = moment(t1);
  const then = moment(t2);
  return moment(now, 'DD/MM/YYYY HH:mm:ss').diff(
    moment(then, 'DD/MM/YYYY HH:mm:ss')
  );
}
