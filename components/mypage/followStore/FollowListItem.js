import React, { Fragment } from 'react';
import css from './FollowListItem.module.scss';
import { inject, observer } from 'mobx-react';

import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  new: '/static/icon/community/icon-new-red.png',
};
@inject('mypageFollow', 'seller')
@observer
class FollowListItem extends React.Component {
  render() {
    let { mypageFollow, data, seller } = this.props;
    return (
      <div className={css.wrap}>
        {/* <Link href={`/store/${data.nickname}`}> */}
        {/* 프로필 이미지 */}
        {data.profileImageUrl ? (
          <div
            className={css.sellerImage}
            style={{ backgroundImage: `url(${data.profileImageUrl})` }}
            onClick={() => seller.toSearch({ nickname: data.nickname })}
          />
        ) : (
          <div
            className={css.nosellerImage}
            onClick={() => seller.toSearch({ nickname: data.nickname })}
          >
            {data.nickname ? data.nickname : ''}
          </div>
        )}

        {/* 셀러 정보 */}
        <div className={css.sellerInfoSection}>
          {/* 셀러스토어 이름 */}
          <div className={css.sellerGreeting}>
            <span className={css.sellerName}>
              {`${
                data.storeIntroduction ? data.storeIntroduction : data.nickname
              }`}
            </span>
            {data.recentlyRegisteredProductCount !== 0 && (
              <span className={css.sellerRecently}>
                <Image src={IMAGE_PATH.new} />
              </span>
            )}
          </div>
          {/* 팔로워, 상품수 */}
          <div className={css.sellerInfo}>
            <div>
              <span className={css.sellerFollower}>{`팔로워 ${
                data.followerCount ? data.followerCount.toLocaleString() : '0'
              }`}</span>
              <span className={css.sellerDivider}>|</span>
              <span className={css.sellerProduct}>{`상품수 ${
                data.productCount ? data.productCount.toLocaleString() : '0'
              }`}</span>
            </div>
          </div>
        </div>

        {/* 팔로잉 / 팔로우 버튼 */}
        <div className={css.followSection}>
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
        {/* </Link> */}
        {/* <Link href={`/store/${data.nickname}`}> */}
        {/* <div
          className={css.sellerName}
          onClick={() => seller.toSearch({ nickname: data.nickname })}
        >
          {data.nickname ? data.nickname : ''}
        </div> */}
        {/* </Link> */}
        {/* <div className={css.sellerGreeting}>
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
        )} */}
      </div>
    );
  }
}

export default FollowListItem;
