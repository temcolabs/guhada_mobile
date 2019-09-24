import React, { Component, Fragment } from 'react';
import css from './CouponDownModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject, observer } from 'mobx-react';
@inject('productdetail', 'productoption')
@observer
class CouponDownModal extends Component {
  render() {
    const { productdetail, productoption, isVisible } = this.props;
    return (
      <Fragment>
        <SlideIn direction={slideDirection.BOTTOM} isVisible={isVisible}>
          <div className={css.wrap}>
            <div className={css.close}>
              <div
                className={css.modalClose}
                onClick={() => {
                  productoption.couponDownModalClose();
                }}
              />
            </div>
            <div className={css.title}>
              <div>셀러를 팔로우하고</div>
              <div>쿠폰을 받아보세요!</div>
              <div>팔로우한 셀러는 마이페이지에서 확인할 수 있습니다.</div>
            </div>
            {productoption.dueSavebenefitCoupon.map((data, index) => {
              return (
                <div className={css.couponWrap} key={index}>
                  <div className={css.coupon}>
                    <div className={css.couponSeller}>
                      {data.sellerName ? data.sellerName : ''}
                    </div>
                    <div className={css.couponAmount}>
                      {data.discountPrice ? (
                        <div>
                          {`${data.discountPrice.toLocaleString()}`}
                          <span>원 할인</span>
                        </div>
                      ) : (
                        <div>
                          {`${data.discountRate * 100}`}
                          <span>% 할인</span>
                        </div>
                      )}
                    </div>
                    <div className={css.couponTitle}>
                      {data.couponTitle ? data.couponTitle : ''}
                    </div>
                  </div>
                  <div className={css.couponNotice}>
                    {data.minimumPrice ? (
                      <div>{` ㆍ ${data.minimumPrice.toLocaleString()} 원 이상 결제시 사용가능`}</div>
                    ) : null}

                    <div>ㆍ 발급일부터 {data.expireAt} 일간 유효</div>
                  </div>
                </div>
              );
            })}

            <div
              className={css.confirmButton}
              onClick={() => {
                productoption.couponDown();
              }}
            >
              팔로우하고 쿠폰 받기
            </div>
          </div>
        </SlideIn>
      </Fragment>
    );
  }
}

export default CouponDownModal;
