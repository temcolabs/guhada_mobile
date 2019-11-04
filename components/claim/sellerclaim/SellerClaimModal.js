import React, { useState, useEffect } from 'react';
import css from './SellerClaimModal.module.scss';
import useStores from 'stores/useStores';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import DealOptions from './DealOptions';
import ClaimType from './ClaimType';
import { inject } from 'mobx-react';

function SellerClaimModal({ isVisible, sellerId, sellerClaim, onClose }) {
  const [myDeal, setMydeal] = useState();

  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <div className={css.header}>
            <div className={css.backIcon} onClick={onClose} />
            <div className={css.headerText}>판매자 문의하기</div>
          </div>
          <div className={css.contentsWrap}>
            <div className={css.dealOptions}>
              <DealOptions />
            </div>
            <div className={css.claimType}>
              <ClaimType />
            </div>
            <div className={css.textArea}>
              <textarea
                placeholder="문의하실 내용을 입력하세요"
                onChange={() => {}}
              />
            </div>
            <div className={css.textNumberChecker}>
              <span>0</span>
              /1000
            </div>

            <div className={css.attachmentFile}>
              <i />
              첨부파일
            </div>

            <div className={css.notify}>
              구매한 상품이 없을 경우, 상품 문의를 통하여 문의가 가능합니다.
              문의 내용에 대한 답변은 <span>마이페이지 > 문의</span> 에서
              확인하실 수 있습니다.
            </div>
          </div>

          <div className={css.buttonGroup}>
            <div className={css.cancelBtn}>취소</div>
            <div className={css.inquiryBtn}>문의하기</div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('sellerClaim')(SellerClaimModal);
