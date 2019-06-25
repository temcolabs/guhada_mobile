import React from 'react';
import css from './FindIdMyInfo.module.scss';
import { LoginInput, LoginButton } from 'components/login';
export default function FindIdMyInfo({ form = () => {} }) {
  let value = form.get('value');
  return (
    <div>
      <div className={css.subHeader}>
        인증 받은 전화번호를 통해서 아이디를 찾을 수 있습니다.
        <br />
        아래정보를 입력해주세요.
      </div>
      <div className={css.findIdWrap}>
        <LoginInput field={form.$('name')} />
        <LoginInput field={form.$('mobile')} />
        <LoginButton
          className={!(value.name && value.mobile) ? 'isGray' : 'isColored'}
          onClick={form.onSubmit}
          disabled={!(value.name && value.mobile)}
        >
          아이디 찾기
        </LoginButton>
      </div>
    </div>
  );
}