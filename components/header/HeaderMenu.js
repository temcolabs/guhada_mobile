import React from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './HeaderMenu.module.scss';
/**
 * 헤더의 햄버거 버튼 클릭시 표시되는 메뉴
 */
export default function HeaderMenu({ isVisible, onClose }) {
  return (
    <SlideIn isVisible={isVisible} direction={slideDirection.LEFT}>
      <div className={css.wrapper}>
        <button onClick={onClose}>닫기</button>
      </div>
    </SlideIn>
  );
}
