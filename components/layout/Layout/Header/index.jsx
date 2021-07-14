import css from './Header.module.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import sessionStorage from 'childs/lib/common/sessionStorage';
import MenuTab from './MenuTab';
import SubmenuTab from './SubmenuTab';
import CategoryTab from './CategoryTab';
import BurgerModal from './BurgerModal';
import SearchModal from './SearchModal';
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
  cartCount,
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
   * handlers
   */
  const backHandler = () => {
    if (document.referrer && !sessionStorage.get('init')) {
      sessionStorage.set('init', 1);
      const currentState = JSON.stringify(window.history.state);
      window.history.replaceState({ as: '/', url: '/' }, '', '/');
      const prevState = JSON.parse(currentState);
      window.history.pushState(prevState, '', prevState.as);
    }
  };

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
                  ref={backHandler}
                  className={'icon back'}
                  onClick={router.back}
                />
              )}
              {burger && (
                <div
                  className={'icon burger'}
                  onClick={() => setIsModalOpen(2)}
                />
              )}
              {logo && (
                <div className={'icon logo'} onClick={() => router.push('/')} />
              )}
            </div>
            {title && <div className={css['tab__title']}>{title}</div>}
            <div className={css['tab__buttons']}>
              {home && (
                <div className={'icon home'} onClick={() => router.push('/')} />
              )}
              {search && (
                <div
                  className={'icon search'}
                  onClick={() => setIsModalOpen(1)}
                />
              )}
              {cart && (
                <div
                  className={'icon cart'}
                  onClick={() => router.push('/shoppingcart')}
                >
                  {cartCount > 0 && (
                    <div className={css['cart__count']}>{cartCount}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {menu && <MenuTab />}
        {submenu && <SubmenuTab />}
        {category && <CategoryTab />}
      </nav>
      {filter && <FilterOption hide={isScrollDown} float />}

      {!searchbox && isModalOpen === 1 && (
        <SearchModal handleClose={() => setIsModalOpen(0)} />
      )}
      {burger && isModalOpen === 2 && (
        <BurgerModal handleClose={() => setIsModalOpen(0)} />
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
  cartCount: PropTypes.number,
  menu: PropTypes.bool,
  submenu: PropTypes.bool,
  category: PropTypes.bool,
  filter: PropTypes.bool,
  slide: PropTypes.bool,
  searchbox: PropTypes.bool,
  isScrollDown: PropTypes.bool,
};

export default observer(Header);
