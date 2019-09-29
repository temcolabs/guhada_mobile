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
          {orderPaymentTotalInfo.paymentsMethod.map((data, index) => {
            return (
              <li key={index}>
                <label
                  onClick={() => {
                    orderpayment.setPaymentMethod(data.methodCode);
                  }}
                >
                  <input type="radio" name="paymentMethod" />
                  <div className={css.checkBox} />
                  <div className={css.methodName}>{data.methodName}</div>
                </label>
              </li>
            );
          })}
        </ul>

        <div className={css.paymentForm}>
          <form id="paymentForm" method="POST" acceptCharset="euc-kr">
            <input
              readOnly
              type="text"
              name="version"
              value={paymentForm.version || ''}
            />

            <input
              readOnly
              type="text"
              name="P_MID"
              value={paymentForm.mid || ''}
            />

            <input
              readOnly
              type="text"
              name="P_GOODS"
              value={paymentForm.goodname || ''}
            />

            <input
              readOnly
              type="text"
              name="P_AMT"
              value={paymentForm.price || ''}
            />

            <input
              readOnly
              type="text"
              name="P_UNAME"
              value={paymentForm.buyername || ''}
            />

            <input
              readOnly
              type="text"
              name="P_MOBILE"
              value={paymentForm.buyertel || ''}
            />

            <input
              readOnly
              type="text"
              name="P_EMAIL"
              value={paymentForm.buyeremail || ''}
            />

            <input
              readOnly
              type="text"
              name="P_RETURN_URL"
              value={paymentForm.returnUrl || ''}
            />

            <input
              readOnly
              type="text"
              name="P_NEXT_URL"
              value={paymentForm.nextUrl || ''}
            />

            <input
              readOnly
              type="text"
              name="gopaymethod"
              value={paymentForm.gopaymethod || ''}
            />

            <input
              readOnly
              type="text"
              name="P_CARD_OPTION"
              value={paymentForm.ini_cardcode || ''}
            />

            <input
              readOnly
              type="text"
              name="P_OID"
              value={paymentForm.oid || ''}
            />

            <input
              readOnly
              type="text"
              name="P_TIMESTAMP"
              value={paymentForm.timestamp || ''}
            />

            <input
              readOnly
              type="text"
              name="currency"
              value={paymentForm.currency || ''}
            />

            <input
              readOnly
              type="text"
              name="P_SIGNATURE"
              value={paymentForm.signature || ''}
            />

            <input
              readOnly
              type="text"
              name="P_MKEY"
              value={paymentForm.mKey || ''}
            />

            <input
              readOnly
              type="text"
              name="P_OFFER_PERIOD"
              value={paymentForm.offerPeriod || ''}
            />

            <input
              readOnly
              type="text"
              name="P_RESERVED"
              value={paymentForm.acceptmethod || ''}
            />

            <input
              readOnly
              type="text"
              name="languageView"
              value={paymentForm.languageView || ''}
            />

            <input
              readOnly
              type="text"
              name="P_CHARSET"
              value={paymentForm.charset || ''}
            />

            <input
              readOnly
              type="text"
              name="P_HPP_METHOD"
              value={paymentForm.acceptmethod || ''}
            />

            <input
              readOnly
              type="text"
              name="payViewType"
              value={paymentForm.payViewType || ''}
            />

            <input
              readOnly
              type="text"
              name="closeUrl"
              value={paymentForm.closeUrl || ''}
            />

            <input
              readOnly
              type="text"
              name="popupUrl"
              value={paymentForm.popupUrl || ''}
            />

            <input
              readOnly
              type="text"
              name="ansim_quota"
              value={paymentForm.quotabase || ''}
            />

            <input type="hidden" name="vbankTypeUse" value="1" />

            <br />
            <input
              readOnly
              type="text"
              name="P_QUOTABASE"
              value={paymentForm.quotabase || ''}
            />
            <br />
            <input
              readOnly
              type="text"
              name="ini_onlycardcode"
              value={paymentForm.ini_onlycardcode || ''}
            />

            <br />
            <input
              readOnly
              type="text"
              name="lotteJs"
              value={paymentForm.jsUrl || ''}
              ref={this.textInput}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default PaymentMethod;
