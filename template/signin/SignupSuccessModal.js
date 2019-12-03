import React, { Component } from 'react';
import css from './SignupSuccessModal.module.scss';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import Router from 'next/router';
import { LinkRoute } from 'childs/lib/router';

export class SignupSuccessModal extends Component {
  onClose = () => {
    this.props.isHandleModal(false);
    Router.push('/');
  };

  render() {
    return (
      <ModalWrapper
        isOpen={this.props.isOpen}
        onClose={() => {}}
        contentStyle={{
          position: 'fixed',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        isBigModal={true}
        contentLabel={'SignupSuccess'}
        zIndex={1000}
      >
        <div className={css.wrap}>
          <div className={css.close} onClick={() => this.onClose()} />
          <div className={css.mainImage} />
          <div className={css.header}>환영합니다!</div>
          <div className={css.contents}>회원님의 아이디</div>
          <div className={css.email}>{this.props.email}</div>
          <LinkRoute href="/login/login">
            <a className={css.loginLink}>로그인</a>
          </LinkRoute>
        </div>
      </ModalWrapper>
    );
  }
}

export default SignupSuccessModal;
