import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Controller.module.scss';

@inject('orderpayment')
@observer
class Controller extends Component {
  render() {
    let { orderpayment } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.header}>
          <div
            className={css.back}
            onClick={() => {
              orderpayment.shippingListModalClose();
            }}
          />
          <div className={css.title}>배송지 변경</div>
        </div>

        <div className={css.tabButton}>
          <div
            className={
              this.props.orderpayment.status.addressSelf
                ? css.tab_off
                : css.tab_on
            }
            onClick={() => {
              this.props.orderpayment.addressListShow();
            }}
          >
            배송지목록
          </div>
          <div
            className={
              this.props.orderpayment.status.addressSelf
                ? css.tab_on
                : css.tab_off
            }
            onClick={() => {
              this.props.orderpayment.addressSelfShow();
            }}
          >
            배송지 직접 입력
          </div>
        </div>
      </div>
    );
  }
}

export default Controller;
