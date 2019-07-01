import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { LoginWrapper, LoginRadio } from 'components/login';
import css from './FindId.module.scss';
import FindLoginInfoHeader from 'components/login/FindLoginInfoHeader';
import FindPasswordMobile from 'components/login/findpassword/FindPasswordMobile';
import { observer } from 'mobx-react';
import FindPasswordEmail from 'components/login/findpassword/FindPasswordEmail';
import FindMobileAuthPassword from 'components/login/FindMobileAuthPassword';
/**
 * formEmail, formMobile
 */
@observer
export class FindPassword extends Component {
  state = {
    radioChecked: 'findMobile',
  };

  onChangeRadio = value => {
    this.setState({
      radioChecked: value,
    });
  };

  render() {
    const { formEmail, formMobile } = this.props;
    // let valueEmail = formEmail.get('value');

    return (
      <DefaultLayout pageTitle={'아이디/비밀번호 찾기'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <FindLoginInfoHeader select={'FindPassword'} />
          </div>
          <div className={css.radioWrap}>
            <LoginRadio
              field={formEmail.$('findPassword')}
              label={'휴대폰 번호로 재설정하기'}
              value={'findMobile'}
              checked={this.state.radioChecked}
              onChangeRadio={this.onChangeRadio}
            />
            {this.state.radioChecked === 'findMobile' ? (
              <FindPasswordMobile form={formMobile} />
            ) : null}
          </div>
          <div className={css.radioWrap}>
            <LoginRadio
              field={formEmail.$('findPassword')}
              label={'이메일로 재설정하기'}
              value={'findEmail'}
              checked={this.state.radioChecked}
              onChangeRadio={this.onChangeRadio}
            />
            {this.state.radioChecked === 'findEmail' ? (
              <FindPasswordEmail form={formEmail} />
            ) : null}
          </div>
          <div className={css.radioWrap}>
            <LoginRadio
              field={formEmail.$('findPassword')}
              label={'휴대폰 본인인증으로 재설정하기'}
              value={'findAuth'}
              checked={this.state.radioChecked}
              onChangeRadio={this.onChangeRadio}
            />
            {this.state.radioChecked === 'findAuth' ? (
              <FindMobileAuthPassword />
            ) : null}
          </div>
        </LoginWrapper>
      </DefaultLayout>
    );
  }
}

export default FindPassword;
