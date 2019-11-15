import React, { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import Form from 'stores/form-store/_.forms';
import css from './LuckydrawSignup.module.scss';
import { LoginInput, LoginCheckBox, LoginButton } from 'components/login';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import SignupInputButtonChange from 'components/login/SignupInputButtonChange';

@inject('login', 'authmobile')
@observer
class LuckydrawSignup extends Component {
  state = {
    optionalAgree: false,
  };

  handleOptionalAgree = () => {
    this.setState({ optionalAgree: true });
  };

  render() {
    const { login } = this.props;
    let form =
      login.loginPosition === 'luckydrawSNS'
        ? Form.signUpSNSLuckydraw
        : Form.signUpLuckydraw;

    let value = form.get('value');
    const { isOpen, closeModal } = this.props;

    return (
      <ModalWrapper
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel={'LuckydrawSignup'}
        contentStyle={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          transform: 'none',
        }}
        zIndex={1000}
      >
        <div className={css.loginWrap}>
          <div className={css.headerWrap}>
            <div className={css.emptyButton} />
            회원가입
            <div
              className={css.closeButton}
              onClick={() => {
                closeModal();
                form.clear();
                form.$('emailCheck').set('label', '중복확인');
                form.$('authMobileButton').set('label', '본인인증');
              }}
            />
          </div>
          <div className={css.wrap}>
            <div>
              <SignupInputButtonChange
                field={form.$('email')}
                button={form.$('emailCheck')}
              />
              {login.loginPosition !== 'luckydrawSNS' && (
                <>
                  <LoginInput field={form.$('password')} />
                  <LoginInput field={form.$('passwordConfirm')} />
                </>
              )}
              <div onClick={form.$('authMobileButton').onSubmit}>
                <LoginInput field={form.$('name')} disabled={true} />
                <SignupInputButtonChange
                  field={form.$('mobile')}
                  button={form.$('authMobileButton')}
                  maxLength={13}
                  disabled={true}
                />
              </div>
            </div>

            <div className={css.bigCheckboxWrap}>
              <LoginCheckBox
                field={form.$('allagree_term')}
                big={true}
                className={'wrap'}
              />
            </div>
            <div className={css.borderBottom}>
              <LoginCheckBox
                field={form.$('requireAgree')}
                className={'wrap'}
              />
              <LoginCheckBox
                field={form.$('agreePurchaseTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/purchase`}
              />
              <LoginCheckBox
                field={form.$('agreeCollectPersonalInfoTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/personal`}
              />
            </div>
            <div
              className={cn(css.optionalAgree, {
                [css.openOptional]: this.state.optionalAgree === true,
              })}
              onClick={() => this.handleOptionalAgree()}
            >
              <LoginCheckBox
                field={form.$('optionalAgree')}
                className={'wrap'}
              />
              <div
                style={
                  this.state.optionalAgree === false
                    ? { display: 'none' }
                    : { display: 'block' }
                }
              >
                <LoginCheckBox
                  field={form.$('agreeSaleTos')}
                  className={'termOption'}
                  href={`${process.env.HOSTNAME}/terms/sale`}
                />
                <div>
                  <LoginCheckBox
                    field={form.$('agreeEmailReception')}
                    className={'emailsms'}
                  />
                  <LoginCheckBox
                    field={form.$('agreeSmsReception')}
                    className={'emailsms'}
                  />
                </div>
              </div>
            </div>
            <div className={css.eventTextWarp}>
              <div className={css.eventText}>
                ※ 할인, 이벤트 등 다양한 정보를 받아보실 수 있습니다.
              </div>
              <div className={css.eventText}>
                ※ 결제/교환/환불 등 관련된 내용은 거래안 을 위하여 수신동의
                여부와 관계없이 발송됩니다. 선택 항목에 동의하지 않으셔도 구하다
                서비스 이용 가능합니다.
              </div>
              <div className={css.eventText}>
                ※ 14세 이상만 가입 가능합니다.
              </div>
            </div>
            <div>
              <LoginButton
                className={
                  !(
                    value.agreePurchaseTos &&
                    value.agreeCollectPersonalInfoTos &&
                    value.agreeSaleTos === true &&
                    value.agreeEmailReception === true &&
                    value.agreeSmsReception === true &&
                    value.emailCheck === 'complete' &&
                    value.authMobileButton === 'complete'
                  )
                    ? 'isGray'
                    : 'isColored'
                }
                onClick={form.onSubmit}
                disabled={
                  !(
                    value.agreePurchaseTos &&
                    value.agreeCollectPersonalInfoTos &&
                    value.agreeSaleTos === true &&
                    value.agreeEmailReception === true &&
                    value.agreeSmsReception === true &&
                    value.emailCheck === 'complete' &&
                    value.authMobileButton === 'complete'
                  )
                }
              >
                동의하고 가입하기
              </LoginButton>
            </div>
          </div>
        </div>
        {/* 모바일 본인인증 팝업 오픈을 위한 숨겨진 폼 */}
        <form name="form_chk" method="post" style={{ display: 'none' }}>
          <input type="hidden" name="m" value="checkplusSerivce" />
          <input
            type="hidden"
            name="EncodeData"
            value={this.props.authmobile.authKey}
          />
        </form>
      </ModalWrapper>
    );
  }
}

export default LuckydrawSignup;
