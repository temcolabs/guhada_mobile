import isTruthy from '../common/isTruthy';

export default v => {
  if (isTruthy(v))
    return v
      .map(e => {
        return e;
      })
      .join(',');
  else return null;
};
