import { useEffect, memo } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import css from './MyPage.module.scss';
import cn from 'classnames';
import MypageLayout from 'components/mypage/MypageLayout';

import {
  MyPageUserInfo,
  MyPageMembership,
  MyPageOrder,
  MyPageHistory,
  MyPageMenus,
} from './components';

function MyPageTemplate() {
  const { mypageDashboard, orderCompleteList, user } = useStores();

  useEffect(() => {
    mypageDashboard.getDashboard(); // 쿠폰, 포인트, 토큰
    orderCompleteList.getMyOrderStatus(); // 주문 배송
    return () => {
      mypageDashboard.resetData();
    };
  }, []);

  return (
    <MypageLayout topLayout={'main'} headerShape={'mypage'} kakaoChat={false}>
      <div className={cn(css.myPageWrapper)}>
        {/* 유저 정보 */}
        <MyPageUserInfo user={user.userInfo} />

        {/* 멤버십 정보 */}
        <MyPageMembership mypageDashboard={mypageDashboard.data} />

        {/* 주문 배송 */}
        <MyPageOrder myOrderStatus={orderCompleteList.myOrderStatus} />

        {/* 구분선 */}
        <div className={cn(css.divider)} />

        {/* 리뷰, 팔로우한 스토어, 찜한상품 */}
        <MyPageHistory />

        {/* 메뉴 */}
        <MyPageMenus />
      </div>
    </MypageLayout>
  );
}

MyPageTemplate.propTypes = {};

export default memo(observer(MyPageTemplate));
