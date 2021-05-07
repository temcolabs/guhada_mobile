import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import css from './DealOrdered.module.scss';
import cn from 'classnames';
import moment from 'moment';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import { pushRoute } from 'childs/lib/router';
import { ORDER_LIST_ITEM_SAMPLE } from 'childs/lib/constant/order/orderModel';
// import DeliveryDelayModal from '../molecules/Modal/DeliveryDelay';

/** 발송지연 상세 모달 */
const DeliveryDelayModal = dynamic(
  () => import('../molecules/Modal/DeliveryDelay'),
  { ssr: false }
);

/**
 * 마이페이지의 목록에서 사용되는 상품 정보 영역
 *
 * 이미지 + 제조사, 상품명, 옵션, 가격, ... 주문 상태
 *
 * ! 클레임(취소교환반품) 은 purchaseStatus가 아닌 claimStatus를 사용한다.
 *
 */
export default function DealOrdered({
  order = ORDER_LIST_ITEM_SAMPLE, // 주문 데이터
  isClaim = false, // 클레임 여부. 주문상태 텍스트를 사용하는 필드가 다르다
  hasOptionQuantity = true, // 옵션이 수량을 포함하는지
  isPurchaseStatusVisible = true, // 주문 상태 텍스트표시 여부
  isPriceVisible = true, // 가격이 표시되는지
  wrapperStyle = {},
}) {
  const isOptionVisible =
    !!order?.optionAttribute1 ||
    !!order?.optionAttribute2 ||
    !!order?.optionAttribute3 ||
    hasOptionQuantity;

  // 발송지연 상태 Flag
  const isDelayStatusVisible =
    (order?.shipDelayNotificationTimestamp &&
      order?.purchaseStatus === 'COMPLETE_PAYMENT') ||
    order?.purchaseStatus === 'PREPARE_PRODUCT';

  // 발송지연 데드라인 기한
  const delayDeadlineDate = order?.delayDeadlineTimestamp
    ? moment(order?.delayDeadlineTimestamp).format('MM/DD')
    : '';

  // 발송지연 on / off state
  const [isDeliveryDelayModalOpen, setDeliveryDelayModalOpen] = useState(false);

  return (
    <>
      {/* 발송지연 모달 */}
      {isDeliveryDelayModalOpen && (
        <DeliveryDelayModal
          isOpen={isDeliveryDelayModalOpen}
          onClose={() => setDeliveryDelayModalOpen(false)}
          order={order}
        />
      )}
      <div className={css.wrapper} style={wrapperStyle}>
        {!!order?.dealId && (
          <>
            {/* 상품 이미지 */}
            <div
              className={cn(css.productImageBox)}
              style={{
                backgroundImage: `url(${order?.imageUrl})`,
              }}
              onClick={() => pushRoute(`/productdetail?deals=${order?.dealId}`)}
            />

            {/* 상품 정보 */}
            <div className={css.productInfo}>
              <div className={css.productInfo__inner}>
                <div className={css.brandName}>[{order?.brandName}]</div>
                <div className={css.productName}>{order?.prodName}</div>

                {isOptionVisible && (
                  <div className={css.option}>
                    <span>
                      {order?.optionAttribute1 && (
                        <span className={css.optionItem}>
                          {order?.optionAttribute1}
                        </span>
                      )}
                      {order?.optionAttribute2 && (
                        <span className={css.optionItem}>
                          {order?.optionAttribute2}
                        </span>
                      )}
                      {order?.optionAttribute3 && (
                        <span className={css.optionItem}>
                          {order?.optionAttribute3}
                        </span>
                      )}
                      {hasOptionQuantity && (
                        <span className={css.optionItem}>
                          {order?.quantity}개
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {isPriceVisible && (
                  <div className={css.priceWrapper}>
                    <span className={css.finalPrice}>
                      <span>{addCommaToNum(order?.originalPrice) || '-'}</span>
                      <span>{'원'}</span>
                    </span>
                  </div>
                )}

                {isPurchaseStatusVisible && (
                  <div className={css.productInfo__lowerArea}>
                    {isPurchaseStatusVisible && (
                      <div className={css.statusWrapper}>
                        {/* 주문 상태 */}
                        <span className={css.status}>
                          {!isClaim
                            ? order?.orderStatusText ||
                              order?.purchaseStatusText
                            : order?.claimStatusText}
                        </span>
                        {/* 주문 상태 관련 메시지 */}
                        <span className={css.statusMessage}>
                          {order?.statusMessage}
                        </span>
                        {/* 발송 지연 관련 메시지 */}
                        {isDelayStatusVisible && (
                          <span
                            className={css.statusDelayMessage}
                            onClick={() => setDeliveryDelayModalOpen(true)}
                          >
                            {`발송지연 (${delayDeadlineDate}일까지 발송예정)`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
