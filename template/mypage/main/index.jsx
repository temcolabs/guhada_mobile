import css from './MyPage.module.scss';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import cn from 'classnames';

import {
  MyPageUserInfo,
  MyPageMembership,
  MyPageOrder,
  MyPageHistory,
  MyPageMenus,
} from './components';

function MyPageTemplate() {
  const { mypageDashboard, orderCompleteList, user } = useStores();

  return (
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
  );
}

MyPageTemplate.propTypes = {};

export default observer(MyPageTemplate);
