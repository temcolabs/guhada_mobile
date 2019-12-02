import React from 'react';
import css from './DealOrdered.module.scss';
import cn from 'classnames';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import { pushRoute } from 'childs/lib/router';
import { ORDER_LIST_ITEM_SAMPLE } from 'childs/lib/constant/order/orderModel';

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
  isSmallImage = false, // 작은 사이즈의 상품 이미지
  isBrandAndProductInSameLine = false, // 브랜드, 상품명이 한 줄에 있는지
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
      {/* 상품 이미지 */}
      <div
        className={cn(css.productImageBox, { [css.isSmall]: isSmallImage })}
        style={{
          backgroundImage: `url(${order?.imageUrl})`,
        }}
        onClick={() => pushRoute(`/productdetail?deals=${order?.dealId}`)}
      />

      {/* 상품 정보 */}
      <div className={css.productInfo}>
        <div className={css.productInfo__inner}>
          <div className={css.productInfo__upperArea}>
            <div className={css.productName}>
              <b>[{order?.brandName}]</b>
              {isBrandAndProductInSameLine ? <span>&nbsp;</span> : <br />}
              <span>{order?.prodName}</span>
            </div>

            {isOptionVisible && (
              <div className={css.option}>
                <span className={cn(css.hasDivider)}>구매 옵션</span>
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
                    <span className={css.optionItem}>{order?.quantity}개</span>
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
      </div>
    </div>
  );
}
