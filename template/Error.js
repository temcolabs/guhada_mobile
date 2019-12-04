import React from 'react';
import css from './Error.module.scss';
import { pushRoute } from 'childs/lib/router';

export default function Error() {
  return (
    <div className={css.wrap}>
      <div className={css.errorImg} />
      <div className={css.header}>
        고객님이 요청하신 페이지를
        <br />
        찾을 수 없습니다
      </div>
      <div className={css.contents}>
        주소가 잘못 입력되었거나 수정, 삭제되어 요청하신 페이지를 찾을 수
        없습니다. 입력하신 주소가 정확한지 다시 한 번 확인해 주세요.
      </div>
      <button onClick={() => pushRoute('/')}>메인으로 이동</button>
    </div>
  );
}
