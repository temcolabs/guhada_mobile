import _ from 'lodash';
/**
 * null과 "" 값을 체크한다.
 */
const checkNullAndEmpty = str => {
  if (_.isNil(str) === false && str === '') {
    return true;
  }
  return false;
};

export default checkNullAndEmpty;
