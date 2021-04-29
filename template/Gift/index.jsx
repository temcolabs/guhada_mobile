import css from './Gift.module.scss';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';
import DealItemSection from './DealItemSection';
import { LoadingSpinner } from 'components/common/loading/Loading';

import ModalWrapper from 'components/common/modal/ModalWrapper';

function Gift() {
  const { main: mainStore, gift: giftStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    giftStore.fetchDeals();
  }, [giftStore]);

  return (
    <DefaultLayout title={null} topLayout={'main'}>
      <CategorySlider
        categoryList={mainCategory.item}
        setNavDealId={mainStore.setNavDealId}
      />

      {isModalOpen && (
        <ModalWrapper
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          lockScroll={true}
          isBigModal={true}
          overlayStyle={{ position: 'relative' }}
          contentStyle={{ overflowY: 'auto', maxHeight: '100vh' }}
        >
          <div
            className={css.modalClose}
            style={{ position: 'fixed' }}
            onClick={() => setIsModalOpen(false)}
          />
          <img
            style={{ width: '100vw' }}
            src="/static/gift/gift_detail_mob.jpg"
          />
        </ModalWrapper>
      )}

      <div className={css['gift']}>
        <div className={css['gift__header']}>
          <div className={cn(css['header__banner'], css['banner--main'])} />
          <div
            className={cn(css['header__banner'], css['banner--sub'])}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <DealItemSection
          header={'추천 기프트'}
          deals={giftStore.recommendDeals}
          horizontal
        />
        <DealItemSection header={'베스트 기프트'} deals={giftStore.bestDeals} />
      </div>

      <Footer />
    </DefaultLayout>
  );
}

export default observer(Gift);
