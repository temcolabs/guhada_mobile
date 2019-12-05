import React from 'react';
import Header from 'components/header/Header';

/**
 * 상세 페이지용 레이아웃
 * 제목이 있는 헤더와 뒤로가기 버튼이 있음
 */
export default function DetailPageLayout({ pageTitle, children }) {
  return (
    <div>
      <Header headerShape={'detailPage'} pageTitle={pageTitle} />
      <div>{children}</div>
    </div>
  );
}
