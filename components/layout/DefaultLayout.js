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
 * @param {Number} paddingTop 40,80,136 등 제한적으로 사용 가능하다
 */
export default class DefaultLayout extends Component {
  render() {
    const { pageTitle, toolBar, headerShape, paddingTop } = this.props;
    return (
      <div className={css.wrap} style={{ paddingTop: `${paddingTop}px` }}>
        <Header headerShape={headerShape}>{pageTitle}</Header>
        {this.props.children}
        {toolBar === false ? null : <ToolBar />}
      </div>
    );
  }
}
