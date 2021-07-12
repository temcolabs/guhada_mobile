import css from './Navigation.module.scss';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import CategoryModal from './CategoryModal';
import ToolbarBrand from 'components/toolbar/ToolbarBrand';
import { pushRoute } from 'lib/router';

const Navigation = ({ type, noNav }) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(0);

  /**
   * handlers
   */
  const handleClick = (id, route) => {
    if (type === id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      pushRoute(route);
    }
  };

  /**
   * render
   */
  return (
    <nav className={cn(css['nav'], noNav && css['no-nav'])}>
      <div
        className={cn(
          css['nav-button'],
          type === 'category' && css['selected']
        )}
        onClick={() => setIsModalOpen(1)}
      >
        <div
          className={cn(
            'icon',
            type === 'category' ? 'category--on' : 'category'
          )}
        />
        카테고리
      </div>
      <div
        className={cn(css['nav-button'], type === 'brand' && css['selected'])}
        onClick={() => setIsModalOpen(2)}
      >
        <div className={cn('icon', type === 'brand' ? 'brand--on' : 'brand')} />
        브랜드
      </div>
      <div
        className={cn(css['nav-button'], type === 'index' && css['selected'])}
        onClick={() => handleClick('index', '/')}
      >
        <div className={cn('icon', type === 'index' ? 'home--on' : 'home')} />홈
      </div>
      <div
        className={cn(
          css['nav-button'],
          type === 'community' && css['selected']
        )}
        onClick={() => handleClick('community', '/community')}
      >
        <div
          className={cn(
            'icon',
            type === 'community' ? 'community--on' : 'community'
          )}
        />
        커뮤니티
      </div>
      <div
        className={cn(css['nav-button'], type === 'mypage' && css['selected'])}
        onClick={() => handleClick('mypage', '/mypage')}
      >
        <div
          className={cn('icon', type === 'mypage' ? 'mypage--on' : 'mypage')}
        />
        마이페이지
      </div>

      {isModalOpen === 1 && (
        <CategoryModal handleClose={() => setIsModalOpen(0)} />
      )}
      {isModalOpen === 2 && <ToolbarBrand onClose={() => setIsModalOpen(0)} />}
    </nav>
  );
};

Navigation.propTypes = {
  type: PropTypes.string,
  noNav: PropTypes.bool,
};

export default memo(Navigation);
