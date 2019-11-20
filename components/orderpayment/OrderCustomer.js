import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderCustomer.module.scss';
import AuthenticationModal from './modal/AuthenticationModal';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
@inject('orderpayment', 'authmobile', 'customerauthentication')
@observer
class OrderCustomer extends Component {
  state = {
    modalHandle: false,
  };

  modalShow = () => {
    this.setState({
      modalHandle: true,
    });
  };

  modalClose = () => {
    this.setState({
      modalHandle: false,
    });
  };

  render() {
    let { orderpayment, customerauthentication } = this.props;

    return (
      <div className={css.wrap}>
        <div className={css.headerSection}>
          <div className={css.title}>주문자 정보</div>
          {customerauthentication.userVerify ? (
            orderpayment.orderUserInfo.emailVerify ? null : (
              <div
                className={css.identification}
                onClick={() => {
                  this.modalShow();
                }}
              >
                <span>[필수] </span> 이메일인증
                <div className={css.arrow} />
              </div>
            )
          ) : (
            <div
              className={css.identification}
              onClick={() => {
                this.modalShow();
              }}
            >
              <span>[필수] </span> 본인인증
              <div className={css.arrow} />
            </div>
          )}
        </div>
        {orderpayment?.orderUserInfo?.name ? (
          <div className={css.customerName}>{`${
            orderpayment.orderUserInfo.name
          } ${addHyphenToMobile(orderpayment.orderUserInfo?.mobile) ||
            ''}`}</div>
        ) : null}

        <AuthenticationModal
          isVisible={this.state.modalHandle}
          modalClose={() => {
            this.modalClose();
          }}
        />
      </div>
    );
  }
}

export default OrderCustomer;
