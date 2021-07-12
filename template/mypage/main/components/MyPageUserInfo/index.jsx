import { memo } from 'react';
import PropTypes from 'prop-types';
import css from './MyPageUserInfo.module.scss';
import cn from 'classnames';

import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  profileNon: '/public/icon/community/profile-non@2x.png',
};

/**
 * 마이페이지 > 상단 사용자 정보
 * @param {Object} user, userStore.userInfo
 * @returns
 */
function MyPageUserInfo({ user }) {
  return (
    <div className={cn(css.myPageUserInfo)}>
      <div className={cn(css.avatar)}>
        {user.profileImageUrl ? (
          <Image
            src={user.profileImageUrl}
            customStyle={{ borderRadius: '50%' }}
          />
        ) : (
          <Image src={IMAGE_PATH.profileNon} />
        )}
      </div>
      <div className={cn(css.userInfo)}>
        <div className={cn(css.userEmail)}>{user.email}</div>
        {/* TODO : 등급 혜택 보기 */}
        {/* <div className={cn(css.userGrade)} /> */}
      </div>
    </div>
  );
}

MyPageUserInfo.propTypes = {
  user: PropTypes.object.isRequired,
};

export default memo(MyPageUserInfo);
