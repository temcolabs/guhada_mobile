import React, { Component } from 'react';
import LoginLayout from 'components/layout/LoginLayout';
import { LoginWrapper, LoginRadio } from 'components/login';
import css from './FindId.module.scss';
import FindLoginInfoHeader from 'components/login/FindLoginInfoHeader';
import FindPasswordMobile from 'components/login/findpassword/FindPasswordMobile';
import { observer, inject } from 'mobx-react';
import FindPasswordEmail from 'components/login/findpassword/FindPasswordEmail';
import FindMobileAuthPassword from 'components/login/FindMobileAuthPassword';
/**
 * formEmail, formMobile
 */
@inject('authmobile')
@observer
export class FindPassword extends Component {
  state = {
    radioChecked: 'findMobile',
  };

  onChangeRadio = value => {
    const { formEmail, formMobile } = this.props;

    formEmail.update({
      name: '',
      email: '',
      verificationNumber: '',
    });
    formMobile.update({
      name: '',
      email: '',
      mobile: '',
      verificationNumber: '',
    });

    this.setState({
      radioChecked: value,
    });
  };

  render() {
    const { formEmail, formMobile, authmobile } = this.props;

    return (
      <LoginLayout pageTitle={'아이디/비밀번호 찾기'}>
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
              <FindMobileAuthPassword authmobile={authmobile} />
            ) : null}
          </div>
          <form name="form_chk" method="post" style={{ display: 'none' }}>
            <input type="hidden" name="m" value="checkplusSerivce" />
            <input type="hidden" name="EncodeData" value={authmobile.authKey} />
          </form>
        </LoginWrapper>
      </LoginLayout>
    );
  }
}

export default FindPassword;
