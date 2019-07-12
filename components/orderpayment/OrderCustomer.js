import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './OrderCustomer.module.scss';

@inject('orderpayment')
@observer
class OrderCustomer extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.headerSection}>
          <div className={css.title}>주문자 정보</div>
          <div className={css.identification}>
            <span>[필수] </span> 본인인증
            <div className={css.arrow} />
          </div>
        </div>
        <div className={css.customerName}>{`${
          orderpayment.orderUserInfo.name
        } ${orderpayment.orderUserInfo.mobile}`}</div>
      </div>
    );
  }
}

export default OrderCustomer;
