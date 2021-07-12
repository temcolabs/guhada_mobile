import { memo } from 'react';
import PropTypes from 'prop-types';
import css from './MyPageMenus.module.scss';
import cn from 'classnames';

import { pushRoute } from 'lib/router';
import Image from 'components/atoms/Image';

const MENUS = [
  { id: 0, value: '취소・교환・반품', path: '/mypage/orders/claim/list' },
  { id: 1, value: '문의', path: '/mypage/claim' },
  { id: 2, value: '배송지 관리', path: '/mypage/address' },
  { id: 3, value: '회원정보 수정', path: '/mypage/me' },
];

const IMAGE_PATH = {
  arrowBtn: '/public/icon/btn-arrow.png',
};

function MyPageMenus() {
  return (
    <div className={cn(css.myPageMenus)}>
      {MENUS.map((o) => (
        <div
          key={`${o.id}-${o.value}`}
          className={cn(css.myPageMenuItem)}
          onClick={() => pushRoute(o.path)}
        >
          <div className={cn(css.title)}>{o.value}</div>
          <Image
            src={IMAGE_PATH.arrowBtn}
            width={'19px'}
            height={'19px'}
            size={'contain'}
          />
        </div>
      ))}
    </div>
  );
}

MyPageMenus.propTypes = {};

export default memo(MyPageMenus);
