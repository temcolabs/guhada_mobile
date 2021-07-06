import css from './MenuSection.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import useStores from 'stores/useStores';
import { useVerticalArrows } from 'hooks';
import { useRouter } from 'next/router';
import SubCategoryMenu from './SubCategoryMenu';

const categoryMenuList = [['여성', 1], ['남성', 2], ['키즈', 3]];

const MenuSection = ({ menuList, handlePathClick, handleClose, height }) => {
  /**
   * states
   */
  const router = useRouter();
  const { category: categoryStore } = useStores();
  const categoryList = categoryStore.category;
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [scrollRef, arrowTop, arrowBottom] = useVerticalArrows([
    selectedCategory,
  ]);

  /**
   * handlers
   */
  const handleCategoryClick = (id) => {
    if (selectedCategory === id) {
      setSelectedCategory(0);
    } else {
      setSelectedCategory(id);
    }
  };
  const handleCategoryItemClick = (id) => {
    handleClose();
    router.push(`/search?category=${id}`);
  };

  /**
   * render
   */
  return (
    <div
      style={{ height: `calc(${height}px - (7 / 18) * 100vw - 60px)` }}
      className={css['modal__section']}
      ref={scrollRef}
    >
      <ul className={cn(css['section__menu'], css['section__menu--border'])}>
        {categoryMenuList.map(([title, id]) => (
          <li
            className={css['section__menu__item']}
            key={id}
            onClick={() => handleCategoryClick(id)}
          >
            <div className={selectedCategory === id ? css['on'] : ''}>
              {title}
            </div>
            <SubCategoryMenu
              on={selectedCategory === id}
              id={id}
              items={categoryList[id - 1].children}
              handleCategoryItemClick={handleCategoryItemClick}
            />
          </li>
        ))}
      </ul>
      <ul className={css['section__menu']}>
        {menuList.map(([name, path]) => (
          <li
            className={css['section__menu__item']}
            key={name}
            onClick={() => handlePathClick(path)}
          >
            <div
              className={cn(
                (name === '타임딜' || name === '럭키드로우') && css['event']
              )}
            >
              {name}
            </div>
          </li>
        ))}
      </ul>
      {arrowTop && (
        <span
          className={cn(css['tab-arrow'], css['arrow--top'], 'misc down')}
        />
      )}
      {arrowBottom && (
        <span
          className={cn(css['tab-arrow'], css['arrow--bottom'], 'misc down')}
        />
      )}
    </div>
  );
};

MenuSection.propTypes = {
  menuList: PropTypes.array,
  handlePathClick: PropTypes.func,
  handleClose: PropTypes.func,
  height: PropTypes.number,
};

export default observer(MenuSection);
