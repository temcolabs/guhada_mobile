import React from 'react';
import css from './MypageValidCouponList.module.scss';
import DataEmpty from 'components/common/DataEmpty';

import { inject, observer } from 'mobx-react';

@inject('mypageCoupon')
@observer
class MypageAvailableCouponList extends React.Component {
  render() {
    let { mypageCoupon } = this.props;

    return (
      <div className={css.wrap}>
        <div className={css.title}>사용 가능 쿠폰</div>
        {mypageCoupon.validCouponList.length > 0 ? (
          mypageCoupon.validCouponList.map((data, index) => {
            return (
              <ul key={index}>
                <li className={css.coupon__list__item}>
                  <div className={css.coupon}>
                    <div className={css.coupon__header}>
                      <div className={css.coupon__title}>
                        {data.couponTitle}
                      </div>
                      <div className={css.coupon__status}>
                        {data.status === 'USED' ? '사용완료' : '기간만료'}
                      </div>
                    </div>
                    <div className={css.coupon__amount}>
                      {data.discountPrice ? (
                        <div>
                          {`${data.discountPrice.toLocaleString()}`}
                          <span>원 할인</span>
                        </div>
                      ) : data.discountRate ? (
                        <div>
                          {`${data.discountRate * 100}`}
                          <span>% 할인</span>
                        </div>
                      ) : null}
                    </div>

                    <div className={css.coupon__number}>
                      {`쿠폰번호 ${data.couponNumber}`}
                    </div>
                  </div>
                  <div className={css.coupon__seller}>
                    <div className={css.seller}>
                      {data.sellerImgUrl ? (
                        <div
                          className={css.seller__logo}
                          style={{
                            backgroundImage: `url(${data.sellerImgUrl})`,
                          }}
                        />
                      ) : null}
                      <div className={css.seller__name}>
                        {data.sellerName || ''}
                      </div>
                    </div>
                    <div
                      className={css.coupon__delete}
                      onClick={() => {
                        mypageCoupon.deleteCoupon(data.couponNumber);
                      }}
                    />
                  </div>
                </li>
                <li className={css.coupon__limit}>
                  <div>
                    {data.minimumPrice > 0
                      ? `・ ${data.minimumPrice?.toLocaleString()} 이상 구매시`
                      : null}
                    {data.maximumDiscountPrice > 0
                      ? ` (최대 ${data.maximumDiscountPrice?.toLocaleString()}원 할인)`
                      : null}
                  </div>

                  <div>{`・ ${data.startAt} ~ ${data.endAt} 까지`} </div>
                </li>
              </ul>
            );
          })
        ) : (
          <DataEmpty text={'사용 가능 쿠폰이 없습니다.'} PADDING={'50px 0'} />
        )}
        {mypageCoupon.validTotalPage > 1 &&
        mypageCoupon.validTotalPage > mypageCoupon.validCouponPage ? (
          <div
            className={css.more}
            onClick={() => {
              mypageCoupon.getMoreVaildCoupon();
            }}
          >
            더 보기
            <i className={css.detailBtn} />
          </div>
        ) : null}
      </div>
    );
  }
}

export default MypageAvailableCouponList;
