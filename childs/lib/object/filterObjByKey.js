/**
 * 객체에서 지정된 키만 남기고 제거한다
 */
export default function filterObjByKey(rawObj = {}, keys = []) {
  return Object.keys(rawObj)
    .filter(k => keys.includes(k))
    .reduce((filteredObj, k) => {
      filteredObj[k] = rawObj[k];
      return filteredObj;
    }, {});
}
