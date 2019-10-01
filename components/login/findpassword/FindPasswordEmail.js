import css from './FindPasswordMobile.module.scss';
import { LoginInput, LoginButton } from 'components/login';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import LoginInputButton from '../LoginInputButton';

@inject('countdown')
@observer
export class FindPasswordEmail extends Component {
  render() {
    const { form } = this.props;
    let value = form.get('value');
    return (
      <div>
        <div className={css.subHeader}>
          본인인증한 회원의 이메일로 비밀번호를 재설정합니다.
        </div>
        <div className={css.findPasswordWrap}>
          <LoginInput field={form.$('name')} />

          {value.resendButton !== true ? (
            <>
              <LoginInput field={form.$('email')} />
              <LoginButton
                className={
                  !(value.name && value.email) ? 'isGray' : 'isColored'
                }
                onClick={form.$('email').onSubmit}
                disabled={!(value.name && value.email)}
              >
                인증번호 요청
              </LoginButton>
            </>
          ) : (
            <>
              <LoginInputButton
                field={form.$('email')}
                button={form.$('resendButton')}
              />
              <LoginInput
                field={form.$('verificationNumber')}
                countDown={this.props.countdown.time}
                maxLength={6}
              />
              <LoginButton
                className={
                  !(
                    value.name &&
                    value.email &&
                    value.verificationNumber.length === 6
                  )
                    ? 'isGray'
                    : 'isColored'
                }
                onClick={form.onSubmit}
                disabled={
                  !(
                    value.name &&
                    value.email &&
                    value.verificationNumber.length === 6
                  )
                }
              >
                인증완료
              </LoginButton>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default FindPasswordEmail;
