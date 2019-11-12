import React, { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import Form from 'stores/form-store/_.forms';
import css from './LuckydrawModify.module.scss';
import { LoginInput, LoginCheckBox, LoginButton } from 'components/login';
import cn from 'classnames';

export class LuckydrawModify extends Component {
  state = {
    optionalAgree: false,
  };

  handleOptionalAgree = () => {
    this.setState({ optionalAgree: true });
  };

  render() {
    const form = Form.modifyLuckydraw;
    let value = form.get('value');
    const { isOpen, onClose } = this.props;

    return (
      <ModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        contentLabel={'LuckydrawSignup'}
        zIndex={1000}
      >
        <div className={css.loginWrap}>
          <div className={css.headerWrap}>
            <div className={css.emptyButton} />
            회원정보수정
            <div className={css.closeButton} onClick={() => onClose()} />
          </div>
          <div className={css.wrap}>
            <div>
              <LoginInput field={form.$('email')} />
              <div>
                <LoginInput field={form.$('name')} disabled />
                <LoginInput field={form.$('name')} />
              </div>
            </div>
            <div className={css.bigCheckboxWrap}>
              <LoginCheckBox
                field={form.$('optionalAgree')}
                big={true}
                className={'wrap'}
              />
            </div>

            <div className={css.borderBottom}>
              <LoginCheckBox
                field={form.$('agreeSaleTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/sale`}
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

            <div className={css.eventTextWarp}>
              <div className={css.eventText}>
                ※ 할인, 이벤트 등 다양한 정보를 받아보실 수 있습니다.
              </div>
              <div className={css.eventText}>
                ※ 결제/교환/환불 등 관련된 내용은 거래안 을 위하여 수신동의
                여부와 관계없이 발송됩니다. 선택 항목에 동의하지 않으셔도 구하다
                서비스 이용 가능합니다.
              </div>
              <div className={css.eventText}>
                ※ 14세 이상만 가입 가능합니다.
              </div>
            </div>
            <div>
              <LoginButton
                className={
                  !(
                    value.email &&
                    value.password &&
                    value.passwordConfirm &&
                    value.agreeSaleTos &&
                    value.agreeEmailReception &&
                    value.agreeSmsReception
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
                    value.agreeSaleTos &&
                    value.agreeEmailReception &&
                    value.agreeSmsReception
                  )
                }
              >
                동의하고 가입하기
              </LoginButton>
            </div>
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

export default LuckydrawModify;
