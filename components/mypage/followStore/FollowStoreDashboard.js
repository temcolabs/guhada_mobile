import { Component } from 'react';
import css from './FollowStoreDashboard.module.scss';
import { observer } from 'mobx-react';

@observer
class FollowStoreDashboard extends Component {
  render() {
    let { followListLength } = this.props;
    return <div className={css.wrap}>{`총 ${followListLength}개`}</div>;
  }
}

export default FollowStoreDashboard;
