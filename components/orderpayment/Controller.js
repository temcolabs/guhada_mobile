import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Controller.module.scss';

@inject('orderpayment')
@observer
class Controller extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.totalOrder}>
          주문 상품 <span>{orderpayment.orderProductInfo.length}</span>개
        </div>
        <div
          className={css.button}
          onClick={() => {
            orderpayment.orderProductOnOff();
          }}
        >
          {orderpayment.status.orderProductOnOffStatus ? (
            <img src="/static/icon/m_off_minus.png" alt="주문상품닫기" />
          ) : (
            <img src="/static/icon/m_on_plus.png" alt="주문상품펼치기" />
          )}
        </div>
      </div>
    );
  }
}

export default Controller;
