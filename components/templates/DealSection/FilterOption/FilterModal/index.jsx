import css from './FilterModal.module.scss';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

/**
 * a type of FilterModal which takes a `Map<key, value>` object as its item list
 */
const FilterModal = ({
  filterName,
  filterMap,
  selectedKey,
  isModalOpen,
  handleCloseModal,
  handleSetFilter,
  handleResetFilter,
}) => (
  <SlideIn direction={slideDirection.BOTTOM} isVisible={isModalOpen}>
    <div className={css['filter-modal']}>
      <div className={css['modal__offset']} onClick={handleCloseModal} />
      <div className={css['modal__header']}>
        <div className={css['modal__header__name']}>{filterName}</div>
        <div
          className={css['modal__header__reset']}
          onClick={() => {
            handleResetFilter();
            handleCloseModal();
          }}
        >
          초기화
        </div>
      </div>
      <div className={css['modal__list']}>
        {Array.from(filterMap).map(([key, value]) => (
          <div
            key={key}
            className={cn(
              css['list-item'],
              selectedKey === key && css['list-item--selected']
            )}
            onClick={() => {
              handleSetFilter(key);
              handleCloseModal();
            }}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  </SlideIn>
);

FilterModal.propTypes = {
  filterName: PropTypes.string,
  filterMap: PropTypes.instanceOf(Map),
  selectedKey: PropTypes.string,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  handleSetFilter: PropTypes.func,
  handleResetFilter: PropTypes.func,
};

export default observer(FilterModal);
