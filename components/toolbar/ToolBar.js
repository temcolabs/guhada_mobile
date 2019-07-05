import React from 'react';
import css from './ToolBar.module.scss';
import cn from 'classnames';
import { LinkRoute } from 'lib/router';
export default function ToolBar() {
  return (
    <div className={css.wrap}>
      <LinkRoute href={`/category`}>
        <div className={cn(css.itemWrap, css.category, css.selected)}>
          카테고리
        </div>
      </LinkRoute>
      <LinkRoute href={`/brand`}>
        <div className={cn(css.itemWrap, css.brand)}>브랜드</div>
      </LinkRoute>
      <div className={cn(css.itemWrap, css.home)}>홈</div>
      <div className={cn(css.itemWrap, css.community)}>커뮤니티</div>
      <div className={cn(css.itemWrap, css.mypage)}>마이페이지</div>
    </div>
  );
}
