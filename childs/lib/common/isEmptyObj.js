import _ from 'lodash';

const isEmptyObj = obj => {
  if (typeof obj == 'object' && !_.isNil(obj)) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};

export default isEmptyObj;
