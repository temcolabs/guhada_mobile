import { Component } from 'react';
import css from './OrderItem.module.scss';
import moment from 'moment';
import { object, func, bool } from 'prop-types';
import { dateFormat } from 'lib/constant/date';
import OrderActionButtonConductor from './OrderActionButtonConductor';
import DealOrdered from '../DealOrdered';
import SellerClaimModal, {
  withSellerClaimModal,
} from 'components/claim/sellerclaim/SellerClaimModal';

/**
 * 주문 목록의 아이템
 */
@withSellerClaimModal
class OrderItem extends Component {
  static propTypes = {
    order: object,
    onClickInquire: func, // 문의하기 버튼 클릭
    isClaim: bool, // 취소교환반품 목록의 항목인지 여부
    redirectToDetail: func,
  };

  render() {
    const {
      order = {
        brandName: '', // 브랜드명 ,
        discountPrice: 0, // 할인된 가격 ,
        delayDeadlineTimestamp: 0, // 발송지연 데드라인 ,
        delayReason: '', // 발송지연 정보 ,
        delayReasonDetail: '', // 발송지연 상세정보 ,
        expireDate: '', // 무통장 입금시 입금기한(무통장이 아니면경우 null) ,
        imageName: '', // 대표 이미지 파일명 ,
        imageUrl: '', // 대표 이미지 URL ,
        optionAttribute1: '', // 첫번째 옵션 ,
        optionAttribute2: '', // 두번째 옵션 ,
        optionAttribute3: '', // 세번째 옵션 ,
        orderDate: [], // 주문일 ,
        orderPrice: 0, // 주문한 금액 ,
        originalPrice: 0, // 원래 가격 ,
        prodName: '', // 상품명 ,
        purchaseId: 0, // 구매 데이터의 아이디 ,
        purchaseStatus: '', // 주문의 상태값
        purchaseStatusText: '', // 주문의 상태값 ,
        quantity: 0, // 구매수량 ,
        season: '', // 시즌 ,
        sellerId: 0, // 판매자의 아이디 ,
        sellerName: '', // 판매자의 이름 ,
        shipDelayNotificationTimestamp: null, // 배송지연 알림 설정 시간 ,
        shipPrice: 0, // 배송비 ,
        statusMessage: '', // 상태의 따른 메세지
      },
      isClaim,
      redirectToDetail,
    } = this.props;

    return (
      <div className={css.wrap}>
        {order.hasOwnProperty('hasSamePurchseId') &&
        order.hasSamePurchseId === true ? null : (
          <div className={css.orderInfoWrapper}>
            {/* 주문정보 + 판매자 정보 */}
            <div className={css.orderInfo} onClick={redirectToDetail}>
              <div className={css.orderInfo__date}>
                {moment(order.orderTimestamp).format(dateFormat.YYYYMMDD_UI)}
              </div>

              {/* 주문 상세로 이동 */}
              <div className={css.orderInfo__id}>
                <span>주문번호</span>
                <span>&nbsp;</span>
                <span className={css.orderInfo__idValue}>
                  {order.purchaseId}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className={css.productInfoWrapper}>
          <div className={css.dealOrderdWrapper}>
            <DealOrdered
              isClaim={isClaim}
              order={order}
              hasOptionQuantity={true}
              isPriceVisible
              isPurchaseStatusVisible
            />
          </div>
        </div>
        <div className={css.actionBox}>
          <OrderActionButtonConductor
            wrapperStyle={{}}
            order={order}
            isClaim={isClaim}
          />
        </div>
        <div className={css.sellerInfo}>
          <button
            onClick={() =>
              this.props.handleOpenSellerClaimModal({
                sellerId: order.sellerId,
              })
            }
          >
            {order.sellerName || '셀러'}에 문의하기
          </button>
        </div>
        {/* 판매자 문의하기 모달 */}
        <SellerClaimModal
          isOpen={this.props.isSellerClaimModalOpen}
          sellerId={this.props.sellerIdToClaim}
          onClose={this.props.handleCloseSellerClaimModal}
        />
      </div>
    );
  }
}

export default OrderItem;
