import css from './SpecialDetail.module.scss';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import useStores from 'stores/useStores';
import DefaultLayout from 'components/layout/DefaultLayout';
import SpecialDetailHeader from './SpecialDetailHeader';
import DealSection from 'components/templates/DealSection';
import Loading from 'components/common/loading/Loading';
import { useScrollDirection } from 'hooks';

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
   * side effects
   */
  const scrollDirection = useScrollDirection();

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
    <DefaultLayout
      headerShape={'special'}
      pageTitle={'기획전'}
      scrollDirection={scrollDirection}
    >
      {newSpecialStore.isLoading ? (
        <Loading />
      ) : (
        <div className={css['special-detail']}>
          <SpecialDetailHeader
            specialDetail={newSpecialStore.specialDetail}
            handleCopyUrlToClipboard={handleCopyUrlToClipboard}
          />
          <DealSection
            title={'기획전 ITEM'}
            deals={searchByFilterStore.deals}
            isLoading={searchByFilterStore.countOfDeals === Infinity}
            moreToLoad={searchByFilterStore.moreToLoad}
            handleLoadMore={() => searchByFilterStore.search(true)}
            thumbnail={searchByFilterStore.thumbnail}
            isFilterable
          />
        </div>
      )}
    </DefaultLayout>
  );
}

export default observer(SpecialDetail);
