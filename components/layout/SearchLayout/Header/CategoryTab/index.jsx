import css from './CategoryTab.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';

const CategoryTab = () => {
  /**
   * states
   */
  const { search: searchStore } = useStores();

  /**
   * render
   */
  return <div className={css['category-tab']}>CATEGORYTAB</div>;
};

export default observer(CategoryTab);
