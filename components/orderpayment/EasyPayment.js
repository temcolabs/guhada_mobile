import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './EasyPayment.module.scss';

@inject('orderpayment')
@observer
class EasyPayment extends Component {    
    
    render() {
        let { orderpayment } = this.props;
        return (
            <div className={css.wrap}>
                <div className={css.section}>
                    <div className={css.statusWrap}>
                        <label>
                            <input
                                type="radio"
                                name="receiptStatus"
                                value="NAVER"                                
                                onChange={e => {
                                    orderpayment.setPaymentMethod(e.target.value);}
                                }
                            />
                            <div className={css.radioBtn} />
                            <span className={css.naverPay} />
                            <div className={css.radioTxt}>네이버페이</div>
                        </label>
                    </div>
                </div>
                {/**
                <hr style={{
                    color: '#FFFFFF',
                    backgroundColor: '#FFFFFF',
                    height: .2,
                    borderColor: '#FFFFFF'
                }} />
                 */}
                <div className={css.section}>
                    <div className={css.statusWrap}>
                        <label>
                            <input
                                type="radio"
                                name="receiptStatus"
                                value="KAKAO"
                                onChange={e => {
                                    orderpayment.setPaymentMethod(e.target.value);}
                                }
                            />
                            <div className={css.radioBtn} />
                            <span className={css.kakaoPay} />
                            <div className={css.radioTxt}>카카오페이</div>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

}

export default EasyPayment;