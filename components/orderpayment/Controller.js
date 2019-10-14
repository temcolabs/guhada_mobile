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
          {` 주문 상품 ${orderpayment.orderProductInfo?.length || 0}개`}
        </div>
        <div
          className={css.button}
          onClick={() => {
            orderpayment.orderProductOnOff();
          }}
          style={
            orderpayment.status.orderProductOnOffStatus
              ? { backgroundImage: `url(/static/icon/m_off_minus.png)` }
              : { backgroundImage: `url(/static/icon/m_on_plus.png)` }
          }
        />
      </div>
    );
  }
}

export default Controller;
