import css from './MenuSection.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import useStores from 'stores/useStores';
import { useVerticalArrows } from 'lib/hooks';
import { useRouter } from 'next/router';
import SubCategoryMenu from './SubCategoryMenu';

const categoryMenuList = [
  ['여성', 1],
  ['남성', 2],
  ['키즈', 3],
];
const menuList = [
  ['리뷰', '/review'],
  ['랭킹', '/ranking'],
  ['럭키드로우', '/event/luckydraw'],
  ['타임딜', '/event/timedeal'],
  ['기획전', '/event/special'],
  ['이벤트', '/event'],
];

const MenuSection = ({
  handlePathClick,
  handleClose,
  large = false,
  menu = true,
  height,
}) => {
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
      style={{
        height: `calc(${height}px - (7 / 18) * 100vw - ${large ? 120 : 60}px)`,
      }}
      className={css['modal__section']}
      ref={scrollRef}
    >
      <ul className={css['section__menu']}>
        {categoryMenuList.map(([title, id]) => (
          <li
            className={cn(css['section__menu__item'], large && css['large'])}
            key={id}
          >
            <div
              className={cn(
                css['item--category'],
                selectedCategory === id && css['open']
              )}
              onClick={() => handleCategoryClick(id)}
            >
              {title}
            </div>
            {categoryList[id - 1] && (
              <SubCategoryMenu
                open={selectedCategory === id}
                id={id}
                items={categoryList[id - 1].children}
                handleCategoryItemClick={handleCategoryItemClick}
              />
            )}
          </li>
        ))}
      </ul>
      {menu && (
        <ul
          className={cn(css['section__menu'], css['section__menu--border-top'])}
        >
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
      )}
      {arrowTop && (
        <span
          className={cn(
            css['tab-arrow'],
            css['arrow--top'],
            large && css['large'],
            'misc down'
          )}
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
  handlePathClick: PropTypes.func,
  handleClose: PropTypes.func,
  large: PropTypes.bool,
  menu: PropTypes.bool,
  height: PropTypes.number,
};

export default observer(MenuSection);
