import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentMethod.module.scss';

@inject('orderpayment')
@observer
class PaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  componentDidUpdate() {
    let { orderpayment } = this.props;
    let paymentMethod = this.textInput.current.value;
    if (paymentMethod) {
      orderpayment.paymentStart();
    }
  }

  render() {
    let { orderpayment } = this.props;
    let { paymentForm, orderPaymentTotalInfo } = orderpayment;

    return (
      <div className={css.wrap}>
        <div className={css.title}>결제 수단</div>
        <ul className={css.paymentMethod}>
          {orderPaymentTotalInfo.paymentsMethod.map(data => {
            return (
              <li>
                <input
                  type="radio"
                  onClick={() => {
                    orderpayment.setPaymentMethod(data.methodCode);
                  }}
                  id={data.methodCode}
                  name="paymentMethod"
                />
                <label
                  htmlFor={data.methodCode}
                  onClick={() => {
                    orderpayment.setPaymentMethod(data.methodCode);
                  }}
                >
                  {data.methodName}
                </label>
              </li>
            );
          })}
        </ul>

        {/* prettier-ignore */}
        <div className={css.paymentForm}>
          <form id="paymentForm" method="POST">
            <input readOnly type="hidden" name="version" value={paymentForm.version} />
            <br />
            <input readOnly type="hidden" name="mid" value={paymentForm.mid} />
            <br />
            <input readOnly type="hidden" name="goodname" value={paymentForm.goodname} />
            <br />
            <input readOnly type="hidden" name="price" value={paymentForm.price} />
            <br />
            <input readOnly type="hidden" name="buyername" value={paymentForm.buyername} />
            <br />
            <input readOnly type="hidden" name="buyertel" value={paymentForm.buyertel} />
            <br />
            <input readOnly type="hidden" name="buyeremail" value={paymentForm.buyeremail} />
            <br />
            <input readOnly type="hidden" name="returnUrl" value={paymentForm.returnUrl} />
            <br />
            <input ref={this.textInput} readOnly type="hidden" name="gopaymethod" value={paymentForm.gopaymethod} />
            <br />
            <input readOnly type="hidden" name="ini_cardcode" value={paymentForm.ini_cardcode} />
            <br />
            <input readOnly type="hidden" name="oid" value={paymentForm.oid} />
            <br />
            <input readOnly type="hidden" name="timestamp" value={paymentForm.timestamp} />
            <br />
            <input readOnly type="hidden" name="currency" value={paymentForm.curreny} />
            <br />
            <input readOnly type="hidden" name="signature" value={paymentForm.signature} />
            <br />
            <input readOnly type="hidden" name="mKey" value={paymentForm.mKey} />
            <br />
            <input readOnly type="hidden" name="offerPeriod" value={paymentForm.offerPeriod} />
            <br />
            <input readOnly type="hidden" name="acceptmethod" value={paymentForm.acceptmethod} />
            <br />
            <input readOnly type="hidden" name="languageView" value={paymentForm.languageView} />
            <br />
            <input readOnly type="hidden" name="charset" value={paymentForm.charset} />
            <br />
            <input readOnly type="hidden" name="payViewType" value={paymentForm.payViewType} />
            <br />
            <input readOnly type="hidden" name="closeUrl" value={paymentForm.closeUrl} />
            <br />
            <input readOnly type="hidden" name="popupUrl" value={paymentForm.popupUrl} />
            <br />
            <input readOnly type="hidden" name="jsUrl" value={paymentForm.jsUrl} />
            <br />
            <input readOnly type="hidden" name="ansim_quota" value={paymentForm.ansim_quota} />
            <br />
            <input readOnly type="hidden" name="vbankTypeUse" value={paymentForm.vbankTypeUse} />
            <input readOnly type="hidden" name="quotabase" value={paymentForm.quotabase} />
            <br />
            <input readOnly type="hidden" name="ini_onlycardcode" value={paymentForm.ini_onlycardcode} />
            <br />
          </form>
        </div>
      </div>
    );
  }
}

export default PaymentMethod;
