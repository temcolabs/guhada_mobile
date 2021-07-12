import routes from './index';
import arrayToObject from 'lib/common/arrayToObject';

const mypageRoutes = routes.filter(
  (route) => route.asPath.indexOf('/mypage') === 0
);

/**
 * routes 배열에서 마이페이지에 해당하는 것을 필터링해서 pagePath을 키로 한 객체로 변환한다.
 *
 * MypageLayout과 MypageSidebar에서 사용중이다
 */
const mypageRouteObj = arrayToObject(mypageRoutes, 'pagePath');

export default mypageRouteObj;
