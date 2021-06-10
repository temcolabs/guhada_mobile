import css from './Navigation.module.scss';
import { useState } from 'react';
import cn from 'classnames';
import { pushRoute } from 'childs/lib/router';
import { useRouter } from 'next/router';
import ToolbarCategory from 'components/toolbar/ToolbarCategory';
import ToolbarBrand from 'components/toolbar/ToolbarBrand';

const Navigation = () => {
  /**
   * states
   */
  const router = useRouter();
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
          router.route === '/search' && router.query.category && css['selected']
        )}
        onClick={() => setIsModalOpen(1)}
      >
        카테고리
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--brand'],
          router.route === '/search' &&
            !router.query.category &&
            router.query.brand &&
            css['selected']
        )}
        onClick={() => setIsModalOpen(2)}
      >
        브랜드
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--home'],
          router.route === '/' && css['selected']
        )}
        onClick={() => pushRoute('/?home=0')}
      >
        홈
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--community'],
          router.route === '/community' && css['selected']
        )}
        onClick={() => pushRoute('/community')}
      >
        커뮤니티
      </div>
      <div
        className={cn(
          css['nav-button'],
          css['button--mypage'],
          router.route === '/mypage' && css['selected']
        )}
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

export default Navigation;
