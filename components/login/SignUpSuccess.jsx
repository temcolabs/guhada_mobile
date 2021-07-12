import { pushRoute } from 'lib/router';
import React from 'react';
import css from './SignUpSuccess.module.scss';

const SignUpSuccess = ({ email }) => {
  return (
    <div className={css.wrap}>
      <div className={css.congratsImage} />
      <div className={css.header}>회원가입을 축하드립니다</div>
      <div className={css.contents}>회원님의 아이디: {email}</div>
      <div className={css.eventContents}>
        신규 회원 가입 포인트 5,000P가 지급되었습니다.
      </div>
      <button className={css.loginBtn} onClick={() => pushRoute('/login')}>
        로그인 하기
      </button>
      <div className={css.homeBtn} onClick={() => pushRoute('/')}>
        홈으로 가기
      </div>
    </div>
  );
};

export default SignUpSuccess;
