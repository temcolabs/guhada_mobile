import css from './CategoryTab.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useHorizontalArrows } from 'hooks';

import { useEffect } from 'react';

const CategoryTab = () => {
  /**
   * states
   */
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();
  const {
    layout: layoutStore,
    searchByFilter: searchByFilterStore,
  } = useStores();
  const { category } = layoutStore.headerInfo;

  /**
   * handlers
   */
  const handleClick = (id) => {
    layoutStore.pushHistory();
    searchByFilterStore.initializeSearch({
      categoryIds: [...searchByFilterStore.defaultBody.categoryIds, id], // TODO
    });
  };

  useEffect(() => {});

  /**
   * render
   */
  return (
    <div className={css['category-tab']} ref={scrollRef}>
      {category.children ? (
        <>
          <div
            className={cn(css['tab-item'], css['selected'])}
            onClick={() => handleClick(category.id)}
          >
            전체보기
          </div>
          {category.children.map(({ id, title }) => (
            <div
              key={id}
              className={css['tab-item']}
              onClick={() => handleClick(id)}
            >
              {title}
            </div>
          ))}
        </>
      ) : (
        <>
          <div
            className={css['tab-item']}
            onClick={() => handleClick(category.parentId)}
          >
            전체보기
          </div>
          {category.siblings.map(({ id, title }) => (
            <div
              key={id}
              className={cn(
                css['tab-item'],
                category.id === id && css['selected']
              )}
              onClick={() => handleClick(id)}
            >
              {title}
            </div>
          ))}
        </>
      )}
      {arrowLeft && (
        <span className={cn(css['tab-arrow'], css['arrow--left'])} />
      )}
      {arrowRight && (
        <span className={cn(css['tab-arrow'], css['arrow--right'])} />
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
