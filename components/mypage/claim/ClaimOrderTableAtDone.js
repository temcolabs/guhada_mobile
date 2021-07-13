import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react';
import DealOrdered from '../DealOrdered';

/**
 * 클레임 완료 페이지(Order***Done) 에서 사용하는 상품 테이블.
 * 상위 컴포넌트에서 클레임 데이터를 가져오도록 설정한다.
 */
function ClaimOrderTableAtDone() {
  const { orderClaimForm } = useStores();

  return useObserver(() => (
    <div>
      <DealOrdered
        isClaim={true}
        order={orderClaimForm.claimData}
        hasOptionQuantity={true}
        isPriceVisible
        isPurchaseStatusVisible={false}
      />
    </div>
  ));
}

export default ClaimOrderTableAtDone;
