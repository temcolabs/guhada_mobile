import css from './MyBBS.module.scss';
import { LinkRoute } from 'lib/router';
import qs from 'qs';
import { withRouter } from 'next/router';
import { useObserver } from 'mobx-react';
import { compose } from 'lodash/fp';

const enhancer = compose(withRouter);

/**
 * 내 북마크 목록
 */
function LoginNoti({ router }) {
  const loginLink = `/login?${qs.stringify({
    redirectTo: router.asPath,
  })}`;

  return useObserver(() => (
    <div>
      <div className={css.myBbsProfileWrapper}>
        <div className={css.avatar} />

        <div className={css.userInfo}>
          <LinkRoute prefetch href={loginLink}>
            <a className={css.userInfo_nickname}>
              <b>로그인</b>을 해주세요
            </a>
          </LinkRoute>
          <LinkRoute href={`/login/selectsignup`}>
            <a className={css.signInLink}>회원가입</a>
          </LinkRoute>
        </div>
      </div>
      <LinkRoute href={`/community/editor`}>
        <button className={css.loginButton}>글쓰기</button>
      </LinkRoute>
    </div>
  ));
}

export default enhancer(LoginNoti);
