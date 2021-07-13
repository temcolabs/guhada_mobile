import { Component } from 'react';
import css from './FindMobileAuth.module.scss';
import LoginButton from './LoginButton';
import { inject, observer } from 'mobx-react';
@inject('authmobile', 'alert')
@observer
class FindMobileAuthPassword extends Component {
  render() {
    const { authmobile, alert } = this.props;
    return (
      <div>
        <div className={css.header}>
          본인 명의 휴대폰으로 비밀번호를 재설정합니다.
        </div>
        <LoginButton
          className="isColored"
          onClick={() => {
            if (!authmobile.access) {
              authmobile.access = true;

              try {
                const childWindow = window.open('', 'popupChk');
                if (!childWindow) {
                  throw new Error();
                }
                authmobile.getCertKey('findpassword', childWindow);
              } catch (e) {
                authmobile.access = false;
                alert.showAlert('브라우저 또는 구하다 앱에서 이용해주세요!');
              }
            }
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
