import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import Header from 'components/header/Header';
import ToolBar from 'components/toolbar/ToolBar';
import Router from 'next/router';
import { inject, observer } from 'mobx-react';

const topLayouts = {
  main: 'main',
  category: 'category',
  brand: 'brand',
  search: 'search',
  keyword: 'keyword',
};

/**
 * DefaultLayout
 * 하단 ToolBar를 없애기 위해서는 toolBar props를 false로
 * 보내면 툴바 표현하지 않음
 *
 * headerShape 값에 따른 Header component 변경을 위해서 headerShape props 추가
 * @param {String} topLayout 페이지 레이아웃 형태에 따라서 사용된다. main, category, search 3가지 형태를 정의해두었다.
 * @param {String} pageTitle
 */
@inject('shoppingcart', 'user')
@observer
class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    Router.onRouteChangeComplete = () => {
      this.shoppingCartAmountCheck();
    };
  }

  static defaultProps = {
    wrapperStyle: {},
  };

  /**
   * 페이지에 따라서 상단 패딩의 높이가 다르다.
   * topLayout props 값을 기준으로 계산한다
   */
  get paddingTopMap() {
    const headerHeight = 60;
    const categorySize = 44;
    const searchTabSize = 56;

    return {
      [topLayouts.main]: headerHeight,
      [topLayouts.category]: headerHeight + categorySize,
      [topLayouts.brand]: headerHeight + searchTabSize,
      [topLayouts.search]: headerHeight + categorySize + searchTabSize,
      [topLayouts.keyword]: headerHeight + searchTabSize,
    };
  }

  componentDidMount() {
    this.shoppingCartAmountCheck();
  }

  shoppingCartAmountCheck = () => {
    const job = () => {
      this.props.shoppingcart.globalGetUserShoppingCartList();
    };
    this.props.user.pushJobForUserInfo(job);
  };

  render() {
    const {
      pageTitle,
      toolBar,
      headerShape,
      topLayout,
      scrollDirection,
      wrapperStyle,
    } = this.props;

    let cartAmount = this.props.shoppingcart.cartAmount;

    return (
      <div
        className={css.wrap}
        style={{
          ...wrapperStyle,
          paddingTop: `${this.paddingTopMap[topLayout]}px`,
        }}
      >
        {topLayout === 'keyword' ? null : (
          <Header
            headerShape={headerShape}
            cartAmount={cartAmount}
            scrollDirection={scrollDirection}
          >
            {pageTitle}
          </Header>
        )}
        {this.props.children}

        {toolBar === false ? null : <ToolBar />}
      </div>
    );
  }
}

export default DefaultLayout;
