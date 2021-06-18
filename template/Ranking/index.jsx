import css from './Ranking.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import RankingHeader from './RankingHeader';
import RankingSection from './RankingSection';
import FilterModal from './FilterModal';
import { pushRoute } from 'childs/lib/router';

function Ranking() {
  /**
   * states
   */
  const { ranking: rankingStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({});

  /**
   * handlers
   */
  const handleFilterModalOpen = (filterData) => {
    setSelectedFilter(filterData);
    setIsModalOpen(true);
  };

  const handleSearch = ({ id, word }) =>
    pushRoute(`/search?brand=${id}&keyword=${word}`);

  /**
   * render
   */
  return (
    <div className={css.ranking}>
      <RankingHeader handleFilterModalOpen={handleFilterModalOpen} />
      <RankingSection
        rank={rankingStore.ranking.rank}
        handleSearch={handleSearch}
      />

      <FilterModal
        isModalOpen={isModalOpen}
        selectedFilter={selectedFilter}
        handleCloseModal={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default observer(Ranking);
