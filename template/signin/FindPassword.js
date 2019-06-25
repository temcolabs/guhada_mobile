import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { LoginWrapper } from 'components/login';
import css from './FindId.module.scss';
import FindLoginInfoHeader from 'components/login/FindLoginInfoHeader';

export class FindPassword extends Component {
  render() {
    return (
      <DefaultLayout pageTitle={'아이디/비밀번호 찾기'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <FindLoginInfoHeader select={'FindPassword'} />
          </div>
        </LoginWrapper>
      </DefaultLayout>
    );
  }
}

export default FindPassword;
