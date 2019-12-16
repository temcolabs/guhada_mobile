import React from 'react';
import Header from 'components/header/Header';
import css from './DetailPageLayout.module.scss';

/**
 * 상세 페이지용 레이아웃
 * 제목이 있는 헤더와 뒤로가기 버튼이 있음
 */
export default function DetailPageLayout({
  pageTitle,
  children,
  noPaddingBottom = false,
}) {
  return (
    <div>
      <Header headerShape={'detailPage'} pageTitle={pageTitle} />
      <div
        className={css.childrenWrap}
        style={{
          paddingBottom: noPaddingBottom ? 0 : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
