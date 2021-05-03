import css from './Ranking.module.scss';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';
import { useScrollDirection } from 'hooks';

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
  const {
    main: mainStore,
    ranking: rankingStore,
    searchitem: searchItemStore,
  } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({});
  const scrollDirection = useScrollDirection();

  /**
   * handlers
   */

  const handleFilterModalOpen = (filterData) => {
    setSelectedFilter(filterData);
    setIsModalOpen(true);
  };

  /**
   * side effects
   */
  useEffect(() => {
    rankingStore.fetchRanking();
  }, [rankingStore]);

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

      <div className={css.ranking}>
        <RankingHeader handleFilterModalOpen={handleFilterModalOpen} />
        <RankingSection
          ranks={rankingStore.ranking.rank}
          toSearch={searchItemStore.toSearch}
        />
      </div>

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

      <Footer />
    </DefaultLayout>
  );
}

export default observer(Ranking);
