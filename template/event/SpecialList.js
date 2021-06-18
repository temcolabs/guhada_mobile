import { observer } from 'mobx-react';
import css from './SpecialList.module.scss';
import ListItem from 'components/event/special/ListItem';
import Filter from 'components/event/special/Filter';
import useStores from 'stores/useStores';

function SpecialList() {
  const { special: specialStore } = useStores();

  return (
    <div className={css.wrap}>
      <div className={css.dashBoard}>
        <div className={css.totalCount}>
          총 {specialStore.specialList.length}개
        </div>
        <div className={css.filter}>
          <Filter
            onChange={(value) => {
              specialStore.getSpecialList(value);
            }}
          />
        </div>
      </div>

      {specialStore.specialList?.length > 0 && (
        <div className={css.specialListWrap}>
          {specialStore.specialList?.map((data, index) => {
            return <ListItem key={index} data={data} />;
          })}
        </div>
      )}
    </div>
  );
}

export default observer(SpecialList);
