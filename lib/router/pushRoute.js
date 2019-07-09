import Router from 'next/router';
import findRoute, { getSearchString } from './findRoute';
/**
 * 커스텀 라우트에서 pagePath와 asPath(=href)가 다를 때 사용해야 하는 push 메소드.
 *
 * @param {*} nextRouter
 */
function pushRoute(href = '', option) {
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
