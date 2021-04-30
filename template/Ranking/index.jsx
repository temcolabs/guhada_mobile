import css from './Ranking.module.scss';
import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';
import RankingHeader from './RankingHeader';
import RankingSection from './RankingSection';
import FilterModal from './FilterModal';

function Ranking() {
  /**
   * states
   */
  const { main: mainStore, ranking: rankingStore } = useStores();
  const [scrollDirection, setScrollDirection] = useState('up');
  let lastScrollTop = 0;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({});

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

  const handleFilterModalOpen = (filterData) => {
    setSelectedFilter(filterData);
    setIsModalOpen(true);
  };

  /**
   * side effects
   */
  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);

  useEffect(() => {
    rankingStore.fetchRanking();
  }, [rankingStore]);

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

        <div className={css.ranking}>
          <RankingHeader handleFilterModalOpen={handleFilterModalOpen} />
          <RankingSection ranks={rankingStore.ranking.rank} />
        </div>

        <Footer />
      </DefaultLayout>

      {isModalOpen && (
        <FilterModal
          isModalOpen={isModalOpen}
          filterMap={rankingStore.filterMap[selectedFilter.filter]}
          selectedFilter={rankingStore.rankingFilters[selectedFilter.idx]}
          selectedFilterIdx={selectedFilter.idx}
          setFilter={rankingStore.setRankingFilter}
          resetFilter={rankingStore.resetRankingFilter}
          handleCloseModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default observer(Ranking);
