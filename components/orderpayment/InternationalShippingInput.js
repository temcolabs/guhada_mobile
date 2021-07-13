import { inject } from 'mobx-react';
import css from './InternationalShippingInput.module.scss';

function InternationalShippingInput({ orderpayment, request }) {
  return (
    <div className={css.wrap}>
      <div className={css.top}>
        <div className={css.title}>해외배송상품 추가 정보</div>
        <div
          className={css.link}
          onClick={() => {
            window.open(
              'https://unipass.customs.go.kr/csp/persIndex.do',
              '_blank'
            );
          }}
        >
          발급 안내
        </div>
      </div>
      <div className={css.otherRequest}>
        <input
          type="text"
          placeholder="P로 시작하는 개인통관 고유부호를 입력해주세요."
          onChange={(event) => {
            orderpayment.customIdNumberChangeHandler(event.target.value);
          }}
        />
      </div>
      <div className={css.bottom}>
        <input
          className={css.checkbox}
          type="checkbox"
          onChange={(event) => {
            orderpayment.customIdNumberAgreeChangeHandler(event.target.checked);
          }}
        />
        <label>[필수] 개인통관 고유부호 수집 및 셀러 제공 동의</label>
      </div>
    </div>
  );
}

export default inject('orderpayment')(InternationalShippingInput);
