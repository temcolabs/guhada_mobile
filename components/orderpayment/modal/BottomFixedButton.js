import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './BottomFixedButton.module.scss';

@inject('orderpayment')
@observer
class BottomFixedButton extends Component {
  render() {
    let { orderpayment } = this.props;
    return orderpayment.status.addressSelf ? (
      <div className={css.wrap}>
        <div
          className={css.back}
          onClick={() => orderpayment.shippingListModalClose()}
        >
          입력 취소
        </div>
        <div
          className={css.complete}
          onClick={() => {
            orderpayment.selfAddressConfirm();
          }}
        >
          입력 완료
        </div>
      </div>
    ) : (
      <div className={css.wrap}>
        <div
          className={css.back}
          onClick={() => orderpayment.shippingListModalClose()}
        >
          돌아가기
        </div>
        <div
          className={css.complete}
          onClick={() => orderpayment.addressChangeConfirm()}
        >
          선택 완료
        </div>
      </div>
    );
  }
}

export default BottomFixedButton;
