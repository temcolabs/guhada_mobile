import React from 'react';
import Link from 'next/link';
import findRoute, { getSearchString, addQueryToHref } from './findRoute';

/**
 * 커스텀 라우트에서 컴포넌트의 경로를 찾아준다.
 * @param {*} param0
 */
export default function LinkRoute({ href = '/', query, children, ...rest }) {
  // 쿼리스트링을 전달받았다면 href에 추가해준다
  if (query) {
    href = addQueryToHref(href, query);
  }

  const routeMatched = findRoute(href);

  if (routeMatched) {
    const search = getSearchString({
      routeMatched,
      href,
    });

    return (
      <Link href={`${routeMatched.pagePath}?${search}`} as={href} {...rest}>
        {children}
      </Link>
    );
  } else {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
}
