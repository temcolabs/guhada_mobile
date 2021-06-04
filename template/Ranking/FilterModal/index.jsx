import css from './FilterModal.module.scss';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import useStores from 'stores/useStores';

import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

const arrayFromMap = (map) =>
  map instanceof Map && Array.from(map, ([key, value]) => ({ key, value }));

const FilterModal = ({ isModalOpen, selectedFilter, handleCloseModal }) => {
  const { ranking: rankingStore } = useStores();
  const filterMap = rankingStore.filterMaps[selectedFilter.filter];

  return (
    <SlideIn direction={slideDirection.BOTTOM} isVisible={isModalOpen}>
      <div className={css['filter-modal']}>
        <div className={css['modal__offset']} onClick={handleCloseModal} />
        <div className={css['modal__header']}>
          <div className={css['modal__header__name']}>
            {selectedFilter.name}
          </div>
          <div
            className={css['modal__header__reset']}
            onClick={() => {
              rankingStore.resetRankingFilter(selectedFilter.idx);
              handleCloseModal();
            }}
          >
            초기화
          </div>
        </div>
        <div className={css['modal__list']}>
          {filterMap &&
            arrayFromMap(filterMap).map(({ key: enValue, value: koValue }) => (
              <div
                key={enValue}
                className={cn(
                  css['list-item'],
                  selectedFilter.value === enValue && css['list-item--selected']
                )}
                onClick={() => {
                  rankingStore.setRankingFilter(selectedFilter.idx, enValue);
                  handleCloseModal();
                }}
              >
                {koValue}
              </div>
            ))}
        </div>
      </div>
    </SlideIn>
  );
};

FilterModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  selectedFilter: PropTypes.shape({
    filter: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    idx: PropTypes.number,
  }).isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

export default observer(FilterModal);
