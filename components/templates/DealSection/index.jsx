import css from './DealSection.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useInfinteScroll } from 'hooks';

import DealItems from 'components/organisms/DealItems';
import FilterOption from './FilterOption';
import LoadMoreButton from './LoadMoreButton';

const DealSection = ({
  title,
  deals,
  isLoading,
  moreToLoad,
  handleLoadMore,
  isFilterable = false,
  isInfiniteScroll = true,
  displaySeller = false,
  displayTags = true,
  isLazy = true,
}) => {
  const handleInfiniteScroll = useInfinteScroll(handleLoadMore, moreToLoad);

  return (
    <div className={css['deal-section']}>
      {title && <div className={css['deal-section__title']}>{title}</div>}
      {isFilterable && <FilterOption />}
      <DealItems
        deals={deals}
        displaySeller={displaySeller}
        displayTags={displayTags}
        isLazy={isLazy}
      />
      {isInfiniteScroll ? (
        <div ref={handleInfiniteScroll} />
      ) : (
        moreToLoad && (
          <LoadMoreButton isLoading={isLoading} onClick={handleLoadMore} />
        )
      )}
    </div>
  );
};

DealSection.propTypes = {
  header: PropTypes.string,
  deals: PropTypes.object,
  isLoading: PropTypes.bool,
  moreToLoad: PropTypes.bool,
  handleLoadMore: PropTypes.func,
  isFilterable: PropTypes.bool,
  isInfiniteScroll: PropTypes.bool,
  displaySeller: PropTypes.bool,
  displayTags: PropTypes.bool,
  isLazy: PropTypes.bool,
};

export default observer(DealSection);
