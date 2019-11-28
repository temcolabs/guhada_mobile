import { pushRoute } from 'childs/lib/router';
import Router from 'next/router';

/**
 * 로그인 페이지로 보낸다.
 * 로그인 완료 후 이 함수가 실행된 현재 페이지로 돌아올 수 있다.
 */
export default function sendBackToLogin() {
  pushRoute(`/login`, {
    query: {
      redirectTo: Router.asPath,
    },
  });
}
