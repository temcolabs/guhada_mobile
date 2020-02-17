import React, { useState } from 'react';
import css from './SellerStoreProduct.module.scss';
import SectionItem from 'components/home/SectionItem';
import _ from 'lodash';
import { LinkRoute } from 'childs/lib/router';
import { useObserver } from 'mobx-react-lite';
import SellerStoreOrder from './SellerStroeOrder';
import SearchFilterResult from 'components/search/SearchFilterResult';

export default function SellerStoreProduct({
  seller,
  searchitem,
  items,
  countOfDeals,
  setIsFilterVisible,
}) {
  const [orderHover, setOrderHover] = useState(false);
  const [sellerStoreFilter, setSellerStoreFilter] = useState('DATE');
  const orderList = [
    { label: '신상품순', value: 'DATE' },
    { label: '평점순', value: 'SCORE' },
    { label: '낮은가격순', value: 'PRICE_ASC' },
    { label: '높은가격순', value: 'PRICE_DESC' },
  ];

  const orderLabel = orderList.map(order => {
    return order.value === seller.order ? order.label : '';
  });

  function getOrderDeal(order, e) {
    e.stopPropagation();
    setOrderHover(false);
    seller.order = order;
    setSellerStoreFilter(order);
    searchitem.toSearch({ order: order, sellerIds: seller.sellerId });
    seller.getFromSearchItemDeals();
  }
  const handleMoreItemBtn =
    seller.countOfDeals / (seller.unitPerPage * seller.page) <= 1
      ? false
      : true;

  return useObserver(() => (
    <>
      <div className={css.headerWrap}>
        <div
          className={css.detail}
          onClick={e => {
            e.stopPropagation();
            setIsFilterVisible(true);
          }}
        >
          상세검색
        </div>
        <div className={css.orderWrap} onClick={() => setOrderHover(true)}>
          {orderLabel}
          <SellerStoreOrder
            isVisible={orderHover}
            onClose={() => setOrderHover(false)}
            getOrderDeal={getOrderDeal}
            sellerStoreFilter={sellerStoreFilter}
          />
        </div>
      </div>
      <SearchFilterResult />
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

      {handleMoreItemBtn === true && (
        <div
          className={css.moreItemButton}
          onClick={() => {
            searchitem.addPage();
            // seller.page += 1;
            // seller.getSellerStoreDeal(seller.sellerId);
          }}
        >
          더 보기
          <div className={css.moreIcon} />
        </div>
      )}
    </>
  ));
}
