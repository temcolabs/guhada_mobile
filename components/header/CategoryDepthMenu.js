import React from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './CategoryDepthMenu.module.scss';
import CategoryDepth from './item/CategoryDepth';

/**
 * 카테고리 1댑스 클릭시 보여지는 메뉴
 */
export default function CategoryDepthMenu({ isVisible, onClose, categoryId }) {
  return (
    <SlideIn isVisible={isVisible} direction={slideDirection.RIGHT}>
      <div className={css.wrapper}>
        <div className={css.topWrap}>
          {categoryId}
          <button onClick={onClose}>닫기</button>
        </div>
        <CategoryDepth categoryId={categoryId} />
      </div>
    </SlideIn>
  );
}
