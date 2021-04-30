import css from './Gift.module.scss';
import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import _ from 'lodash';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import CategorySlider from 'components/common/CategorySlider';
import Footer from 'components/footer/Footer';
import GiftHeader from './GiftHeader';
import DealSection from './DealSection';

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
  const [scrollDirection, setScrollDirection] = useState('up');
  let lastScrollTop = 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * handlers
   */
  const handleScrollDirection = useCallback(
    _.debounce((e) => {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollTop = st <= 0 ? 0 : st;
    }, 10),
    []
  );

  /**
   * side effects
   */
  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);

  useEffect(() => {
    giftStore.fetchDeals();
  }, [giftStore]);

  return (
    <>
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
          <DealSection
            header={'추천 기프트'}
            deals={giftStore.recommendDeals}
            horizontal
          />
          <DealSection
            header={'베스트 기프트'}
            deals={giftStore.bestDeals}
          />
        </div>

        <Footer />
      </DefaultLayout>

      {isModalOpen && (
        <DynamicScrollableImageModal
          imgSrc={'/static/gift/gift_detail_mob.jpg'}
          isModalOpen={isModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default observer(Gift);