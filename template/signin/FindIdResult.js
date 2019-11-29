import React, { Component } from 'react';
import FindLoginInfoHeader from 'components/login/FindLoginInfoHeader';
import LoginLayout from 'components/layout/LoginLayout';
import { LoginWrapper, LoginButton } from 'components/login';
import { observer, inject } from 'mobx-react';
import css from './FindIdResult.module.scss';
import { LinkRoute } from 'childs/lib/router';
import copy from 'copy-to-clipboard';
import API from 'childs/lib/API';
@inject('alert')
@observer
class FindIdResult extends Component {
  notificationMobile = () => {
    const { formValue, alert } = this.props;
    if (_.isNil(formValue.diCode) === true) {
      API.user
        .post(`/notification/mobile/id`, {
          mobile: formValue.values().mobile.replace(/[^0-9]/g, ''),
          name: formValue.values().name,
        })
        .then(function(res) {
          alert.showAlert('아이디가 휴대폰으로 발송되었습니다.');
        })
        .catch(e => {
          console.error(e);
        });
    } else {
      API.user
        .post(`/notification/mobile/id`, {
          diCode: formValue.diCode,
          mobile: formValue.mobile.replace(/[^0-9]/g, ''),
          name: formValue.name,
        })
        .then(function(res) {
          alert.showAlert('아이디가 휴대폰으로 발송되었습니다.');
        })
        .catch(e => {
          console.error(e);
        });
    }
  };
  render() {
    const { form } = this.props;
    let value = form.values();
    return (
      <LoginLayout pageTitle={'아이디/비밀번호 찾기'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <FindLoginInfoHeader select={'FindId'} />

            <div className={css.itemWrap}>
              입력하신 정보와 일치하는 아이디입니다.
              <div className={css.emailWrap}>
                <div className={css.email}>{value.email}</div>
                <div className={css.joinDate}>{`(${value.joinAt})`}</div>
                {form.$('authMobile').value === true && (
                  <div>
                    <button onClick={() => copy(form.$('email').value)}>
                      아이디 복사
                    </button>
                  </div>
                )}
              </div>
              {form.$('authMobile').value !== true && (
                <div className={css.subText}>
                  개인정보보호를 위해 아이디 뒷자리는 *로 표시됩니다.
                </div>
              )}
            </div>
            <div className={css.itemWrap}>
              아이디 휴대폰으로 발송하기
              <div className={css.mobileWrap}>
                <div className={css.mobileLabel}>
                  휴대폰 번호<span>{value.phoneNumber}</span>
                </div>
                <button onClick={() => this.notificationMobile()}>
                  아이디 발송하기
                </button>
              </div>
            </div>
            <LinkRoute href="/login/">
              <a>
                <LoginButton
                  className="isColored"
                  style={{ marginTop: '10px' }}
                >
                  로그인하러 가기
                </LoginButton>
              </a>
            </LinkRoute>
          </div>
        </LoginWrapper>
      </LoginLayout>
    );
  }
}

export default FindIdResult;
