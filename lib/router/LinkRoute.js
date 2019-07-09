import React from 'react';
import Link from 'next/link';
import findRoute, { getSearchString } from './findRoute';

/**
 * 커스텀 라우트에서 컴포넌트의 경로를 찾아준다.
 * @param {*} param0
 */
export default function LinkRoute({ href = '/', children, ...rest }) {
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
    console.warn(`[pushRoute] no matching route`, href);

    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
}
