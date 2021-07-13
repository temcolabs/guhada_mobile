import { Component } from 'react';
import css from './FindIdMyInfo.module.scss';
import { LoginInput, LoginButton } from 'components/login';
import { observer } from 'mobx-react';

@observer
class FindIdMyInfo extends Component {
  render() {
    const { form } = this.props;
    let value = form.get('value');

    return (
      <div>
        <div className={css.subHeader}>
          본인인증한 휴대폰 번호로 아이디를 찾습니다.
        </div>
        <div className={css.findIdWrap}>
          <LoginInput field={form.$('name')} />
          <LoginInput field={form.$('mobile')} maxLength={13} />
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
}
export default FindIdMyInfo;
