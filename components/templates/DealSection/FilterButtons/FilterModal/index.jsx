import css from './FilterModal.module.scss';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

const arrayFromMap = (map) =>
  map instanceof Map && Array.from(map, ([key, value]) => ({ key, value }));

const FilterModal = ({ isModalOpen, handleCloseModal }) => {
  return (
    <SlideIn direction={slideDirection.BOTTOM} isVisible={isModalOpen}>
      <div
        onClick={(e) => {
          handleCloseModal();
        }}
      >
        <div className={css['filter-modal']}>
          <div className={css['close-button']} onClick={handleCloseModal} />
          <div className={css['modal__header']}>
            <div className={css['modal__header__name']}>{'NAME'}</div>
            <div
              className={css['modal__header__reset']}
              onClick={() => {
                handleCloseModal();
              }}
            >
              <div className={css['reset-button']} /> 초기화
            </div>
          </div>
          <div className={css['modal__list']}>{'LIST'}</div>
        </div>
      </div>
    </SlideIn>
  );
};

FilterModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  selectedFilter: PropTypes.shape({
    filter: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    idx: PropTypes.number,
  }).isRequired,
};

export default observer(FilterModal);
