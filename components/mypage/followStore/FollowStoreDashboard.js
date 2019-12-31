import React from 'react';
import css from './FollowStoreDashboard.module.scss';
import { inject, observer } from 'mobx-react';

@observer
class FollowStoreDashboard extends React.Component {
  render() {
    let { followListLength } = this.props;
    return <div className={css.wrap}>{`총 ${followListLength}개`}</div>;
  }
}

export default FollowStoreDashboard;
