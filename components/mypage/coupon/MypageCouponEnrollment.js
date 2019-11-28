import React, { useState, useEffect } from 'react';
import css from './MypageCouponEnrollment.module.scss';
import { inject } from 'mobx-react';
function MypageCouponEnrollment({ mypageCoupon }) {
  const [couponNumber, setCouponNumber] = useState('');

  const couponRegisterHandle = e => {
    setCouponNumber(e.target.value);
  };

  const buttonClickHandle = () => {
    setCouponNumber('');
    mypageCoupon.couponRegister();
  };
  useEffect(() => {
    mypageCoupon.couponRegisterHandle(couponNumber);
  }, [couponNumber]);

  return (
    <div className={css.wrap}>
      <div className={css.title}>쿠폰등록</div>
      <div className={css.subTitle}>
        구하다 프로모션 쿠폰 및 포인트 적립 쿠폰을 등록하세요.
      </div>
      <div className={css.couponRegister}>
        <div className={css.couponInput}>
          <input
            type="text"
            onChange={e => {
              couponRegisterHandle(e);
            }}
            placeholder="쿠폰번호 입력"
            value={couponNumber || ''}
          />
        </div>
        <div
          className={css.button}
          onClick={() => {
            buttonClickHandle();
          }}
        >
          쿠폰 등록
        </div>
      </div>
    </div>
  );
}

export default inject('mypageCoupon')(MypageCouponEnrollment);
