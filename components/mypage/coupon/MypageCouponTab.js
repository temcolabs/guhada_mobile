import React from 'react';
import css from './MypageCouponTab.module.scss';
import { inject, observer } from 'mobx-react';

@inject('mypageCoupon')
@observer
class MypageCouponTab extends React.Component {
  render() {
    let { mypageCoupon } = this.props;

    return (
      <div className={css.wrap}>
        <div
          className={
            mypageCoupon.activeTab ? css.active__box : css.inactive__box
          }
          onClick={() => {
            mypageCoupon.validCoponTab();
          }}
        >
          <div className={css.couponCount}>
            사용 가능 쿠폰
            <span>{`${mypageCoupon.validTotalItem}장`}</span>
          </div>
        </div>
        <div
          className={
            mypageCoupon.activeTab ? css.inactive__box : css.active__box
          }
          onClick={() => {
            mypageCoupon.invalidCoponTab();
          }}
        >
          <div className={css.couponCount}>
            사용완료 ・ 기간만료 쿠폰
            <span>{`${mypageCoupon.invalidTotalItem}장`}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default MypageCouponTab;
