import { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './OtherRequest.module.scss';

function OtherRequest({ orderpayment, request }) {
  return (
    <div className={css.wrap}>
      <div className={css.title}>기타 요청 사항</div>

      <div className={css.otherRequest}>
        <input
          type="text"
          placeholder="옵션이 필요한 상품의 경우, 사이즈, 색상을 기재"
          onChange={(e) => {
            orderpayment.addOtherRequest(e);
          }}
          value={request || ''}
        />
      </div>
    </div>
  );
}

export default inject('orderpayment')(OtherRequest);
