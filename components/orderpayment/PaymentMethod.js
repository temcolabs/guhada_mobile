import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './PaymentMethod.module.scss';
import CardInterestModal from 'components/common/modal/CardInterestModal';
@inject('orderpayment', 'cardinterest')
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

  componentWillUnmount() {
    this.props.cardinterest.closeCardInterest();
  }

  render() {
    let { orderpayment, cardinterest } = this.props;
    let { paymentForm, orderInfo } = orderpayment;

    return (
      <div className={css.wrap}>
        <div className={css.title}>
          <div>결제수단</div>
          <div
            onClick={() => {
              cardinterest.getCardInterest();
            }}
          >
            무이자 할부 안내
          </div>
        </div>
        <ul className={css.paymentMethod}>
          {orderInfo.paymentsMethod.map((data, index) => {
            return (
              <li key={index}>
                <label
                  onClick={() => {
                    orderpayment.setPaymentMethod(data.methodCode);
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    defaultChecked={index === 0 ? true : false}
                  />
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
              type="hidden"
              name="version"
              value={paymentForm.version || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_MID"
              value={paymentForm.mid || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_GOODS"
              value={paymentForm.goodname || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_AMT"
              value={paymentForm.price || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_UNAME"
              value={paymentForm.buyername || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_MOBILE"
              value={paymentForm.buyertel || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_EMAIL"
              value={paymentForm.buyeremail || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_RETURN_URL"
              value={paymentForm.returnUrl || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_NEXT_URL"
              value={paymentForm.nextUrl || ''}
            />

            {orderpayment.paymentMethod === 'NAVER' || 'EASY' ? (
              <input
                readOnly
                type="hidden"
                name="P_INI_PAYMENT"
                value={paymentForm.gopaymethod || ''}
              />
            ) : (
              <input
                readOnly
                type="hidden"
                name="gopaymethod"
                value={paymentForm.gopaymethod || ''}
              />
            )}

            <input
              readOnly
              type="hidden"
              name="P_CARD_OPTION"
              value={paymentForm.ini_cardcode || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_OID"
              value={paymentForm.oid || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_TIMESTAMP"
              value={paymentForm.timestamp || ''}
            />

            <input
              readOnly
              type="hidden"
              name="currency"
              value={paymentForm.currency || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_SIGNATURE"
              value={paymentForm.signature || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_MKEY"
              value={paymentForm.mKey || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_OFFER_PERIOD"
              value={paymentForm.offerPeriod || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_RESERVED"
              value={paymentForm.acceptmethod || ''}
            />

            <input
              readOnly
              type="hidden"
              name="languageView"
              value={paymentForm.languageView || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_CHARSET"
              value={paymentForm.charset || ''}
            />

            <input
              readOnly
              type="hidden"
              name="P_HPP_METHOD"
              value={paymentForm.acceptmethod || ''}
            />

            <input
              readOnly
              type="hidden"
              name="payViewType"
              value={paymentForm.payViewType || ''}
            />

            <input
              readOnly
              type="hidden"
              name="closeUrl"
              value={paymentForm.closeUrl || ''}
            />

            <input
              readOnly
              type="hidden"
              name="popupUrl"
              value={paymentForm.popupUrl || ''}
            />

            <input
              readOnly
              type="hidden"
              name="ansim_quota"
              value={paymentForm.quotabase || ''}
            />

            <input
              readOnly
              type="hidden"
              name="vbankTypeUse"
              value={paymentForm.vbankTypeUse || ''}
            />

            <br />
            <input
              readOnly
              type="hidden"
              name="P_QUOTABASE"
              value={paymentForm.quotabase || ''}
            />
            <br />
            <input
              readOnly
              type="hidden"
              name="ini_onlycardcode"
              value={paymentForm.ini_onlycardcode || ''}
            />

            <br />
            <input
              readOnly
              type="hidden"
              name="lotteJs"
              value={paymentForm.jsUrl || ''}
              ref={this.textInput}
            />

            <br />
            <input
              readOnly
              type="hidden"
              name="P_VBANK_DT"
              value={paymentForm.vbankdt || ''}
            />
          </form>
        </div>
        <CardInterestModal
          isVisible={cardinterest.cardInterestIsOpen}
          onClose={() => {
            cardinterest.closeCardInterest();
          }}
        />
      </div>
    );
  }
}

export default PaymentMethod;
