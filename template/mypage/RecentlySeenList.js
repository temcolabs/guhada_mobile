import { withRouter } from 'next/router';
import { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';
import { inject, observer } from 'mobx-react';
import css from './RecentlySeenList.module.scss';
import MypageRecentlySeenDashboard from '../../components/mypage/recentlySeen/MypageRecentlySeenDashboard';
import MypageRecentlySeenItem from '../../components/mypage/recentlySeen/MypageRecentlySeenItem';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';

@withRouter
@inject('mypageRecentlySeen')
@observer
class RecentlySeenList extends Component {
  componentDidMount() {
    this.props.mypageRecentlySeen.init();
  }

  render() {
    let { mypageRecentlySeen } = this.props;

    return (
      <MypageLayout topLayout={'main'} headerShape={'mypage'}>
        {/* 최근 본 상품 대시 보드 */}
        <MypageRecentlySeenDashboard />

        {mypageRecentlySeen.list.length ? (
          <div className={css.list__wrap}>
            {mypageRecentlySeen.list.map((data, index) => {
              return <MypageRecentlySeenItem data={data} key={index} />;
            })}
          </div>
        ) : (
          <MypageDataEmpty text="최근 본 상품이 없습니다." />
        )}
      </MypageLayout>
    );
  }
}

export default RecentlySeenList;
