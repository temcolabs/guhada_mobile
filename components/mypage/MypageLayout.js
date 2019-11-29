import React from 'react';
import css from './MypageLayout.module.scss';
import MypageMenubar from 'components/mypage/MypageMenubar';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';

@inject('user')
@observer
class MypageLayout extends React.Component {
  static defaultProps = {
    router: {},
  };

  render() {
    const { user } = this.props;
    return (
      <div className={css.wrap}>
        <MypageMenubar />
        <div className={css.pageContents}>{this.props.children}</div>
      </div>
    );
  }
}

/**
 * 좌우 패딩을 준 컨텐츠 박스
 */
export const MypageContentsWrap = ({ children, wrapperStyle = {} }) => {
  return (
    <div className={css.mypageContentsWrap} style={wrapperStyle}>
      {children}
    </div>
  );
};

export default withRouter(MypageLayout);
