import css from './Search.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import DealSection from 'components/templates/DealSection';

function Search() {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();

  /**
   * render
   */
  return (
    <div className={css['search-wrapper']}>
      <DealSection
        deals={searchByFilterStore.deals}
        isLoading={searchByFilterStore.isInitial}
        moreToLoad={searchByFilterStore.moreToLoad}
        handleLoadMore={() => searchByFilterStore.search(true)}
        thumbnail={searchByFilterStore.thumbnail}
        isFilterable
      />
    </div>
  );
}

export default observer(Search);
