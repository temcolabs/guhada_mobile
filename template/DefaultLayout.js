import React, { Component } from 'react';
import css from './HeaderFooter.module.scss';
import { Header, Footer, HeaderCategory } from '../components/organisms';
import PropTypes from 'prop-types';
import cn from 'classnames';

/**
 * 헤더, 푸터, 상품 카테고리를 포함한 메인 레이아웃
 *
 * 카테고리를 표시하지 않으려면 isCateogryNavVisible 값을 전달한다.
 */
export default class HeaderFooter extends Component {
  static propTypes = {
    isCateogryNavVisible: PropTypes.bool, // 좌측에 카테고리 네비게이션 숨김 여부
  };

  static defaultProps = {
    isCateogryNavVisible: true,
  };

  render() {
    const { isCateogryNavVisible } = this.props;
    return (
      <>
        <Header />
        <div
          className={cn(css.contentsWrapper, {
            [css.withPaddingLeft]: !isCateogryNavVisible,
          })}
        >
          {isCateogryNavVisible && (
            <div className={css.categoryNav}>
              <HeaderCategory />
            </div>
          )}
          <div
            className={cn(css.itemsWrapper, {
              [css.widthFull]: !isCateogryNavVisible,
            })}
          >
            <div className={css.mainContents}>{this.props.children}</div>
          </div>
          <div
            className={cn(css.footerWrapper, {
              [css.withBorderLeft]: isCateogryNavVisible,
            })}
          >
            <Footer isCateogryNavVisible={isCateogryNavVisible} />
          </div>
        </div>
      </>
    );
  }
}
