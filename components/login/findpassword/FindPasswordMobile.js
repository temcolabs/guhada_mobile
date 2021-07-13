import css from './FindPasswordMobile.module.scss';
import { LoginInput, LoginButton } from 'components/login';
import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import LoginInputButton from '../LoginInputButton';

@inject('countdown')
@observer
class FindPasswordMobile extends Component {
  componentDidMount() {
    let { countdown } = this.props;
    countdown.setTime(0);
  }

  componentWillUnmount() {
    clearInterval(this.props.countdown.timer);
  }

  render() {
    const { form } = this.props;
    let value = form.get('value');
    return (
      <div>
        <div className={css.subHeader}>
          본인인증한 휴대폰 번호로 비밀번호를 재설정합니다.
        </div>
        <div className={css.findPasswordWrap}>
          <LoginInput field={form.$('name')} />
          <LoginInput field={form.$('email')} />

          {value.resendButton !== true ? (
            <>
              <LoginInput field={form.$('mobile')} />
              <LoginButton
                className={
                  !(value.name && value.email && value.mobile.length === 13)
                    ? 'isGray'
                    : 'isColored'
                }
                onClick={form.$('mobile').onSubmit}
                disabled={
                  !(value.name && value.email && value.mobile.length === 13)
                }
              >
                인증번호 요청
              </LoginButton>
            </>
          ) : (
            <>
              <LoginInputButton
                field={form.$('mobile')}
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
                    value.mobile &&
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
                    value.mobile &&
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

export default FindPasswordMobile;
