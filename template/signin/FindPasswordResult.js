import React, { Component } from 'react';
import LoginLayout from 'components/layout/LoginLayout';
import { LoginWrapper, LoginInput, LoginButton } from 'components/login';
import css from './FindPasswordResult.module.scss';
import { LinkRoute } from 'lib/router';
import { observer } from 'mobx-react';

@observer
class FindPasswordResult extends Component {
  render() {
    const { form, formValue } = this.props;
    let value = form.values();
    let valueUser;
    if (formValue) valueUser = formValue.get('value');

    return (
      <LoginLayout pageTitle={'아이디/비밀번호 찾기'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div className={css.header}>
              <span className={css.headerText}>
                {valueUser ? valueUser.email : null}
              </span>{' '}
              님,
              <br />
              본인인증이 완료되었습니다.
              <br />
              새로운 비밀번호를 입력해주세요
              <br />
            </div>
            <LoginInput field={form.$('password')} type="password" />
            <LoginInput field={form.$('passwordConfirm')} type="password" />
            <div className={css.subText}>
              8~15자의 영문 대/소문자, 숫자, 특수문자 중 2개 이상 조합
            </div>
            <LoginButton
              className={
                !(value.password && value.passwordConfirm)
                  ? 'isGray'
                  : 'isColored'
              }
              onClick={form.onSubmit}
              disabled={!(value.password && value.passwordConfirm)}
            >
              확인
            </LoginButton>
            <div className={css.loginBtn}>
              <LinkRoute href="/login">
                <a>
                  <LoginButton className="isColored">
                    로그인하러 가기
                  </LoginButton>
                </a>
              </LinkRoute>
            </div>
          </div>
        </LoginWrapper>
      </LoginLayout>
    );
  }
}

export default FindPasswordResult;
