import css from './Gift.module.scss';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';
import { useScrollDirection } from 'hooks';

import DefaultLayout from 'components/layout/DefaultLayout';
import CategorySlider from 'components/common/CategorySlider';
import Footer from 'components/footer/Footer';
import GiftHeader from './GiftHeader';
import DealItems from 'components/organisms/DealItems';

const DynamicScrollableImageModal = dynamic(
  () => import('./ScrollableImageModal'),
  {
    ssr: false,
  }
);

function Gift() {
  /**
   * states
   */
  const { main: mainStore, gift: giftStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  /**
   * side effects
   */
  useEffect(() => {
    giftStore.fetchDeals();
  }, [giftStore]);

  return (
    <DefaultLayout
      title={null}
      topLayout={'main'}
      scrollDirection={scrollDirection}
    >
      <CategorySlider
        categoryList={mainCategory.item}
        setNavDealId={mainStore.setNavDealId}
        scrollDirection={scrollDirection}
      />

      <div className={css.gift}>
        <GiftHeader handleOpenModal={() => setIsModalOpen(true)} />
        <DealItems
          title={'추천 기프트'}
          deals={giftStore.recommendDeals}
          horizontal
        />
        <DealItems title={'베스트 기프트'} deals={giftStore.bestDeals} />
      </div>

      {isModalOpen && (
        <DynamicScrollableImageModal
          imgSrc={'/static/gift/gift_detail_mob.jpg'}
          isModalOpen={isModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
        />
      )}
      <Footer />
    </DefaultLayout>
  );
}

export default observer(Gift);
