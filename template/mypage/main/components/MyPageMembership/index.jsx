import { memo } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import css from './MyPageMembership.module.scss';
import cn from 'classnames';

import { pushRoute } from 'lib/router';
import addCommaToNum from 'lib/common/addCommaToNum';

/**
 * 마이페이지 > 쿠폰, 포인트, 토큰
 * @param {Object} mypageDashboard, mypageDashboardStore.data
 * @returns
 */
function MyPageMembership({
  mypageDashboard = {
    couponCount: 0,
    point: 0,
    token: 0,
  },
}) {
  const handleMembershipTab = (key) => {
    if (key === 'couponCount') pushRoute('/mypage/coupon');
    else if (key === 'point') pushRoute('/mypage/point');
    // else if (key === 'token')pushRoute('/mypage/coupon')
  };

  return (
    <div className={cn(css.myPageMembership)}>
      {Object.keys(mypageDashboard).map(
        (key) =>
          key !== 'deliveryCount' && (
            <div
              key={key}
              className={cn(css.memberShipItem)}
              onClick={() => handleMembershipTab(key)}
            >
              <div className={cn(css.counts)}>
                {key === 'couponCount' && mypageDashboard[key] + ' 개'}
                {key === 'point' && addCommaToNum(mypageDashboard[key] + 'P')}
                {key === 'token' && '-'}
              </div>
              <div className={cn(css.description)}>
                {key === 'couponCount' && '쿠폰'}
                {key === 'point' && '포인트'}
                {key === 'token' && '토큰'}
              </div>
            </div>
          )
      )}
    </div>
  );
}

MyPageMembership.propTypes = {
  mypageDashboard: PropTypes.object.isRequired,
};

export default memo(observer(MyPageMembership));
