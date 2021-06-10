import css from './Header.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { pushRoute } from 'childs/lib/router';
import CategoryTab from './CategoryTab';
import SearchModal from 'components/header/SearchMenu';
import BurgerModal from 'components/header/HeaderMenu';

const Header = ({ title, back, home, category, isScrollDown }) => {
  const [isModalOpen, setIsModalOpen] = useState(0);

  return (
    <>
      <header className={cn(css['header'], isScrollDown && css['scroll-down'])}>
        <nav className={css['header__nav']}>
          <div className={css['nav__section']}>
            {back && (
              <div className={cn(css['header-button'], css['button--back'])} />
            )}
            <div
              className={cn(css['header-button'], css['button--burger'])}
              onClick={() => setIsModalOpen(2)}
            />
            {!title && (
              <div
                className={cn(css['header-button'], css['button--logo'])}
                onClick={() => pushRoute('/?home=0')}
              />
            )}
          </div>
          {title && <div className={css['header__title']}>{title}</div>}
          <div className={css['nav__section']}>
            {home && (
              <div
                className={cn(css['header-button'], css['button--home'])}
                onClick={() => pushRoute('/?home=0')}
              />
            )}
            <div
              className={cn(css['header-button'], css['button--search'])}
              onClick={() => setIsModalOpen(1)}
            />
            <div
              className={cn(css['header-button'], css['button--cart'])}
              onClick={() => pushRoute('/shoppingcart')}
            />
          </div>
        </nav>
        {category && <CategoryTab />}
      </header>

      <SearchModal
        isVisible={isModalOpen === 1}
        onClose={() => setIsModalOpen(0)}
      />
      <BurgerModal
        isVisible={isModalOpen === 2}
        onClose={() => setIsModalOpen(0)}
      />
    </>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  back: PropTypes.bool,
  home: PropTypes.bool,
  category: PropTypes.bool,
  isScrollDown: PropTypes.bool,
};

export default Header;
