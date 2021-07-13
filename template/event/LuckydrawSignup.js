import { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import Form from 'stores/form-store/_.forms';
import css from './LuckydrawSignup.module.scss';
import { LoginInput, LoginCheckBox, LoginButton } from 'components/login';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import SignupInputButtonChange from 'components/login/SignupInputButtonChange';
import _ from 'lodash';

@inject('login', 'authmobile')
@observer
class LuckydrawSignup extends Component {
  render() {
    const { login } = this.props;
    let form =
      login.loginPosition === 'luckydrawSNS'
        ? Form.signUpSNSLuckydraw
        : Form.signUpLuckydraw;

    let value;

    if (_.isNil(form)) {
      return null;
    } else {
      value = form.get('value');
    }

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
        zIndex={999}
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
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#111111',
                  paddingTop: '15px',
                  paddingBottom: '10px',
                }}
              >
                필수약관
              </div>
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
            <div className={css.eventTextWarp}>
              <div className={css.eventText}>
                ※ 이벤트 참여는 본인인증 및 마케팅 수신(이메일, 문자) 동의
                시에만 이용 가능합니다.
              </div>
              <div className={css.eventText}>
                ※ 마케팅 수신에 동의한 개인 정보는 이벤트 정보 안내 및 이벤트
                이용에만 활용됩니다.
              </div>
              <div className={css.eventText}>
                ※ 결제/교환/환불 등과 관련된 내용은 거래 안전을 위하여 수신
                동의와 관계없이 발송됩니다.
              </div>
            </div>
            <div>
              <LoginButton
                className={
                  !(
                    value.agreePurchaseTos &&
                    value.agreeCollectPersonalInfoTos &&
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
