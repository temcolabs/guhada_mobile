import css from './Navigation.module.scss';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useRouter } from 'next/router';
import ToolbarCategory from 'components/toolbar/ToolbarCategory';
import ToolbarBrand from 'components/toolbar/ToolbarBrand';

const Navigation = ({ type }) => {
  /**
   * states
   */
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(0);

  /**
   * handlers
   */
  const handleClick = (id, route) => {
    if (type === id) {
      window.scrollTo(0, 0);
    } else {
      router.push(route);
    }
  };

  /**
   * render
   */
  return (
    <nav className={css['nav']}>
      <div
        className={cn(
          css['nav-button'],
          css['button--category'],
          type === 'category' && css['selected']
        )}
        onClick={() => setIsModalOpen(1)}
      >
        카테고리
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--brand'],
          type === 'brand' && css['selected']
        )}
        onClick={() => setIsModalOpen(2)}
      >
        브랜드
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--home'],
          type === 'home' && css['selected']
        )}
        onClick={() => handleClick('home', '/')}
      >
        홈
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--community'],
          type === 'community' && css['selected']
        )}
        onClick={() => handleClick('community', '/community')}
      >
        커뮤니티
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--mypage'],
          type === 'mypage' && css['selected']
        )}
        onClick={() => handleClick('mypage', '/mypage')}
      >
        마이페이지
      </div>

      <ToolbarCategory
        isVisible={isModalOpen === 1}
        onClose={() => setIsModalOpen(0)}
      />
      <ToolbarBrand
        isVisible={isModalOpen === 2}
        onClose={() => setIsModalOpen(0)}
      />
    </nav>
  );
};

Navigation.propTypes = {
  type: PropTypes.string,
};

export default memo(Navigation);
