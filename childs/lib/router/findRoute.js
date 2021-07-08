import routes from '../../../routes';
import pathMatch from 'path-match';
import qs from 'qs';
import { merge as _merge } from 'lodash';

const pathToRegexp = require('path-to-regexp');
const match = pathMatch();

/**
 * 매칭되는 커스텀 라우트를 찾을 수 있도록 path-to-regexp 모듈로 만든 객체를 추가
 */
export const routesWithRegexp = routes.map((route) => {
  return {
    regexp: pathToRegexp(route.asPath),
    asPath: route.asPath,
    pagePath: route.pagePath,
  };
});

export const findRoute = (url) => {
  const pathname = url.split('?')[0];

  return routesWithRegexp.find((route) => {
    return route.regexp.exec(pathname) !== null;
  });
};

/**
 * 커스텀 라우트에 매칭되는 파라미터와 쿼리스트링 객체를 합쳐서 search 문자열을 만든다.
 */
export const getSearchString = ({
  routeMatched = { pagePath: '', asPath: '' },
  href = '', // 브라우저에 표시될 경로
}) => {
  const [path, querystring] = href.split('?');
  const paramsMatched = match(routeMatched.asPath)(path);
  const search = qs.stringify(
    Object.assign({}, paramsMatched, qs.parse(querystring))
  );

  return search;
};

/**
 * href에 stringified된 쿼리 객체를 추가한다.
 * href에 붙어 있던 쿼리는 옵션을 통해 대체 또는 병합하도록 결정할 수 있다.
 *
 * @param {href}  이동시킬 라우트
 * @param {query} query 쿼리 객체
 * @param {option.mergeQuery} 쿼리를 덮어씌울 것인지 기본값 false
 */
export const addQueryToHref = (
  href = '/',
  query,
  { mergeQuery = false } = {}
) => {
  let hrefWithQuery = href;

  if (!!query) {
    const [path, queryString] = href.split('?');

    const newQuery = !mergeQuery
      ? qs.stringify(query)
      : qs.stringify(_merge(qs.parse(queryString), query));

    hrefWithQuery = `${path}?${newQuery}`;
  }

  return hrefWithQuery;
};

export default findRoute;
