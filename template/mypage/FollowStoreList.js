import React, { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';
import FollowStoreDashboard from 'components/mypage/followStore/FollowStoreDashboard';
import FollowListItem from 'components/mypage/followStore/FollowListItem';
import { isBrowser } from 'childs/lib/common/isServer';
import { inject, observer } from 'mobx-react';
import css from './FollowStoreList.module.scss';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';

@inject('mypageFollow')
@observer
class FollowStoreList extends Component {
  componentDidMount() {
    if (isBrowser) {
      this.props.mypageFollow.getFollowList({
        pageNo: 1,
      });
    }
  }

  render() {
    const { mypageFollow } = this.props;

    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'팔로우한 스토어'}
        headerShape={'mypageDetail'}
      >
        {/* 팔로우 스토어 총 개수 */}
        <FollowStoreDashboard
          followListLength={mypageFollow?.followList?.length}
        />

        <div className={css.followList}>
          {mypageFollow.followList.length > 0 ? (
            mypageFollow.followList.map((data, index) => {
              return <FollowListItem key={index} data={data} index={index} />;
            })
          ) : (
            <MypageDataEmpty text={`팔로우한 스토어가 없습니다.`} />
          )}
        </div>
      </MypageLayout>
    );
  }
}

export default FollowStoreList;
