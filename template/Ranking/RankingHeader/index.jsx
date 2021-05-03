import css from './RankingHeader.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';

import useStores from 'stores/useStores';

import BwSelectionButton from './BwSelectionButton';
import FilterButton from './FilterButton';

const RankingHeader = ({ handleFilterModalOpen }) => {
  const { ranking: rankingStore } = useStores();

  return (
    <div className={css['ranking__header']}>
      <div className={css['header__main']}>
        <div className={css['header__main__title']}>
          <div className={css['title--name']}>랭킹</div>
          <div className={css['title--time']}>
            {moment(rankingStore.ranking.updatedAt).format('MM. DD HH:mm')} 기준
          </div>
        </div>
        <div className={css['header__main__selection']}>
          <BwSelectionButton
            leftSelected={rankingStore.selectedRanking === 'brand'}
            leftOnClick={() => rankingStore.setSelectedRanking('brand')}
            leftChildren={'브랜드'}
            rightSelected={rankingStore.selectedRanking === 'word'}
            rightOnClick={() => rankingStore.setSelectedRanking('word')}
            rightChildren={'검색어'}
          />
        </div>
      </div>
      <div className={css['header__filter']}>
        {rankingStore.rankingFilters.map(
          ({ filter, name, value, dirty }, idx) => (
            <FilterButton
              key={filter}
              dirty={dirty}
              onClick={() => handleFilterModalOpen({ filter, idx })}
            >
              {dirty ? rankingStore.filterMap[filter].get(value) : name}
            </FilterButton>
          )
        )}
      </div>
    </div>
  );
};

RankingHeader.propTypes = {
  handleFilterModalOpen: PropTypes.func.isRequired,
};
export default observer(RankingHeader);
