import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import Header from 'components/header/Header';
import ToolBar from 'components/toolbar/ToolBar';
import Router from 'next/router';
import { inject, observer } from 'mobx-react';
import memoize from 'memoize-one';
import openPopupCenter from 'childs/lib/common/openPopupCenter';

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
    toolBar: true,
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
      [topLayouts.category]: headerHeight + categorySize + searchTabSize,
      [topLayouts.brand]: headerHeight + searchTabSize,
      [topLayouts.search]: headerHeight + searchTabSize,
      [topLayouts.keyword]: headerHeight + searchTabSize,
    };
  }

  getWrapperStyle = memoize((style, toolBar, topLayout) => {
    return {
      paddingTop: `${this.paddingTopMap[topLayout]}px`,
      paddingBottom: toolBar ? '57px' : 0, // 하단 툴바가 있으면 툴바 높이만큼 간격을 추가해준다.
      ...style,
    };
  });

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
          ...this.getWrapperStyle(wrapperStyle, toolBar, topLayout),
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
        <div
          className={css.kakaoChat}
          onClick={() =>
            openPopupCenter(
              'https://pf.kakao.com/_yxolxbT/chat',
              '구하다 채팅하기',
              500,
              700
            )
          }
        />
        <div className={css.btnTop} onClick={() => window.scrollTo(0, 0)} />
      </div>
    );
  }
}

export default DefaultLayout;
