import React from 'react';
import css from './DealOrdered.module.scss';
import cn from 'classnames';
import addCommaToNum from 'lib/common/addCommaToNum';
import { pushRoute } from 'lib/router';
import { ORDER_LIST_ITEM_SAMPLE } from 'lib/constant/order/orderModel';

/**
 * 마이페이지의 상품 상세에서 사용하는 상품 정보
 */
export default function DealOrderedForDetail({
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

  return (
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
              <div className={css.dealId}>상품번호 {order.dealId}</div>

              <div className={css.productName}>
                [{order?.brandName}] {order?.prodName}
              </div>

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
                          ? order?.orderStatusText || order?.purchaseStatusText
                          : order?.claimStatusText}
                      </span>
                      {/* 주문 상태 관련 메시지 */}
                      <span className={css.statusMessage}>
                        {order?.statusMessage}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
