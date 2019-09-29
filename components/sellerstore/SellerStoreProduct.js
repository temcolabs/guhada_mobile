import React, { useState } from 'react';
import css from './SellerStoreProduct.module.scss';
import SectionItem from 'components/home/SectionItem';
import _ from 'lodash';
import { LinkRoute } from 'lib/router';
import { useObserver } from 'mobx-react-lite';

export default function SellerStoreProduct({
  seller,
  items,
  countOfDeals,
  sellerId,
}) {
  const [orderHover, setOrderHover] = useState(false);

  const orderList = [
    { label: '신상품순', value: 'DATE' },
    { label: '평점순', value: 'SCORE' },
    { label: '낮은가격순', value: 'PRICE_ASC' },
    { label: '높은가격순', value: 'PRICE_DESC' },
  ];

  const orderLabel = orderList.map(order => {
    if (order.value === seller.order) {
      return order.label;
    }
  });

  function getOrderDeal(order, e) {
    e.stopPropagation();
    setOrderHover(false);
    seller.order = order;
    seller.getInitSellerStoreItem();
    seller.getSellerStoreDeal(sellerId);
  }

  return useObserver(() => (
    <>
      <div className={css.headerWrap}>
        <div className={css.count}>{`총 ${countOfDeals}개`}</div>
        <div
          className={css.orderWrap}
          onClick={() => setOrderHover(true)}
          style={{
            backgroundImage:
              orderHover === true
                ? `url('/static/icon/drop_arrow.png')`
                : `url('/static/icon/down_arrow.png')`,
          }}
        >
          {orderLabel}
          <div
            className={css.hoverWrap}
            style={{ display: orderHover === true ? 'block' : 'none' }}
          >
            <div className={css.hoverPadding}>
              <div
                className={css.hoverItem}
                onClick={e => {
                  getOrderDeal('DATE', e);
                }}
              >
                신상품순
              </div>
              <div
                className={css.hoverItem}
                onClick={e => {
                  getOrderDeal('SCORE', e);
                }}
              >
                평점순
              </div>
              <div
                className={css.hoverItem}
                onClick={e => {
                  getOrderDeal('PRICE_DESC', e);
                }}
              >
                높은가격순
              </div>
              <div
                className={css.hoverItem}
                onClick={e => {
                  getOrderDeal('PRICE_ASC', e);
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
              <LinkRoute href={`/productdetail?deals=${item.dealId}`} key={i}>
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
  ));
}
