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
          resetFilter(selectedFilterIdx);
          handleCloseModal();
        }}
      />
      <div className={css['filter-modal__list']}>
        {filterMap.map(({ key: enValue, value: koValue }) => (
          <div
            key={key}
            className={cn(
              css['list-item'],
              selectedFilter.value === enValue && css['list-item--selected']
            )}
            onClick={() => {
              setFilter(selectedFilterIdx, enValue);
              handleCloseModal();
            }}
          >
            {koValue}
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
