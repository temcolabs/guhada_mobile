import css from './Navigation.module.scss';
import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { pushRoute } from 'childs/lib/router';
import ToolbarCategory from 'components/toolbar/ToolbarCategory';
import ToolbarBrand from 'components/toolbar/ToolbarBrand';

const Navigation = ({ type }) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(0);

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
          (type === 'home' || type === 'default') && css['selected']
        )}
        onClick={() => pushRoute('/?home=0')}
      >
        홈
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--community'],
          type === 'community' && css['selected']
        )}
        onClick={() => pushRoute('/community')}
      >
        커뮤니티
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--mypage'],
          type === 'mypage' && css['selected']
        )}
        onClick={() => pushRoute('/mypage')}
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
