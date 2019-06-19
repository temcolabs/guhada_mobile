import React from 'react';
import Link from 'next/link';
import findRoute from './findRoute';

/**
 * 커스텀 라우트에서 컴포넌트의 경로를 찾아준다.
 * @param {*} param0
 */
export default function LinkRoute({ href = '/', children, ...rest }) {
  const routeMatched = findRoute(href);
  const hrefInRoute = routeMatched ? routeMatched.pagePath : href;

  return (
    <Link as={href} href={hrefInRoute} {...rest}>
      {children}
    </Link>
  );
}
