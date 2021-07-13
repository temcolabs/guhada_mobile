import { Component } from 'react';
import css from './MypageLayout.module.scss';
import cn from 'classnames';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { string, bool, object } from 'prop-types';
import Footer from 'components/footer/Footer';
import DefaultLayout from 'components/layout/DefaultLayout';

@withRouter
@inject('user')
@observer
class MypageLayout extends Component {
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
    pageTitle: '마이페이지',
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {
      isMenuVisibile,
      defaultLayoutStyle = {},
      wrapperStyle = {},
      ...rest
    } = this.props;

    return (
      <DefaultLayout toolBar wrapperStyle={defaultLayoutStyle} {...rest}>
        <div className={cn(css.wrap)} style={wrapperStyle}>
          <div className={css.pageContents}>{this.props.children}</div>

          <Footer />
        </div>
      </DefaultLayout>
    );
  }
}

export default MypageLayout;

export function MypageContentsWrap({ children }) {
  return <div className={css.mypageContentsWrap}>{children}</div>;
}
