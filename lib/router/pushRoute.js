import Router from 'next/router';
import findRoute from './findRoute';

/**
 *
 *
 * @param {*} nextRouter
 */
function pushRoute(url = '', option = { replace: false }) {
  const routeMatched = findRoute(url);
  if (routeMatched) {
    Router.push(routeMatched.pagePath, url);
  } else {
    console.warn(`[pushRoute] no matching route`, url);
    Router.push(url);
  }
}

export default pushRoute;
