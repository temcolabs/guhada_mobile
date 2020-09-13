import React, { Component } from 'react';
import LoginLayout from 'components/layout/LoginLayout';
import { LoginWrapper, LoginInput, LoginButton } from 'components/login';
import css from './FindPasswordResult.module.scss';
import { LinkRoute, pushRoute } from 'childs/lib/router';
import { observer } from 'mobx-react';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import { root } from 'store';
import _ from 'lodash';

@observer
class FindPasswordResult extends Component {
  newPassword = () => {
    const { form, formValue, verificationTargetType } = this.props;
    form.validate({ showErrors: true }).then(({ isValid }) => {
      if (isValid === true) {
        // 이메일, 핸드폰인증으로 비밀번호 바꾸기
        if (_.isNil(formValue.diCode) === true) {
          API.user
            .post('/verify/change-password', {
              newPassword: form.values().passwordConfirm,
              verificationNumber: formValue.values().verificationNumber,
              verificationTarget:
                verificationTargetType === 'MOBILE'
                  ? formValue.values().mobile.replace(/[^0-9]/g, '')
                  : formValue.values().email,
              verificationTargetType: verificationTargetType,
            })
            .then(function(res) {
              formValue.update({
                email: [],
                verificationNumber: [],
              });

              pushRoute('/login');
            })
            .catch(e => {
              if (_.get(e, 'status') === 200) {
                root.toast.getToast(_.get(e, 'data.message'));
              }
              console.error(e);
            });
        } else {
          // 본인인증으로 비밀번호 바꾸기
          API.user
            .post('/verify/identity/change-password', {
              diCode: formValue.diCode,
              mobile: formValue.mobile,
              newPassword: form.values().passwordConfirm,
            })
            .then(function(res) {
              pushRoute('/login');
            })
            .catch(e => {
              devLog(e);
            });
        }
      }
    });
  };

  render() {
    const { form, formValue } = this.props;
    let value = form.get('value');
    let valueUser;
    if (_.isNil(formValue.diCode) === true) valueUser = formValue.get('value');

    return (
      <LoginLayout pageTitle={'아이디/비밀번호 찾기'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div className={css.header}>
              <span className={css.headerText}>
                {valueUser ? valueUser.name : formValue.name}
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
              8~15자의 영문, 숫자, 특수문자 중 2개 이상 조합
            </div>
            <LoginButton
              className={
                !(value.password && value.passwordConfirm)
                  ? 'isGray'
                  : 'isColored'
              }
              onClick={this.newPassword}
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
