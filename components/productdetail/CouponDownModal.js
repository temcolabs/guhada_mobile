import { Component, Fragment } from 'react';
import css from './CouponDownModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
@inject('productdetail', 'productoption', 'sellerfollow')
@observer
class CouponDownModal extends Component {
  render() {
    const { productoption, isVisible, sellerfollow } = this.props;
    return (
      <Fragment>
        <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
          <div className={css.wrap}>
            <div className={css.couponLayout}>
              <div className={css.close}>
                <div
                  className={css.modalClose}
                  onClick={() => {
                    productoption.couponDownModalClose();
                  }}
                />
              </div>
              <div className={css.title}>
                <div>현재 발급 가능한 쿠폰</div>
                <div>발급받은 쿠폰은 마이페이지에서 확인할 수 있습니다.</div>
              </div>
              <div className={css.couponContainer}>
                {productoption.dueSavebenefitCoupon.map((data, index) => {
                  return data.alreadySaved ? null : (
                    <div className={css.couponWrap} key={index}>
                      <div className={css.coupon}>
                        <div className={css.couponSeller}>
                          {data.sellerName ? data.sellerName : ''}
                        </div>
                        <div className={css.couponAmount}>
                          {data.discountType === 'RATE' ? (
                            <div>
                              {`${(data.discountRate * 100).toFixed(0)}`}
                              <span>% 할인</span>
                            </div>
                          ) : (
                            <div>
                              {`${data.discountPrice.toLocaleString()}`}
                              <span>원 할인</span>
                            </div>
                          )}
                        </div>
                        <div className={css.couponTitle}>
                          {data.couponTitle ? data.couponTitle : ''}
                        </div>
                      </div>
                      <div className={css.couponNotice}>
                        {data.minimumPrice ? (
                          <div>{` ㆍ ${data.minimumPrice?.toLocaleString()}원 이상 결제 시 사용가능`}</div>
                        ) : null}
                        {data.maximumDiscountPrice ? (
                          <div>{` ㆍ ${data.maximumDiscountPrice?.toLocaleString()}원 까지할인`}</div>
                        ) : null}

                        <div>ㆍ 발급일로부터 {data.expireAt}일간 유효</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className={css.confirmButton}
                onClick={() => {
                  productoption.couponDown();
                }}
              >
                모든 쿠폰 받기
              </div>
            </div>
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default CouponDownModal;
