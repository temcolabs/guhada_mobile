import css from './SellerStoreTab.module.scss';
import cn from 'classnames';

export default function SellerStoreTab({ tab, setTab = () => {} }) {
  return (
    <>
      <div className={css.wrap}>
        <div
          className={cn(css.item, { [css.selected]: tab === 'store' })}
          onClick={() => setTab('store')}
        >
          셀러스토어
        </div>
        <div
          className={cn(css.item, { [css.selected]: tab === 'info' })}
          onClick={() => setTab('info')}
        >
          셀러정보
        </div>
        <div
          className={cn(css.item, { [css.selected]: tab === 'review' })}
          onClick={() => setTab('review')}
        >
          셀러리뷰
        </div>
      </div>
    </>
  );
}
