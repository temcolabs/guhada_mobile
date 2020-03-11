import React, { useState, useEffect } from 'react';
import useStores from 'stores/useStores';
import { inject } from 'mobx-react';
import css from './SpecialDetail.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import Link from 'next/link';
import SectionItem from 'components/home/SectionItem';
import { LinkRoute } from 'childs/lib/router';
import Router from 'next/router';
import copy from 'copy-to-clipboard';
import Order from 'components/event/special/Order';
import { useObserver } from 'mobx-react-lite';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import moment from 'moment';
import SearchFilter from 'components/search/SearchFilter';
import SearchFilterResult from 'components/search/SearchFilterResult';
import MoreButton from 'components/common/MoreButton';
const enhancer = compose(withRouter);

const SpecialDetail = enhancer(props => {
  const { special, alert, searchitem } = useStores();

  const [orderHover, setOrderHover] = useState(false);
  const orderList = [
    { label: '신상품순', value: 'DATE' },
    { label: '평점순', value: 'SCORE' },
    { label: '낮은가격순', value: 'PRICE_ASC' },
    { label: '높은가격순', value: 'PRICE_DESC' },
  ];
  const orderLabel = orderList.map(order => {
    return order.value === special.order ? order.label : '';
  });
  const copyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${
      Router.router.asPath
    }`;

    copy(productUrl);

    alert.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sellerStoreFilter, setSellerStoreFilter] = useState('DATE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    special.specialDetail.startDate
      ? setStartDate(
          moment(special.specialDetail.startDate).format('YYYY. MM. DD')
        )
      : setStartDate(null);

    special.specialDetail.endDate
      ? setEndDate(moment(special.specialDetail.endDate).format('YYYY. MM. DD'))
      : setEndDate(null);
  }, [special.specialDetail]);

  const getOrderDeal = (order, e) => {
    const { query } = Router.router;
    e.stopPropagation();
    setOrderHover(false);
    setSellerStoreFilter(order);
    special.order = order;
    searchitem.toSearch({
      category: query.category,
      brand: query.brand,
      page: query.page,
      order: order,
      filter: query.filter,
      subcategory: query.subcategory,
      enter: query.enter,
      keyword: query.keyword,
      resultKeyword: query.resultKeyword,
      condition: query.condition,
      productCondition: query.productCondition,
      shippingCondition: query.shippingCondition,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sellerIds: '',
      eventIds: true,
    });
  };
  // const categoryList = [
  //   { label: '가방', tab: true },
  //   { label: '지갑', tab: false },
  //   { label: '니트', tab: false },
  // ];

  // const categoryTabHandler = index => {
  //   for (let i = 0; i < categoryList.length; i++) {
  //     categoryList[i].tab = false;
  //     if (categoryList[i] === index) {
  //       categoryList[i].tab = true;
  //     }
  //   }
  // };
  const handleMoreItemBtn =
    props.countOfDeals / (special.unitPerPage * searchitem.dealsPage) <= 1
      ? false
      : true;
  return useObserver(() => (
    <DefaultLayout headerShape={'eventmain'} pageTitle={'기획전'}>
      <div className={css.wrap}>
        <div className={css.headerWrap}>
          <div className={css.titleWrap}>
            <div className={css.title}>{special.specialDetail.detailTitle}</div>
            <div
              className={css.share}
              onClick={() => {
                copyUrlToClipboard();
              }}
            />
          </div>
          <div className={css.date}>{`${startDate ? startDate : ''} ~ ${
            endDate ? endDate : ''
          }`}</div>
        </div>

        <div className={css.eventMainWrap}>
          <img src={`${special.specialDetail.mobileImageUrl}`} alt="" />
        </div>
        {/* <div className={css.category}>
          {categoryList.map((special.specialDetail, index) => {
            return (
              <div
                className={[css.categoryItem, special.specialDetail.tab ? css.tabOn : null].join(
                  ' '
                )}
                onClick={() => {
                  categoryTabHandler(index);
                }}
                key={index}
              >
                {special.specialDetail.label}
              </div>
            );
          })}
        </div> */}
        <div className={css.specialItemList}>
          <div className={css.itemTitle}>기획전 ITEM</div>

          <div className={css.dashBoard}>
            <div className={css.orderWrap} onClick={() => setOrderHover(true)}>
              {orderLabel}
              <Order
                isVisible={orderHover}
                onClose={() => setOrderHover(false)}
                getOrderDeal={getOrderDeal}
                sellerStoreFilter={special.order}
              />
            </div>
            <div
              className={css.filterWrap}
              onClick={e => {
                setIsFilterVisible(true);
              }}
            >
              상세검색
            </div>
          </div>
          <SearchFilterResult />
          <div className={css.itemWrap}>
            {props.items?.map((data, index) => {
              return (
                <LinkRoute
                  href={`/productdetail?deals=${data.dealId}`}
                  key={index}
                >
                  <a>
                    <SectionItem item={data} />
                  </a>
                </LinkRoute>
              );
            })}
          </div>
          {handleMoreItemBtn ? (
            <MoreButton
              getMoreContent={() => {
                searchitem.addPage();
              }}
              wrapStyle={{
                border: 'none',
                borderTop: '1px solid #eee',
              }}
            />
          ) : null}
        </div>

        {searchitem.itemStatus && (
          <SearchFilter
            isVisible={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            filters={searchitem.filterData}
            eventId={special.eventId}
          />
        )}
      </div>
    </DefaultLayout>
  ));
});

export default SpecialDetail;
