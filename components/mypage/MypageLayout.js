import React from 'react';
import css from './MypageLayout.module.scss';
import cn from 'classnames';
import MypageMenubar from 'components/mypage/MypageMenubar';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { string, bool, object } from 'prop-types';
import Footer from 'components/footer/Footer';
import DefaultLayout from 'components/layout/DefaultLayout';
import memoize from 'memoize-one';

@withRouter
@inject('user')
@observer
class MypageLayout extends React.Component {
  static propTypes = {
    // defaultlayout props
    topLayout: string,
    pageTitle: string,
    headerShape: string,

    // MypageLayout props
    isMenuVisibile: bool, // 상단 메뉴바 표시 여부
    defaultLayoutStyle: object,
  };

  static defaultProps = {
    isMenuVisibile: true,
  };

  getDefaultLayoutStyle = memoize(style => {
    return {
      paddingBottom: 0, // NOTE: 마이페이지에서 하단 패딩은 없음.
      ...style,
    };
  });

  render() {
    const {
      isMenuVisibile,
      defaultLayoutStyle = {},
      wrapperStyle = {},
      ...rest
    } = this.props;

    return (
      <DefaultLayout
        toolbar
        wrapperStyle={this.getDefaultLayoutStyle(defaultLayoutStyle)}
        {...rest}
      >
        <div
          className={cn(css.wrap, {
            [css.isMenuVisible]: isMenuVisibile,
          })}
          style={wrapperStyle}
        >
          {isMenuVisibile && <MypageMenubar />}

          <div className={css.pageContents}>{this.props.children}</div>

          <div className={css.footerWrap}>
            <Footer />
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

export default MypageLayout;

export function MypageContentsWrap({ children }) {
  return <div className={css.mypageContentsWrap}>{children}</div>;
}
