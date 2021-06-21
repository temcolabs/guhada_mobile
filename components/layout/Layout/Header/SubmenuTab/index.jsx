import css from './Submenu.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';

const SubmenuTab = () => {
  const {} = useStores();

  return <div className={css['submenu-tab']}>SUBMENU</div>;
};

export default observer(SubmenuTab);
