import css from './OrderDashboard.module.scss';
import cn from 'classnames';
import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  linkArrow: '/public/icon/payment_link_arrow.png',
  mypageArrow: '/public/icon/mypage/mypages-orderdashboard-arrow-m@3x.png',
};

/**
 * 주문배송 상단의 상태 요약 UI
 * @param {*} param0
 */
function OrderDashboard({
  data = {
    deliveryComplete: 0,
    paymentComplete: 0,
    prepareProduct: 0,
    sending: 0,
    waitingPayment: 0,
  },
}) {
  return (
    <div className={cn(css.orderDashboardWrap)}>
      {/* 입금확인 */}
      <div className={cn(css.orderItem)}>
        <div className={cn(css.orderItem__value)}>
          {Number.isInteger(data.waitingPayment) ? data.waitingPayment : '-'}
        </div>
        <div className={cn(css.orderItem__desc)}>입금확인</div>
      </div>
      <div className={cn(css.orderItem__arrow)}>
        <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
      </div>
      {/* 결제완료 */}
      <div className={cn(css.orderItem)}>
        <div className={cn(css.orderItem__value)}>
          {Number.isInteger(data.paymentComplete) ? data.paymentComplete : '-'}
        </div>
        <div className={cn(css.orderItem__desc)}>결제완료</div>
      </div>
      <div className={cn(css.orderItem__arrow)}>
        <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
      </div>
      {/* 상품준비 */}
      <div className={cn(css.orderItem)}>
        <div className={cn(css.orderItem__value)}>
          {Number.isInteger(data.prepareProduct) ? data.prepareProduct : '-'}
        </div>
        <div className={cn(css.orderItem__desc)}>상품준비</div>
      </div>
      <div className={cn(css.orderItem__arrow)}>
        <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
      </div>
      {/* 배송중 */}
      <div className={cn(css.orderItem)}>
        <div className={cn(css.orderItem__value)}>
          {Number.isInteger(data.sending) ? data.sending : '-'}
        </div>
        <div className={cn(css.orderItem__desc)}>배송중</div>
      </div>
      <div className={cn(css.orderItem__arrow)}>
        <Image src={IMAGE_PATH.mypageArrow} width={'15px'} height={'15px'} />
      </div>
      {/* 배송완료 */}
      <div className={cn(css.orderItem)}>
        <div className={cn(css.orderItem__value)}>
          {Number.isInteger(data.deliveryComplete)
            ? data.deliveryComplete
            : '-'}
        </div>
        <div className={cn(css.orderItem__desc)}>배송완료</div>
      </div>
    </div>
  );
}

export default OrderDashboard;
