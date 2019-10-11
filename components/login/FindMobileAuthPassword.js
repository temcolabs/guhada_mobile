import React, { Component } from 'react';
import css from './FindMobileAuth.module.scss';
import LoginButton from './LoginButton';
import { inject, observer } from 'mobx-react';
@inject('authmobile')
@observer
class FindMobileAuthPassword extends Component {
  render() {
    const { authmobile } = this.props;
    return (
      <div>
        <div className={css.header}>
          본인 명의 휴대폰으로 비밀번호를 재설정합니다.
        </div>
        <LoginButton
          className="isColored"
          onClick={() => {
            const childWindow = window.open('', 'popupChk');
            authmobile.getCertKey('findpassword', childWindow);
          }}
        >
          본인 명의 휴대폰으로 인증
        </LoginButton>
        <div className={css.subTextWrap}>
          <div>※ 인증비용은 구하다에서 부담합니다.</div>
        </div>
      </div>
    );
  }
}

export default FindMobileAuthPassword;
