import css from './AdvancedFilterModal.module.scss';
import { useState, useCallback } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import useStores from 'stores/useStores';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import FilterTree from './FilterTree';

const AdvancedFilterModal = ({
  filterName = '상세검색',
  isModalOpen,
  handleCloseModal,
}) => {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();
  const [searchInputState, setSearchInputState] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  /**
   * handlers
   */
  const handleSetAbstractFilter = useCallback(
    (body = searchByFilterStore.defaultBody) => {
      searchByFilterStore.setAbstractFilter(body);
    },
    [searchByFilterStore]
  );
  const handleResetAbstractFilter = () => {
    searchByFilterStore.resetAbstractFilter();
  };
  const handleSubmitAbstractFilter = () => {
    searchByFilterStore.submitAbstractFilter();
  };

  /**
   * render
   */
  return (
    <SlideIn direction={slideDirection.BOTTOM} isVisible={isModalOpen}>
      <div className={css['filter-modal']}>
        <div className={css['modal__offset']} onClick={handleCloseModal} />
        <div className={css['modal__header']}>{filterName}</div>
        <div className={css['modal__filters']}>
          <div className={css['filter__category']}>
            <div
              className={cn(
                css['category__header'],
                isCategoryOpen && css['open']
              )}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              카테고리
              <span className={css['category__header__depth']}>
                {'여성 > 의류 > 바지'}
              </span>
            </div>
            {isCategoryOpen && (
              <div className={css['category__selection']}>
                <FilterTree nodeList={searchByFilterStore.categories} />
              </div>
            )}
          </div>
          <div className={css['filter__search']}>
            <input
              type="text"
              className={css['filter__search__input']}
              onChange={(e) => setSearchInputState(e.target.value)}
              value={searchInputState}
              placeholder="결과 내 재검색"
            />
          </div>
        </div>
        <div className={css['modal__buttons']}>
          <button
            className={css['button--reset']}
            onClick={handleResetAbstractFilter}
          >
            초기화
          </button>
          <button
            className={css['button--submit']}
            onClick={handleSubmitAbstractFilter}
          >
            검색결과 보기
          </button>
        </div>
      </div>
    </SlideIn>
  );
};

AdvancedFilterModal.propTypes = {
  filterName: PropTypes.string,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
};

export default observer(AdvancedFilterModal);
