import React, { Component } from 'react';
import css from './FindMobileAuth.module.scss';
import LoginButton from './LoginButton';

export default class FindMobileAuthPassword extends Component {
  render() {
    return (
      <div>
        <div className={css.header}>
          본인 명의 휴대폰으로 비밀번호를 재설정합니다.
        </div>
        <LoginButton
          className="isColored"
          onClick={() => authmobile.getCertKey('findpassword')}
        >
          본인 명의 휴대폰으로 인증
        </LoginButton>
        <div className={css.subTextWrap}>
          <div>
            <div className={css.dot} />
            인증비용은 구하다에서 부담합니다.
          </div>
        </div>
      </div>
    );
  }
}
