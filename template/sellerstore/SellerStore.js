import React, { useState } from 'react';
import { withRouter } from 'next/router';
import { compose } from 'lodash/fp';
import { useObserver } from 'mobx-react-lite';

import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import SellerStoreHeader from 'components/sellerstore/SellerStoreHeader';
import SellerStoreTab from 'components/sellerstore/SellerStoreTab';
import SellerStoreProduct from 'components/sellerstore/SellerStoreProduct';
import SellerStoreInfomation from 'components/sellerstore/SellerStoreInfomation';
import DefaultLayout from 'components/layout/DefaultLayout';
import _ from 'lodash';
import StoreSearchFilter from 'components/sellerstore/StoreSearchFilter';
import SearchFilter from 'components/search/SearchFilter';

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter
);

/**
 * 셀러스토어
 */
const SellerStore = enhancer(
  ({ router, seller, sellerId, login, searchitem }) => {
    const [tab, setTab] = useState('store');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    return useObserver(() => (
      <>
        <DefaultLayout
          pageTitle={
            _.isNil(seller.sellerStore) === false
              ? seller.sellerStore.nickname
              : ''
          }
          headerShape={'sellerStore'}
        >
          <SellerStoreHeader
            sellerStore={seller.sellerStore}
            seller={seller}
            login={login}
            setTab={setTab}
          />
          <SellerStoreTab tab={tab} setTab={setTab} />

          {tab === 'store' ? (
            <SellerStoreProduct
              seller={seller}
              items={searchitem.deals}
              countOfDeals={searchitem.countOfDeals}
            />
          ) : (
            <SellerStoreInfomation sellerStore={seller.sellerStore} />
          )}
          {searchitem.itemStatus && (
            <SearchFilter
              isVisible={isFilterVisible}
              onClose={() => setIsFilterVisible(false)}
              filters={searchitem.filterData}
            />
          )}
          {/* {searchitem.itemStatus && (
            <StoreSearchFilter
              isVisible={isFilterVisible}
              onClose={() => setIsFilterVisible(false)}
              filters={seller.filterData}
            />
          )} */}
        </DefaultLayout>
      </>
    ));
  }
);

export default SellerStore;
