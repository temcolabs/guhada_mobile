import css from './SpecialDetail.module.scss';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import useStores from 'stores/useStores';
import SpecialDetailHeader from './SpecialDetailHeader';
import DealSection from 'components/templates/DealSection';

function SpecialDetail() {
  /**
   * states
   */
  const {
    newSpecial: newSpecialStore,
    searchByFilter: searchByFilterStore,
    alert: alertStore,
  } = useStores();
  const router = useRouter();

  /**
   * handlers
   */
  const handleCopyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${
      router.asPath
    }`;
    copy(productUrl);
    alertStore.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };

  /**
   * render
   */
  return (
    <div className={css['special-detail']}>
      <SpecialDetailHeader
        specialDetail={newSpecialStore.specialDetail}
        handleCopyUrlToClipboard={handleCopyUrlToClipboard}
      />
      <DealSection
        deals={searchByFilterStore.deals}
        isLoading={searchByFilterStore.isInitial}
        moreToLoad={searchByFilterStore.moreToLoad}
        handleLoadMore={() => searchByFilterStore.search(true)}
        thumbnail={searchByFilterStore.thumbnail}
        filter
        filterTags
        specialFilterTags
        filterOptionSticky
      />
    </div>
  );
}

export default observer(SpecialDetail);
