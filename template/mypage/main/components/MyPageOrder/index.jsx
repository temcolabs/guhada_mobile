import { memo } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import css from './MyPageOrder.module.scss';
import cn from 'classnames';

import { pushRoute } from 'childs/lib/router';
import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  linkArrow: '/static/icon/payment_link_arrow.png',
  mypageArrow: '/static/icon/mypage/mypages-orderdashboard-arrow-m@3x.png',
};

/**
 * 마이페이지 > 주문,배송 조회
 * @param {*} myOrderStatus, orderCompleteListStore.myOrderStatus
 * @returns
 */
function MyPageOrder({
  myOrderStatus = {
    waitingPayment: 0,
    paymentComplete: 0,
    prepareProduct: 0,
    sending: 0,
    deliveryComplete: 0,
  },
}) {
  const {
    waitingPayment,
    paymentComplete,
    prepareProduct,
    sending,
    deliveryComplete,
  } = myOrderStatus;

  return (
    <div
      className={cn(css.myPageOrder)}
      onClick={() => pushRoute('/mypage/orders/complete/list')}
    >
      <div className={cn(css.header)}>
        <div className={cn(css.title)}>주문 배송</div>
        <div className={cn(css.more)}>
          <span>전체</span>
          <span>
            <Image src={IMAGE_PATH.linkArrow} width={'14px'} height={'14px'} />
          </span>
        </div>
      </div>
      <div className={cn(css.orderItemSection)}>
        <div>
          <div className={cn(css.orderItem__value)}>
            {Number.isInteger(waitingPayment) ? waitingPayment : '-'}
          </div>
          <div className={cn(css.orderItem__value)}>
            {Number.isInteger(paymentComplete) ? paymentComplete : '-'}
          </div>
          <div className={cn(css.orderItem__value)}>
            {Number.isInteger(prepareProduct) ? prepareProduct : '-'}
          </div>
          <div className={cn(css.orderItem__value)}>
            {Number.isInteger(sending) ? sending : '-'}
          </div>
          <div className={cn(css.orderItem__value)}>
            {Number.isInteger(deliveryComplete) ? deliveryComplete : '-'}
          </div>
        </div>
        <div>
          <div className={cn(css.orderItem__desc)}>입금확인</div>
          <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
          <div className={cn(css.orderItem__desc)}>결제완료</div>
          <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
          <div className={cn(css.orderItem__desc)}>상품준비</div>
          <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
          <div className={cn(css.orderItem__desc)}>배송중</div>
          <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
          <div className={cn(css.orderItem__desc)}>배송완료</div>
        </div>
      </div>
    </div>
  );
}

MyPageOrder.propTypes = {
  myOrderStatus: PropTypes.object.isRequired,
};

export default memo(observer(MyPageOrder));
