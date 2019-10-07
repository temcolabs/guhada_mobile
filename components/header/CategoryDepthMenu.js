import React from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './CategoryDepthMenu.module.scss';
import CategoryDepth from './item/CategoryDepth';
import HeaderNavigator from './HeaderNavigator';

/**
 * 카테고리 1댑스 클릭시 보여지는 메뉴
 */
export default function CategoryDepthMenu({
  isVisible,
  onBack,
  onClose,
  categoryId,
  categoryTitle,
  onCloseMenu,
}) {
  return (
    <SlideIn isVisible={isVisible} direction={slideDirection.RIGHT}>
      <div className={css.wrapper}>
        <HeaderNavigator
          onBack={onBack}
          onClose={onClose}
          categoryTitle={categoryTitle}
        />
        <CategoryDepth
          categoryId={categoryId}
          onClose={onClose}
          onCloseMenu={onCloseMenu}
        />
      </div>
    </SlideIn>
  );
}
