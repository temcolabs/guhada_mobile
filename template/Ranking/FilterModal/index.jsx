import css from './FilterModal.module.scss';
import PropTypes from 'prop-types';

const FilterModal = ({
  isModalOpen,
  filterMap,
  selectedFilter,
  selectedFilterIdx,
  setFilter,
  resetFilter,
  handleCloseModal,
}) => {
  return (
    <div className={css['filter-modal']}>
      <div
        className={css['filter-modal__reset']}
        onClick={() => {
          resetFilter();
          handleCloseModal();
        }}
      />
      <div className={css['filter-modal__list']}>
        {filterMap.map(({ key, value }) => (
          <div
            key={key}
            className={cn(
              css['list-item'],
              selectedFilter.dirty === value && css['list-item--dirty']
            )}
            onClick={() => {
              setFilter(selectedFilterIdx, key);
              handleCloseModal();
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  filterMap: PropTypes.instanceOf(Map).isRequired,
  selectedFilter: PropTypes.object.isRequired,
  selectedFilterIdx: PropTypes.number.isRequired,
  setFilter: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

export default FilterModal;
