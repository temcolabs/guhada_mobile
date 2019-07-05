import React, { useState } from 'react';
import css from './ToolBar.module.scss';
import cn from 'classnames';
import ToolbarCategory from './ToolbarCategory';

export default function ToolBar() {
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [isBrandVisible, setIsBrandVisible] = useState(false);

  return (
    <div className={css.wrap}>
      <div
        onClick={() => setIsCategoryVisible(true)}
        className={cn(css.itemWrap, css.category, css.selected)}
      >
        카테고리
      </div>
      <div onClick={() => {}} className={cn(css.itemWrap, css.brand)}>
        브랜드
      </div>
      <div onClick={() => {}} className={cn(css.itemWrap, css.home)}>
        홈
      </div>
      <div onClick={() => {}} className={cn(css.itemWrap, css.community)}>
        커뮤니티
      </div>
      <div onClick={() => {}} className={cn(css.itemWrap, css.mypage)}>
        마이페이지
      </div>

      {/* 카테고리 슬라이드 업 모달 */}
      <ToolbarCategory
        isVisible={isCategoryVisible}
        onClose={() => setIsCategoryVisible(false)}
      />
    </div>
  );
}
