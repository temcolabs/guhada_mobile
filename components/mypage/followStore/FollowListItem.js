import React, { Fragment } from 'react';
import css from './FollowListItem.module.scss';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
@inject('mypageFollow')
@observer
class FollowListItem extends React.Component {
  render() {
    let { mypageFollow, data } = this.props;
    return (
      <div className={css.wrap}>
        <Link href={`/store/${data.nickname}`}>
          {data.profileImageUrl ? (
            <div
              className={css.sellerImage}
              style={{ backgroundImage: `url(${data.profileImageUrl})` }}
            />
          ) : (
            <div className={css.nosellerImage}>
              {data.nickname ? data.nickname : ''}
            </div>
          )}
        </Link>
        <Link href={`/store/${data.nickname}`}>
          <div className={css.sellerName}>
            {data.nickname ? data.nickname : ''}
          </div>
        </Link>
        <div className={css.sellerGreeting}>
          {`${data.storeIntroduction ? data.storeIntroduction : data.nickname}`}
        </div>
        <div className={css.sellerInfo}>
          <div>
            <span className={css.sellerFollower}>{`팔로워 ${
              data.followerCount ? data.followerCount.toLocaleString() : '0'
            }`}</span>
            <span className={css.sellerProduct}>{`상품수 ${
              data.productCount ? data.productCount.toLocaleString() : '0'
            }`}</span>
          </div>
        </div>

        {data.status ? (
          <div
            className={css.unfollowButton}
            onClick={() => {
              mypageFollow.deleteSellerFollow(data.sellerId);
            }}
          >
            팔로잉
          </div>
        ) : (
          <div
            className={css.followButton}
            onClick={() => {
              mypageFollow.setSellerFollow(data.sellerId);
            }}
          >
            팔로우
          </div>
        )}
      </div>
    );
  }
}

export default FollowListItem;
