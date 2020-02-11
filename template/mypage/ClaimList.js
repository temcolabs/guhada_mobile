import React, { useState, useCallback } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';
import css from './ClaimList.module.scss';
import ClaimListProduct from 'components/mypage/claim/ClaimListProduct';
import ClaimListSeller from 'components/mypage/claim/ClaimListSeller';

/**
 * 클레임 탭 종류
 */
export default function MyReviewList() {
  const claimTabs = {
    PRODUCT: 'PRODUCT', // 상품
    SELLER: 'SELLER', // 셀러
  };
  const [tab, setTab] = useState(claimTabs.PRODUCT);

  const handleClickTab = useCallback(tab => {
    setTab(tab);
  }, []);

  return (
    <MypageLayout topLayout={'main'} headerShape={'mypage'}>
      <div className={css.wrap} id="claimListWrap">
        <div className={css.tabWrap}>
          <div
            className={`${css.tabItem} ${
              tab === claimTabs.PRODUCT ? css.select : ''
            }`}
            onClick={() => handleClickTab(claimTabs.PRODUCT)}
          >
            상품 문의
          </div>
          <div
            className={`${css.tabItem} ${
              tab === claimTabs.SELLER ? css.select : ''
            }`}
            onClick={() => handleClickTab(claimTabs.SELLER)}
          >
            주문 문의
          </div>
        </div>

        {tab === claimTabs.PRODUCT ? (
          <ClaimListProduct />
        ) : tab === claimTabs.SELLER ? (
          <ClaimListSeller />
        ) : null}
      </div>
    </MypageLayout>
  );
}
