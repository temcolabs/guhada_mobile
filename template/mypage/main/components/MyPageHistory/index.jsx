import { memo } from 'react';
import css from './MyPageHistory.module.scss';
import cn from 'classnames';

import { pushRoute } from 'lib/router';
import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  followStore: '/public/icon/followstore_icon.png',
  like: '/public/icon/like_icon.png',
  review: '/public/icon/review_icon.png',
};

const MyPageHistoryList = [
  {
    id: 0,
    imageUrl: IMAGE_PATH.review,
    value: '나의리뷰',
    path: '/mypage/review',
  },
  {
    id: 1,
    imageUrl: IMAGE_PATH.followStore,
    value: '팔로우한 스토어',
    path: '/mypage/follows',
  },
  {
    id: 2,
    imageUrl: IMAGE_PATH.like,
    value: '찜한상품',
    path: '/mypage/likes',
  },
];

function MyPageHistory() {
  return (
    <div className={cn(css.myPageHistory)}>
      {MyPageHistoryList.map(({ id, imageUrl, value, path }) => (
        <div
          key={id}
          className={cn(css.myPageHistoryItem)}
          onClick={() => pushRoute(path)}
        >
          <div className={cn(css.myPageHistoryItem__icon)}>
            <Image
              src={imageUrl}
              width={'25px'}
              height={'25px'}
              size={'contain'}
            />
          </div>
          <div className={cn(css.myPageHistoryItem__desc)}>{value}</div>
        </div>
      ))}
    </div>
  );
}

MyPageHistory.propTypes = {};

export default memo(MyPageHistory);
