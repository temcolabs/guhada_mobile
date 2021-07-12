import routes from '../../routes';

/**
 * 브라우저에 제공하는 경로 asPath 값으로 page 폴더 내부의 실제 컴포넌트 경로를 가져온다
 * @param {*} asPath
 */
const getRouteHref = (asPath) => {
  const target = routes.find((route) => route.asPath === asPath);
  return target ? target.pagePath : asPath;
};

export default getRouteHref;
