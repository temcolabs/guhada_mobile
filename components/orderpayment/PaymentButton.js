import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentButton.module.scss';
@inject('orderpayment', 'alert')
@observer
class PaymentButton extends Component {
  render() {
    let { orderpayment, alert } = this.props;

    // return orderpayment.status.orderPaymentAgreement ? (
    //   <div
    //     className={css.wrap}
    //     style={{ backgroundColor: '#5d2ed1' }}
    //     onClick={() => {
    //       orderpayment.payment();
    //     }}
    //   >
    //     결제하기
    //   </div>
    // ) : (
    //   <div
    //     className={css.wrap}
    //     style={{ backgroundColor: '#ddd' }}
    //     onClick={() => {
    //       alert.showAlert({
    //         content:
    //           '구매 및 결제대행서비스 이용약관 확인 후 동의하셔야 구매가 가능합니다.',
    //       });
    //     }}
    //   >
    //     결제하기
    //   </div>
    // );
    return (
      <div
        className={css.wrap}
        style={{ backgroundColor: '#5d2ed1' }}
        onClick={() => {
          orderpayment.payment();
        }}
      >
        결제하기
      </div>
    );
  }
}

export default PaymentButton;
