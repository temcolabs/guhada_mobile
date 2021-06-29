import css from './FilterModal.module.scss';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ModalPortal from 'components/templates/ModalPortal';

/**
 * a type of FilterModal which takes a `Map<key, value>` object as its item list
 */
const FilterModal = ({
  filterName,
  filterMap,
  selectedKey,
  handleCloseModal,
  handleSetFilter,
  handleResetFilter,
}) => (
  <ModalPortal handleClose={handleCloseModal} gutter slide={1}>
    <div className={css['filter-modal']}>
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
  </ModalPortal>
);

FilterModal.propTypes = {
  filterName: PropTypes.string,
  filterMap: PropTypes.instanceOf(Map),
  selectedKey: PropTypes.string,
  handleCloseModal: PropTypes.func,
  handleSetFilter: PropTypes.func,
  handleResetFilter: PropTypes.func,
};

export default observer(FilterModal);
