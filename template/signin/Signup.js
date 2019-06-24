import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DefaultLayout from 'components/layout/DefaultLayout';
import css from './Signup.module.scss';
import {
  LoginInput,
  LoginButton,
  LoginCheckBox,
  LoginWrapper,
} from 'components/login/';

@observer
export class Signup extends Component {
  render() {
    const { form } = this.props;
    let value = form.get('value');

    return (
      <DefaultLayout pageTitle={'회원가입'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div>
              <LoginInput field={form.$('email')} />
              <LoginInput field={form.$('password')} />
              <LoginInput field={form.$('passwordConfirm')} />
            </div>
            <div className={css.bigCheckboxWrap}>
              <LoginCheckBox
                field={form.$('allagree_term')}
                big={true}
                className={'wrap'}
              />
            </div>
            <div className={css.borderBottom}>
              <LoginCheckBox
                field={form.$('requireAgree')}
                className={'wrap'}
              />
              <LoginCheckBox
                field={form.$('agreePurchaseTos')}
                className={'termOption'}
              />
              <LoginCheckBox
                field={form.$('agreeCollectPersonalInfoTos')}
                className={'termOption'}
              />
            </div>
            <div>
              <LoginCheckBox
                field={form.$('optionalAgree')}
                className={'wrap'}
              />
              <LoginCheckBox
                field={form.$('agreeSaleTos')}
                className={'termOption'}
              />
              <div>
                <LoginCheckBox
                  field={form.$('agreeEmailReception')}
                  className={'emailsms'}
                />
                <LoginCheckBox
                  field={form.$('agreeSmsReception')}
                  className={'emailsms'}
                />
              </div>
            </div>
            <div style={{ marginTop: '7px' }}>
              <LoginButton
                className={
                  !(
                    value.email &&
                    value.password &&
                    value.passwordConfirm &&
                    value.agreePurchaseTos &&
                    value.agreeCollectPersonalInfoTos
                  )
                    ? 'isGray'
                    : 'isColored'
                }
                onClick={form.onSubmit}
                disabled={
                  !(
                    value.email &&
                    value.password &&
                    value.passwordConfirm &&
                    value.agreePurchaseTos &&
                    value.agreeCollectPersonalInfoTos
                  )
                }
              >
                동의하고 가입하기
              </LoginButton>
            </div>
          </div>
        </LoginWrapper>
      </DefaultLayout>
    );
  }
}

export default Signup;
