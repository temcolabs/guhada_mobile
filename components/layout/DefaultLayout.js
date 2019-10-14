import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import Header from 'components/header/Header';
import ToolBar from 'components/toolbar/ToolBar';
import Footer from 'components/footer/Footer';
import { inject, observer } from 'mobx-react';
/**
 * DefaultLayout
 * 하단 ToolBar를 없애기 위해서는 toolBar props를 false로
 * 보내면 툴바 표현하지 않음
 *
 * headerShape 값에 따른 Header component 변경을 위해서 headerShape props 추가
 * @param {String} topLayout 페이지 레이아웃 형태에 따라서 사용된다. main, category, search 3가지 형태를 정의해두었다.
 * @param {String} pageTitle
 */

@inject('shoppingcart', 'login')
@observer
class DefaultLayout extends Component {
  componentDidMount() {
    if (this.props.login.loginStatus === 'LOGIN_DONE') {
      this.props.shoppingcart.globalGetUserShoppingCartList();
    }
  }
  componentWillUnmount() {
    if (this.props.login.loginStatus === 'LOGIN_DONE') {
      this.props.shoppingcart.globalGetUserShoppingCartList();
    }
  }
  render() {
    const {
      pageTitle,
      toolBar,
      headerShape,
      topLayout,
      shoppingcart,
    } = this.props;
    const headerSize = 60;
    const categorySize = 44;
    const searchTabSize = 56;

    let cartAmount = shoppingcart.cartAmount;

    let paddingTop;
    if (topLayout === 'main') {
      paddingTop = headerSize;
    } else if (topLayout === 'category') {
      paddingTop = headerSize + categorySize;
    } else if (topLayout === 'search') {
      paddingTop = headerSize + categorySize + searchTabSize;
    } else if (topLayout === 'keyword') {
      paddingTop = headerSize + searchTabSize;
    }

    return (
      <div className={css.wrap} style={{ paddingTop: `${paddingTop}px` }}>
        {topLayout === 'keyword' ? null : (
          <Header headerShape={headerShape} cartAmount={cartAmount}>
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
