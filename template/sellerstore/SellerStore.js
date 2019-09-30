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

const enhancer = compose(
  withScrollToTopOnMount,
  withRouter
);

/**
 * 셀러스토어
 */
const SellerStore = enhancer(({ router, seller, sellerId, login }) => {
  const [tab, setTab] = useState('store');

  return useObserver(() => (
    <>
      <DefaultLayout
        pageTitle={
          _.isNil(seller.sellerStore) === false
            ? seller.sellerStore.nickname
            : ''
        }
      >
        <SellerStoreHeader
          sellerStore={seller.sellerStore}
          seller={seller}
          login={login}
          sellerId={router.query.sellerId}
        />
        <SellerStoreTab tab={tab} setTab={setTab} />

        {tab === 'store' ? (
          <SellerStoreProduct
            seller={seller}
            items={seller.dealsOfSellerStore}
            countOfDeals={seller.countOfDeals}
            sellerId={router.query.sellerId}
          />
        ) : (
          <SellerStoreInfomation sellerStore={seller.sellerStore} />
        )}
      </DefaultLayout>
    </>
  ));
});

export default SellerStore;
