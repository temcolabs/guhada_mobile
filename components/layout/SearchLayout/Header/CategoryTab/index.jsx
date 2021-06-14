import css from './CategoryTab.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useHorizontalArrows } from 'hooks';

const CategoryTab = () => {
  /**
   * states
   */
  const {
    layout: layoutStore,
    searchByFilter: searchByFilterStore,
  } = useStores();
  const { category } = layoutStore.headerInfo;
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows([category]);

  /**
   * handlers
   */
  const handleClick = (id, target) => {
    if (id) {
      new Promise((res) =>
        res(
          searchByFilterStore.initializeSearch(
            { categoryIds: [id] },
            undefined,
            false
          )
        )
      ).then(() => {
        if (target) {
          scrollRef.current.scrollTo(target.offsetLeft - 30, 0);
        }
      });
    }
  };

  /**
   * render
   */
  return (
    <div className={css['category-tab']} ref={scrollRef}>
      {category.children ? (
        <>
          <div className={cn(css['tab-item'], css['selected'])}>전체보기</div>
          {category.children.map(({ id, title }) => (
            <div
              key={id}
              className={css['tab-item']}
              onClick={(e) => handleClick(id, e.target)}
            >
              {title}
            </div>
          ))}
        </>
      ) : (
        <>
          <div
            className={css['tab-item']}
            onClick={() => handleClick(category.parent.id)}
          >
            전체보기
          </div>
          {category.parent.children.map(({ id, title }) => (
            <div
              key={id}
              className={cn(
                css['tab-item'],
                category.id === id && css['selected']
              )}
              onClick={(e) => handleClick(id, e.target)}
            >
              {title}
            </div>
          ))}
        </>
      )}
      {arrowLeft && (
        <span
          className={cn(css['tab-arrow'], css['arrow--left'])}
          onClick={() => (scrollRef.current.scrollLeft -= 300)}
        />
      )}
      {arrowRight && (
        <span
          className={cn(css['tab-arrow'], css['arrow--right'])}
          onClick={() => (scrollRef.current.scrollLeft += 300)}
        />
      )}
    </div>
  );
};

CategoryTab.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number,
    parentId: PropTypes.number,
    siblings: PropTypes.array,
    children: PropTypes.array,
  }),
};

export default observer(CategoryTab);
