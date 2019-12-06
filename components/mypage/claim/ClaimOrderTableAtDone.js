import React from 'react';
import Table from 'components/mypage/Table';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import claimFormCSS from 'components/mypage/order/OrderClaimForm.module.scss';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react-lite';
import DealOrdered from '../DealOrdered';

/**
 * 클레임 완료 페이지(Order***Done) 에서 사용하는 상품 테이블.
 * 상위 컴포넌트에서 클레임 데이터를 가져오도록 설정한다.
 */
function ClaimOrderTableAtDone() {
  const { orderClaimForm } = useStores();
  const { claimData } = orderClaimForm;

  return useObserver(() => (
    <div>
      <DealOrdered
        order={orderClaimForm.claimData}
        isPriceVisible={false}
        hasOptionQuantity={false}
        isSmallImage={true}
        isPurchaseStatusVisible={false}
        isBrandAndProductInSameLine={true}
      />
    </div>
  ));
}

export default ClaimOrderTableAtDone;
