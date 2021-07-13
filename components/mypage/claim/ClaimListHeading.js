import cn from 'classnames';
import css from './ClaimListHeading.module.scss';

export default function ClaimListHeading({
  title = '상품 리뷰',
  tabs = [
    {
      text: '',
      isSelected: true,
      onClick: () => {},
    },
  ],
}) {
  return (
    <div className={css.wrap}>
      <h2 className={css.title}>{title}</h2>
      <div className={css.tabWrap}>
        {tabs.map((tab, index) => {
          return (
            <div
              key={index}
              className={cn(css.tabItem, {
                [css.isSelected]: tab.isSelected,
              })}
              onClick={tab.onClick}
            >
              {tab.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
