import Router from 'next/router';
import findRoute, { getSearchString, addQueryToHref } from './findRoute';

/**
 * 커스텀 라우트에서 pagePath와 asPath(=href)가 다를 때 사용해야 하는 push 메소드.
 *
 * @param {*} nextRouter
 */
function pushRoute(href = '', option = { query: null, shallow: false }) {
  // 쿼리스트링을 겍체 형태로 전달받았다면 href에 추가해준다
  if (option.query) {
    href = addQueryToHref(href, option.query);
  }

  const routeMatched = findRoute(href);

  if (!!routeMatched) {
    const search = getSearchString({
      routeMatched,
      href,
    });

    Router.push(`${routeMatched.pagePath}?${search}`, href, option);
  } else {
    console.warn(`[pushRoute] no matching route`, href);
    Router.push(href);
  }
}

export default pushRoute;
