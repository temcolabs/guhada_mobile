import css from './Ranking.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import RankingHeader from './RankingHeader';
import RankingSection from './RankingSection';
import FilterModal from './FilterModal';

function Ranking() {
  /**
   * states
   */
  const { ranking: rankingStore, searchitem: searchItemStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({});

  /**
   * handlers
   */
  const handleFilterModalOpen = (filterData) => {
    setSelectedFilter(filterData);
    setIsModalOpen(true);
  };

  const handleSearch = ({ id, word }) => {
    id
      ? searchItemStore.toSearch({ brand: id, enter: 'brand' })
      : searchItemStore.toSearch({ keyword: word, enter: 'keyword' });
  };

  return (
    <>
      <div className={css.ranking}>
        <RankingHeader handleFilterModalOpen={handleFilterModalOpen} />
        <RankingSection
          rank={rankingStore.ranking.rank}
          handleSearch={handleSearch}
        />
      </div>

      <FilterModal
        isModalOpen={isModalOpen}
        selectedFilter={selectedFilter}
        handleCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default observer(Ranking);
