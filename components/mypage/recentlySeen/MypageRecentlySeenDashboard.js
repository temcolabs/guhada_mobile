import { Component } from 'react';
import css from './MypageRecentlySeenDashboard.module.scss';
import { inject, observer } from 'mobx-react';

@inject('mypageRecentlySeen')
@observer
class MypageRecentlySeenDashboard extends Component {
  render() {
    let { mypageRecentlySeen } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.total}>
          총 <span>{mypageRecentlySeen.totalItemsCount}</span>개
        </div>

        <div
          className={css.total__delete}
          onClick={(e) => {
            e.stopPropagation();
            mypageRecentlySeen.removeItemAll();
          }}
        >
          전체 삭제
        </div>
      </div>
    );
  }
}

export default MypageRecentlySeenDashboard;
