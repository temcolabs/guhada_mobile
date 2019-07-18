import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import Header from 'components/header/Header';
import ToolBar from 'components/toolbar/ToolBar';

/**
 * DefaultLayout
 * 하단 ToolBar를 없애기 위해서는 toolBar props를 false로
 * 보내면 툴바 표현하지 않음
 *
 * headerShape 값에 따른 Header component 변경을 위해서 headerShape props 추가
 * @param {String} topLayout 페이지 레이아웃 형태에 따라서 사용된다. main, category, search 3가지 형태를 정의해두었다.
 * @param {String} pageTitle
 */
export default class DefaultLayout extends Component {
  render() {
    const { pageTitle, toolBar, headerShape, topLayout } = this.props;
    const headerSize = 60;
    const categorySize = 44;
    const searchTabSize = 56;

    let paddingTop;

    if (topLayout === 'main') {
      paddingTop = headerSize;
    } else if (topLayout === 'category') {
      paddingTop = headerSize + categorySize;
    } else if (topLayout === 'search') {
      paddingTop = headerSize + categorySize + searchTabSize;
    }

    return (
      <div className={css.wrap} style={{ paddingTop: `${paddingTop}px` }}>
        <Header headerShape={headerShape}>{pageTitle}</Header>
        {this.props.children}
        {toolBar === false ? null : <ToolBar />}
      </div>
    );
  }
}
