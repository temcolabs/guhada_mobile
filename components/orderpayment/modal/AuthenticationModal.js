import { Component, Fragment } from 'react';
import css from './AuthenticationModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
@inject('orderpayment', 'authmobile', 'customerauthentication', 'alert')
@observer
class AuthenticationModal extends Component {
  openWindowHandle = (e) => {
    if (!this.props.authmobile.access) {
      this.props.authmobile.access = true;

      try {
        const childWindow = window.open('', 'popupChk');
        if (!childWindow) {
          throw new Error();
        }
        this.props.authmobile.getCertKey('order', childWindow);
      } catch (e) {
        this.props.authmobile.access = false;
        this.props.alert.showAlert('브라우저 또는 구하다 앱에서 이용해주세요!');
      }
    }
  };
  render() {
    const {
      orderpayment,
      authmobile,
      modalClose,
      customerauthentication,
      isVisible,
    } = this.props;
    return (
      <Fragment>
        <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
          <div className={css.wrap}>
            <div className={css.header}>
              <div
                className={css.back}
                onClick={() => {
                  modalClose();
                }}
              />
              <div className={css.title}>인증하기</div>
            </div>
            <div className={css.AuthenticationWrap}>
              <div className={css.wrapTitle}>
                본인인증
                {customerauthentication.userVerify ? (
                  <span className={css.certified}> [인증완료]</span>
                ) : (
                  <span> [미인증]</span>
                )}
              </div>
              <div className={css.content}>
                <div>본인 명의 휴대폰으로 </div>
                <div>본인인증을 진행해주세요.</div>
              </div>
              {customerauthentication.userVerify ? (
                <div className={[css.button, css.alreadySuccess].join(' ')}>
                  인증완료
                </div>
              ) : (
                <div
                  className={css.button}
                  onClick={(e) => this.openWindowHandle(e)}
                >
                  본인 명의 휴대폰으로 인증
                </div>
              )}

              <div className={css.notifyWrap}>
                <div className={css.notifySection}>
                  ※ 인증비용은 구하다에서 부담합니다.
                </div>
              </div>
              <form name="form_chk" method="post" style={{ display: 'none' }}>
                <input type="hidden" name="m" value="checkplusSerivce" />
                <input
                  type="hidden"
                  name="EncodeData"
                  value={authmobile.authKey}
                />
              </form>
            </div>

            <div className={css.emailWrap}>
              <div className={css.wrapTitle}>
                {/* 이메일 인증 */}
                이메일
                {/* {orderpayment.orderUserInfo.emailVerify ? (
                  <span className={css.certified}> [인증완료]</span>
                ) : (
                  <span> [미인증]</span>
                )} */}
              </div>
              <div className={css.content}>
                {customerauthentication.emailValid ? (
                  <div>
                    <input
                      type="text"
                      value={
                        customerauthentication.email
                          ? customerauthentication.email
                          : null
                      }
                      readOnly
                    />
                  </div>
                ) : (
                  <div className={css.unVaildEmailBox}>
                    <input
                      type="text"
                      placeholder="이메일을 입력해주세요"
                      value={customerauthentication.email || ''}
                      onChange={(e) => {
                        customerauthentication.emailInput(e);
                      }}
                      onBlur={() => {
                        customerauthentication.emailValidCheck();
                      }}
                    />
                  </div>
                )}

                {/* {customerauthentication.sendMailSuccess ? (
                  <div
                    className={css.reRequest}
                    onClick={() =>
                      customerauthentication.emailAuthenticationSend(
                        customerauthentication.email,
                        orderpayment.orderUserInfo.name
                      )
                    }
                  >
                    재전송
                  </div>
                ) : null} */}
              </div>
              {/* {customerauthentication.sendMailSuccess ? (
                <div className={css.verifyNumber}>
                  <div>
                    <input
                      type="text"
                      placeholder="인증번호(6자리 숫자 입력)"
                      onChange={e => {
                        customerauthentication.emailAuthenticationCode(e);
                      }}
                    />
                  </div>
                  <CountdownTimer
                    isVisible={customerauthentication.sendMailSuccess}
                    initialTimeLeft={600}
                    render={({ time }) => {
                      return <span>{time}</span>;
                    }}
                    onTimeOver={() => {
                      devLog('시간 초과입니다.');
                    }}
                  />
                </div>
              ) : null} */}

              {/* {customerauthentication.sendMailSuccess ? (
                <div
                  className={css.button}
                  onClick={() =>
                    customerauthentication.emailAuthenticationCodeVerify()
                  }
                >
                  인증 확인
                </div>
              ) : orderpayment.orderUserInfo.emailVerify ? (
                <div className={[css.button, css.alreadySuccess].join(' ')}>
                  인증완료
                </div>
              ) : (
                <div
                  className={css.button}
                  onClick={() =>
                    customerauthentication.emailAuthenticationSend(
                      customerauthentication.email,
                      orderpayment.orderUserInfo.name
                    )
                  }
                >
                  인증 메일 요청
                </div>
              )} */}
            </div>
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default AuthenticationModal;
