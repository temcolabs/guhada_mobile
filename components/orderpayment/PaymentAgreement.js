import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentAgreement.module.scss';
@inject('orderpayment')
@observer
class PaymentAgreement extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        {/* <label>
          <input
            type="checkbox"
            onChange={() => {
              orderpayment.orderPaymentAgreement();
            }}
            defaultChecked={orderpayment.status.orderPaymentAgreement}
          />
          <div />
          <span>[필수] </span>
          구매 및 결제대행서비스 이용약관 동의
        </label> */}
        <div className={css.termsNotify}>
          위 주문 내용을 확인 하였으며, 회원 본인 결제에 동의 합니다.
        </div>
        <div className={css.terms}>
          <a
            href={`${process.env.HOSTNAME}/terms/purchase`}
            target="_blank"
            rel="noopener noreferrer"
          >
            보기
          </a>
        </div>
      </div>
    );
  }
}

export default PaymentAgreement;
