import Router from 'next/router';
import findRoute, { getSearchString, addQueryToHref } from './findRoute';
import _ from 'lodash';
import { devWarn } from 'lib/common/devLog';

/**
 * 커스텀 라우트에서 pagePath와 asPath(=href)가 다를 때 사용해야 하는 push 메소드.
 *
 * @param {*} nextRouter
 */
function pushRoute(
  href = '/',
  option = { query: null, isReplace: false, shallow: false }
) {
  if (_.isNil(href)) {
    console.error('href 값은 필수입니다.');
    return;
  } else {
    // 쿼리스트링을 겍체 형태로 전달받았다면 href에 추가해준다
    if (!!option.query) {
      href = addQueryToHref(href, option.query);
    }

    const routeMatched = findRoute(href);

    const pushMethod = option.isReplace ? Router.replace : Router.push;

    if (!!routeMatched) {
      const search = getSearchString({
        routeMatched,
        href,
      });

      pushMethod(`${routeMatched.pagePath}?${search}`, href, option);
    } else {
      devWarn(`[pushRoute] no matching custom route`, href);
      pushMethod(href.replace(/\/{0,}(.+)/, '/$1'));
    }
  }
}

export default pushRoute;
