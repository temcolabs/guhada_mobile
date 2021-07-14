import css from './DealSection.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useInfinteScroll } from 'hooks';
import DealItems from 'components/organisms/DealItems';
import FilterOption from './FilterOption';
import LoadMoreButton from './LoadMoreButton';
import Spinner, { SpinnerDiv } from 'components/atoms/Misc/Spinner';
import FilterTags from './FilterTags';
import SpecialFilterTags from './SpecialFilterTags';

const DealSection = ({
  deals,
  isLoading,
  moreToLoad,
  handleLoadMore,
  thumbnail = 0,
  filter = false,
  filterTags = false,
  specialFilterTags = false,
  filterOptionSticky = false,
  isInfiniteScroll = true,
  displaySeller = false,
  displayTags = true,
  isLazy = true,
}) => {
  /**
   * handlers
   */
  const handleInfiniteScroll = useInfinteScroll(handleLoadMore, moreToLoad);

  /**
   * render
   */
  return (
    <div className={css['deal-section']}>
      {specialFilterTags && <SpecialFilterTags />}
      {filter && (
        <FilterOption
          sticky={filterOptionSticky}
          specialFilterTags={specialFilterTags}
        />
      )}
      {filterTags && <FilterTags specialFilterTags={specialFilterTags} />}
      {isLoading ? (
        <Spinner />
      ) : (
        <DealItems
          deals={deals}
          thumbnail={thumbnail}
          displaySeller={displaySeller}
          displayTags={displayTags}
          isLazy={isLazy}
        />
      )}
      {moreToLoad &&
        (isInfiniteScroll ? (
          <div ref={handleInfiniteScroll}>
            {deals.length > 0 && <SpinnerDiv />}
          </div>
        ) : (
          <LoadMoreButton isLoading={isLoading} onClick={handleLoadMore} />
        ))}
    </div>
  );
};

DealSection.propTypes = {
  header: PropTypes.string,
  deals: PropTypes.object,
  isLoading: PropTypes.bool,
  moreToLoad: PropTypes.bool,
  handleLoadMore: PropTypes.func,
  thumbnail: PropTypes.number,
  filter: PropTypes.bool,
  filterTags: PropTypes.bool,
  specialFilterTags: PropTypes.bool,
  filterOptionSticky: PropTypes.bool,
  isInfiniteScroll: PropTypes.bool,
  displaySeller: PropTypes.bool,
  displayTags: PropTypes.bool,
  isLazy: PropTypes.bool,
};

export default observer(DealSection);
