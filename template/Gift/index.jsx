import css from './Gift.module.scss';
import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import _ from 'lodash';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';
import DealItemSection from './DealItemSection';

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
  const [scrollDirection, setScrollDirection] = useState('up');
  let lastScrollTop = 0;

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
    giftStore.fetchDeals();
  }, [giftStore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);

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

      {isModalOpen && (
        <DynamicScrollableImageModal
          imgSrc={'/static/gift/gift_detail_mob.jpg'}
          isModalOpen={isModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
        />
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
