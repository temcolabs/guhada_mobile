import React from 'react';
import css from './EmptyListNoti.module.scss';
import Centering from 'components/common/Centering';

/**
 * 기간 선택해서 리스트 결과가 없을 때 표시하는 컴포넌트
 *
 * 디자인 참조
 * zpl://screen?pid=5ca71f1be141ada0c0df7152&sid=5cf4998716309e0a5cbfca05
 */
export default function EmptyListNoti({ message = '결과가 없습니다' }) {
  return (
    <div className={css.wrap}>
      <Centering mode="flex" className={css.mode}>
        <img
          className={css.noDataIcon}
          src="/static/icon/mypage/icon-no-data@3x.png"
          alt=""
        />
        {message}
      </Centering>
    </div>
  );
}
