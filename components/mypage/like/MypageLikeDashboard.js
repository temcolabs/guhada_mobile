import React from 'react';
import css from './MypageLikeDashboard.module.scss';
import { inject, observer } from 'mobx-react';
import MypageLikeSortSelect from './MypageLikeSortSelect';

@inject('mypageLike')
@observer
class MypageLikeDashboard extends React.Component {
  render() {
    let { mypageLike } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.total}>
          총 <span>{mypageLike.totalItemsCount}</span>개
        </div>
        <div
          className={css.total__delete}
          onClick={e => {
            e.stopPropagation();
            mypageLike.totalDelete();
          }}
        >
          전체 삭제
        </div>
      </div>
    );
  }
}

export default MypageLikeDashboard;
