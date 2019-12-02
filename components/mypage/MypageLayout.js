import React from 'react';
import css from './MypageLayout.module.scss';
import cn from 'classnames';
import MypageMenubar from 'components/mypage/MypageMenubar';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

@withRouter
@inject('user')
@observer
class MypageLayout extends React.Component {
  static propTypes = {
    isMenuVisibile: PropTypes.bool, // 상단 메뉴바 표시 여부
  };

  static defaultProps = {
    isMenuVisibile: true,
    router: {},
  };

  render() {
    const { isMenuVisibile } = this.props;
    return (
      <div
        className={cn(css.wrap, {
          [css.isMenuVisible]: isMenuVisibile,
        })}
      >
        {isMenuVisibile && <MypageMenubar />}

        <div className={css.pageContents}>{this.props.children}</div>
      </div>
    );
  }
}

export default MypageLayout;
