import { Component } from 'react';
import { observer } from 'mobx-react';
import LoginLayout from 'components/layout/LoginLayout';
import css from './Signup.module.scss';
import {
  LoginInput,
  LoginButton,
  LoginCheckBox,
  LoginWrapper,
} from 'components/login/';
import cn from 'classnames';

@observer
class Signup extends Component {
  state = {
    optionalAgree: false,
    currentType: 'password',
  };

  handleOptionalAgree = () => {
    this.setState({ optionalAgree: true });
  };

  typeChangeHandle = () => {
    if (this.state.currentType === 'password') {
      this.setState({
        currentType: 'text',
      });
    } else {
      this.setState({
        currentType: 'password',
      });
    }
  };

  render() {
    const { form, termAgree } = this.props;
    let value = form.get('value');
    let termAgreeValue = termAgree.get('value');
    return (
      <LoginLayout back pageTitle={'회원가입'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div>
              <LoginInput
                field={form.$('email')}
                check={form.$('emailCheck')}
                successMessage={'사용 가능한 이메일입니다.'}
              />
              <LoginInput
                field={form.$('password')}
                type={this.state.currentType}
                typeChangeHandle={this.typeChangeHandle}
              />
              <LoginInput field={form.$('passwordConfirm')} />
            </div>
            <div className={css.bigCheckboxWrap}>
              <LoginCheckBox
                field={termAgree.$('allagree_term')}
                big={true}
                className={'wrap'}
              />
            </div>
            <div className={css.borderBottom}>
              <LoginCheckBox
                field={termAgree.$('requireAgree')}
                className={'wrap'}
              />
              <LoginCheckBox
                field={termAgree.$('agreePurchaseTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/purchase`}
              />
              <LoginCheckBox
                field={termAgree.$('agreeCollectPersonalInfoTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/personal`}
              />
            </div>
            <div
              className={cn(css.optionalAgree, {
                [css.openOptional]: this.state.optionalAgree === true,
              })}
              onClick={() => this.handleOptionalAgree()}
            >
              <LoginCheckBox
                field={termAgree.$('optionalAgree')}
                className={'wrap'}
              />
              <div
                style={
                  this.state.optionalAgree === false
                    ? { display: 'none' }
                    : { display: 'block' }
                }
              >
                <LoginCheckBox
                  field={termAgree.$('agreeSaleTos')}
                  className={'termOption'}
                  href={`${process.env.HOSTNAME}/terms/sale`}
                />
                <div>
                  <LoginCheckBox
                    field={termAgree.$('agreeEmailReception')}
                    className={'emailsms'}
                  />
                  <LoginCheckBox
                    field={termAgree.$('agreeSmsReception')}
                    className={'emailsms'}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '7px' }}>
              <LoginButton
                className={
                  !(
                    value.email &&
                    value.password &&
                    value.passwordConfirm &&
                    termAgreeValue.agreePurchaseTos &&
                    termAgreeValue.agreeCollectPersonalInfoTos
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
                    termAgreeValue.agreePurchaseTos &&
                    termAgreeValue.agreeCollectPersonalInfoTos
                  )
                }
              >
                동의하고 가입하기
              </LoginButton>
            </div>
          </div>
        </LoginWrapper>
      </LoginLayout>
    );
  }
}

export default Signup;
