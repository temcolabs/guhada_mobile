import css from './SpecialFilterTags.module.scss';
import cn from 'classnames';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useHorizontalArrows } from 'hooks';
import _ from 'lodash';

const SpecialFilterTags = () => {
  /**
   * states
   */
  const [filterTags, setFilterTags] = useState([]);
  const { searchByFilter: searchByFilterStore } = useStores();
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows([filterTags]);

  /**
   * side effects
   */
  useEffect(() => {
    const mapObject = new Map();

    searchByFilterStore.unfungibleCategories.forEach((item) => {
      if (item.children) {
        item.children.forEach((childItem) => {
          const entry = mapObject.get(childItem.title);
          if (entry) {
            entry.push(childItem.id);
          } else {
            mapObject.set(childItem.title, [childItem.id]);
          }
        });
      }
    });

    setFilterTags(mapObject);
  }, [searchByFilterStore.unfungibleCategories]);

  /**
   * handlers
   */
  const handleAllFilterTagClick = (target) => {
    searchByFilterStore.resetFilter();
    scrollRef.current.scrollTo(target.offsetLeft - 30, 0);
  };
  const handleFilterTagClick = (target, idList) => {
    searchByFilterStore.resetAbstractFilter();
    searchByFilterStore.setAbstractFilter({ categoryIds: idList });
    searchByFilterStore.submitAbstractFilter();
    scrollRef.current.scrollTo(target.offsetLeft - 30, 0);
  };

  const handleScrollLeft = () => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft - 330,
      behavior: 'smooth',
    });
  };
  const handleScrollRight = () => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + 330,
      behavior: 'smooth',
    });
  };

  /**
   * render
   */
  return (
    <div className={css['special-filter']}>
      <ul className={css['special-filter__tags']} ref={scrollRef}>
        {filterTags.size > 1 && (
          <li
            key="전체보기"
            className={cn(
              css['tag'],
              !searchByFilterStore.isFiltered && css['selected']
            )}
            onClick={handleAllFilterTagClick}
          >
            전체보기
          </li>
        )}
        {Array.from(filterTags).map(([title, idList]) => (
          <li
            key={title}
            className={cn(
              css['tag'],
              _.isEqual(
                _.sortBy(searchByFilterStore.body.categoryIds),
                _.sortBy(idList)
              ) && css['selected']
            )}
            onClick={(e) => handleFilterTagClick(e.target, idList)}
          >
            {title}
          </li>
        ))}
      </ul>
      {arrowLeft && (
        <span
          className={cn(css['tab-arrow'], css['arrow--left'], 'misc slider')}
          onClick={handleScrollLeft}
        />
      )}
      {arrowRight && (
        <span
          className={cn(css['tab-arrow'], css['arrow--right'], 'misc slider')}
          onClick={handleScrollRight}
        />
      )}
    </div>
  );
};

export default observer(SpecialFilterTags);
