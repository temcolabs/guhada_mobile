import css from './Header.module.scss';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { pushRoute } from 'childs/lib/router';
import CategoryTab from './CategoryTab';
import BurgerModal from 'components/header/HeaderMenu';
import SearchModal from 'components/header/SearchMenu';
import FilterOption from 'components/templates/DealSection/FilterOption';
import SearchTab from './SearchTab';

const Header = ({
  logo,
  title,
  back,
  home,
  category,
  filter,
  slide,
  isScrollDown,
  searchbox,
}) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(0);

  /**
   * render
   */
  return (
    <header
      className={cn(css['header'], slide && isScrollDown && css['scroll-down'])}
    >
      <nav className={css['header__tabs']}>
        {searchbox ? (
          <SearchTab />
        ) : (
          <div className={css['tab']}>
            <div className={css['tab__buttons']}>
              {back && (
                <div
                  className={cn(css['button'], css['button--back'])}
                  onClick={() => window && window.history.back()}
                />
              )}
              <div
                className={cn(css['button'], css['button--burger'])}
                onClick={() => setIsModalOpen(2)}
              />
              {logo && (
                <div
                  className={cn(css['button'], css['button--logo'])}
                  onClick={() => pushRoute('/?home=0')}
                />
              )}
            </div>
            {title && <div className={css['tab__title']}>{title}</div>}
            <div className={css['tab__buttons']}>
              {home && (
                <div
                  className={cn(css['button'], css['button--home'])}
                  onClick={() => pushRoute('/?home=0')}
                />
              )}
              <div
                className={cn(css['button'], css['button--search'])}
                onClick={() => setIsModalOpen(1)}
              />
              <div
                className={cn(css['button'], css['button--cart'])}
                onClick={() => pushRoute('/shoppingcart')}
              />
            </div>
          </div>
        )}
        {category && <CategoryTab />}
      </nav>
      {filter && <FilterOption hide={isScrollDown} float />}

      {!searchbox && (
        <SearchModal
          isVisible={isModalOpen === 1}
          onClose={() => setIsModalOpen(0)}
        />
      )}
      <BurgerModal
        isVisible={isModalOpen === 2}
        onClose={() => setIsModalOpen(0)}
      />
    </header>
  );
};

Header.propTypes = {
  logo: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  back: PropTypes.bool,
  home: PropTypes.bool,
  category: PropTypes.bool,
  filter: PropTypes.bool,
  slide: PropTypes.bool,
  isScrollDown: PropTypes.bool,
  searchbox: PropTypes.bool,
};

export default memo(Header);
