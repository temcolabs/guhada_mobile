import routes from '../../routes';
const pathToRegexp = require('path-to-regexp');

/**
 * 매칭되는 커스텀 라우트를 찾을 수 있도록 path-to-regexp 모듈로 만든 객체를 추가
 */
export const routesWithRegexp = routes.map(route => {
  return {
    regexp: pathToRegexp(route.asPath),
    asPath: route.asPath,
    pagePath: route.pagePath,
  };
});

export const findRoute = url => {
  const pathname = url.split('?')[0];

  return routesWithRegexp.find(route => {
    return route.regexp.exec(pathname) !== null;
  });
};

export default findRoute;
