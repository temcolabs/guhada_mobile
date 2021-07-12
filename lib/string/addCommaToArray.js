import isTruthy from '../common/isTruthy';

const addCommaToArray = (v) => {
  if (isTruthy(v))
    return v
      .map((e) => {
        return e;
      })
      .join(',');
  else return null;
};

export default addCommaToArray;
