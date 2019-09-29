import React, { Component, Fragment } from 'react';
import css from './AuthenticationModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
import CountdownTimer from 'components/common/CountdownTimer';
@inject('orderpayment', 'authmobile', 'customerauthentication')
@observer
class AuthenticationModal extends Component {
  openWindowHandle = () => {
    window.open('_blank', 'popupChk');
    this.props.authmobile.getCertKey('order');
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
                {orderpayment.orderUserInfo.name &&
                orderpayment.orderUserInfo.mobile ? (
                  <span className={css.certified}> [인증완료]</span>
                ) : (
                  <span> [미인증]</span>
                )}
              </div>
              <div className={css.content}>
                <div>본인 명의 휴대폰으로 본인인증을 진행해주세요.</div>
              </div>
              {orderpayment.orderUserInfo.name &&
              orderpayment.orderUserInfo.mobile ? (
                <div className={[css.button, css.alreadySuccess].join(' ')}>
                  인증완료
                </div>
              ) : (
                <div
                  className={css.button}
                  onClick={() => this.openWindowHandle()}
                >
                  본인 명의 휴대폰으로 인증
                </div>
              )}

              <div className={css.notifyWrap}>
                <div className={css.notifySection}>
                  <span className={css.dot} />
                  인증비용은 구하다에서 부담합니다.
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
                이메일 인증
                {orderpayment.orderUserInfo.emailVerify ? (
                  <span className={css.certified}> [인증완료]</span>
                ) : (
                  <span> [미인증]</span>
                )}
              </div>
              <div className={css.content}>
                <div>
                  <input
                    type="text"
                    value={
                      orderpayment.orderUserInfo.email
                        ? orderpayment.orderUserInfo.email
                        : null
                    }
                    readOnly
                  />
                </div>
                {customerauthentication.sendMailSuccess ? (
                  <div
                    className={css.reRequest}
                    onClick={() =>
                      customerauthentication.emailAuthenticationSend(
                        orderpayment.orderUserInfo.email,
                        orderpayment.orderUserInfo.name
                      )
                    }
                  >
                    재전송
                  </div>
                ) : null}
              </div>
              {customerauthentication.sendMailSuccess ? (
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
                      console.log('시간 초과입니다.');
                    }}
                  />
                </div>
              ) : null}

              {customerauthentication.sendMailSuccess ? (
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
                  인증 메일 요청
                </div>
              ) : (
                <div
                  className={css.button}
                  onClick={() =>
                    customerauthentication.emailAuthenticationSend(
                      orderpayment.orderUserInfo.email,
                      orderpayment.orderUserInfo.name
                    )
                  }
                >
                  인증 메일 요청
                </div>
              )}
            </div>
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default AuthenticationModal;
