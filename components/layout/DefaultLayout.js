import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import Header from 'components/header/Header';
import ToolBar from 'components/toolbar/ToolBar';

/**
 * DefaultLayout
 * 하단 ToolBar를 없애기 위해서는 toolBar props를 false로
 * 보내면 툴바 표현하지 않음
 */
export default class DefaultLayout extends Component {
  render() {
    const { pageTitle, toolBar } = this.props;
    return (
      <div className={css.wrap}>
        <Header>{pageTitle}</Header>
        {this.props.children}
        {toolBar === false ? null : <ToolBar />}
      </div>
    );
  }
}
