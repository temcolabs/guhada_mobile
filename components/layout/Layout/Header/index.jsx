import css from './Header.module.scss';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useRouter } from 'next/router';
import MenuTab from './MenuTab';
import SubmenuTab from './SubmenuTab';
import CategoryTab from './CategoryTab';
import BurgerModal from 'components/header/HeaderMenu';
import SearchModal from 'components/header/SearchMenu';
import FilterOption from 'components/templates/DealSection/FilterOption';
import SearchTab from './SearchTab';

const Header = ({
  title,
  logo,
  burger,
  back,
  home,
  search,
  cart,
  menu,
  submenu,
  category,
  filter,
  slide,
  searchbox,
  isScrollDown,
}) => {
  /**
   * states
   */
  const router = useRouter();
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
                  onClick={router.back}
                />
              )}
              {burger && (
                <div
                  className={cn(css['button'], css['button--burger'])}
                  onClick={() => setIsModalOpen(2)}
                />
              )}
              {logo && (
                <div
                  className={cn(css['button'], css['button--logo'])}
                  onClick={() => router.push('/')}
                />
              )}
            </div>
            {title && <div className={css['tab__title']}>{title}</div>}
            <div className={css['tab__buttons']}>
              {home && (
                <div
                  className={cn(css['button'], css['button--home'])}
                  onClick={() => router.push('/')}
                />
              )}
              {search && (
                <div
                  className={cn(css['button'], css['button--search'])}
                  onClick={() => setIsModalOpen(1)}
                />
              )}
              {cart && (
                <div
                  className={cn(css['button'], css['button--cart'])}
                  onClick={() => router.push('/shoppingcart')}
                />
              )}
            </div>
          </div>
        )}
        {menu && <MenuTab />}
        {submenu && <SubmenuTab />}
        {category && <CategoryTab />}
      </nav>
      {filter && <FilterOption hide={isScrollDown} float />}

      {!searchbox && (
        <SearchModal
          isVisible={isModalOpen === 1}
          onClose={() => setIsModalOpen(0)}
        />
      )}
      {burger && (
        <BurgerModal
          isVisible={isModalOpen === 2}
          onClose={() => setIsModalOpen(0)}
        />
      )}
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  logo: PropTypes.bool,
  burger: PropTypes.bool,
  back: PropTypes.bool,
  home: PropTypes.bool,
  search: PropTypes.bool,
  cart: PropTypes.bool,
  menu: PropTypes.bool,
  submenu: PropTypes.bool,
  category: PropTypes.bool,
  filter: PropTypes.bool,
  slide: PropTypes.bool,
  searchbox: PropTypes.bool,
  isScrollDown: PropTypes.bool,
};

export default memo(Header);
