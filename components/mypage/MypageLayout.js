import React from 'react';
import css from './MyPageLayout.module.scss';
import MypageMenubar from 'components/mypage/MypageMenubar';
import { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';

@inject('user')
@observer
class MyPageLayout extends React.Component {
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

export default withRouter(MyPageLayout);
