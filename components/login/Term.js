import React, { Component } from 'react';
import LoginLayout from 'components/layout/LoginLayout';
import { LoginWrapper, LoginCheckBox } from '.';
import css from './Term.module.scss';
import LoginButton from './LoginButton';
import { observer } from 'mobx-react';

@observer
class Term extends Component {
  render() {
    const { form } = this.props;
    let value = form.get('value');
    return (
      <LoginLayout pageTitle={'약관동의'}>
        <LoginWrapper>
          <div className={css.wrap}>
            <div className={css.subText}>
              구하다 구매 이용약관과 개인정보 수집 및 이용에
              <br />
              동의를 하셔야 회원가입이 가능합니다.
            </div>
            <div className={css.contentsWrap}>
              <LoginCheckBox
                big={true}
                field={form.$('allagree_term')}
                className={'wrap'}
              />
            </div>
            <div className={css.contentsWrap}>
              <LoginCheckBox
                field={form.$('requireAgree')}
                className={'wrap'}
              />
              <LoginCheckBox
                field={form.$('agreePurchaseTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/purchase`}
              />
              <LoginCheckBox
                field={form.$('agreeCollectPersonalInfoTos')}
                className={'termOption'}
                href={`${process.env.HOSTNAME}/terms/personal`}
              />
            </div>
            <div className={css.contentsWrap}>
              <LoginCheckBox
                field={form.$('optionalAgree')}
                className={'wrap'}
              />
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
            <div className={css.eventText}>
              ※ 할인, 이벤트 등 다양한 정보를 받아보실 수 있습니다.
              <br />
              (단, 결제/교환/환불 등 관련된 내용은 거래안전을 위하여 수신동의
              여부와 관계없이 발송됩니다.
              <br />※ 선택 항목에 동의하지 않으셔도 구하다 서비스 이용이
              가능합니다. 가입은 14세 이상만 가능합니다.
            </div>
            <LoginButton
              className={
                !(value.agreePurchaseTos && value.agreeCollectPersonalInfoTos)
                  ? 'isGray'
                  : 'isColored'
              }
              onClick={form.onSubmit}
              disabled={
                !(value.agreePurchaseTos && value.agreeCollectPersonalInfoTos)
              }
            >
              동의하고 가입하기
            </LoginButton>
          </div>
        </LoginWrapper>
      </LoginLayout>
    );
  }
}

export default Term;
