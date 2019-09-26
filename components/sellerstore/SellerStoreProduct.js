import React from 'react';
import css from './SellerStoreProduct.module.scss';
import SectionItem from 'components/home/SectionItem';
import _ from 'lodash';
import { LinkRoute } from 'lib/router';
export default function SellerStoreProduct({
  seller,
  items,
  countOfDeals,
  sellerId,
}) {
  const orderList = [
    { label: '신상품순', value: 'DATE' },
    { label: '평점순', value: 'SCORE' },
    { label: '높은가격순', value: 'PRICE_ASC' },
    { label: '낮은가격순', value: 'PRICE_DESC' },
  ];

  const orderLabel = orderList.map(order => {
    if (order.value === seller.order) {
      return order.label;
    }
  });

  function getOrderDeal(order) {
    seller.order = order;
    seller.getSellerStoreDeal(sellerId);
  }

  return (
    <>
      <div className={css.headerWrap}>
        <div className={css.count}>{`총 ${countOfDeals}개`}</div>
        <div className={css.orderWrap}>
          {orderLabel}
          <div className={css.hoverWrap}>
            <div className={css.hoverPadding}>
              <div
                className={css.hoverItem}
                onClick={() => {
                  getOrderDeal('DATE');
                }}
              >
                신상품순
              </div>
              <div
                className={css.hoverItem}
                onClick={() => {
                  getOrderDeal('SCORE');
                }}
              >
                평점순
              </div>
              <div
                className={css.hoverItem}
                onClick={() => {
                  getOrderDeal('PRICE_DESC');
                }}
              >
                높은가격순
              </div>
              <div
                className={css.hoverItem}
                onClick={() => {
                  getOrderDeal('PRICE_ASC');
                }}
              >
                낮은가격순
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={css.productWrap}>
        {_.isNil(items) === false &&
          items.map((item, i) => {
            return (
              <LinkRoute
                href={`/productdetail?deals=${item.dealId}`}
                key={item.dealId}
              >
                <a>
                  <SectionItem item={item} sellerStore={true} />
                </a>
              </LinkRoute>
            );
          })}
      </div>
      <div
        className={css.moreItemButton}
        onClick={() => {
          seller.page += 1;
          seller.getSellerStoreDeal(sellerId);
        }}
      >
        더 보기
        <div className={css.moreIcon} />
      </div>
    </>
  );
}
