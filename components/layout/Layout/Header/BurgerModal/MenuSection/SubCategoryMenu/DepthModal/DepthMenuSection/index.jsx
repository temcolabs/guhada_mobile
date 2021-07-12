import css from './DepthMenuSection.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useVerticalArrows } from 'lib/hooks';
import SubDepthMenu from './SubDepthMenu';

const DepthMenuSection = ({
  id,
  children,
  handleCategoryItemClick,
  height,
}) => {
  /**
   * states
   */
  const [selectedSubcategory, setSelectedSubcategory] = useState(0);
  const [scrollRef, arrowTop, arrowBottom] = useVerticalArrows([
    selectedSubcategory,
  ]);

  /**
   * handlers
   */
  const handleSubcategoryItemClick = (subId) => {
    if (selectedSubcategory === subId) {
      setSelectedSubcategory(0);
    } else {
      setSelectedSubcategory(subId);
    }
  };
  const handleItemClick = (item) => {
    if (item.children) {
      handleSubcategoryItemClick(item.id);
    } else {
      handleCategoryItemClick(item.id);
    }
  };

  /**
   * render
   */
  return (
    <div
      style={{
        height: `calc(${height}px - 60px)`,
      }}
      className={css['modal__section']}
      ref={scrollRef}
    >
      <ul className={css['category-list']}>
        <li
          className={css['list__item']}
          onClick={() => handleCategoryItemClick(id)}
        >
          전체보기
        </li>
        {children.map((item) => (
          <li key={item.id} className={css['list__item']}>
            <div
              className={cn(
                item.children && selectedSubcategory === item.id && css['open']
              )}
              onClick={() => handleItemClick(item)}
            >
              {item.title}
              {item.children && (
                <span
                  className={cn(
                    css['openable'],
                    selectedSubcategory === item.id && css['open']
                  )}
                />
              )}
            </div>
            {item.children && (
              <SubDepthMenu
                selectedSubcategory={selectedSubcategory}
                item={item}
                handleCategoryItemClick={handleCategoryItemClick}
              />
            )}
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

DepthMenuSection.propTypes = {
  id: PropTypes.number,
  children: PropTypes.object,
  handleCategoryItemClick: PropTypes.func,
  height: PropTypes.number,
};

export default DepthMenuSection;
