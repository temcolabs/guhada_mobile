import { Component } from 'react';
import { object } from 'prop-types';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import { observer, inject } from 'mobx-react';
import Text from 'components/mypage/form/Text';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import SectionHeading from 'components/common/SectionHeading';
import EmailVerifyForm from './EmailVerifyForm';
import NicknameForm from './NicknameForm';
import MobileAuthForm from './MobileAuthForm';
import NewPasswordForm from './NewPasswordForm';
import ConnectedSNSForm from './ConnectedSNSForm';
import NotificationAgreementForm from './NotificationAgreementForm';
import RefundBankAccountForm from 'components/mypage/userinfo/form/RefundBankAccountForm';
import AdditionalInfoForm from 'components/mypage/userinfo/form/AdditionalInfoForm';
import WithdrawalForm from 'components/mypage/userinfo/form/WithdrawalForm';
import ShippingAddressForm from 'components/mypage/userinfo/form/ShippingAddressForm';
import FormErrors from './FormErrors';
import css from './UserEditForm.module.scss';
import ProfileImageForm from './ProfileImageForm';

@inject('user', 'alert')
@observer
class UserEditForm extends Component {
  static propTypes = {
    userInfo: object, // 원본 데이터
  };

  render() {
    return (
      <UserEditFormContext.Consumer>
        {({ fields, values, formApi, initialValues }) => (
          <div>
            {/* 웹 브라우저의 비밀번호 자동완성 방지 (autoComplete and autofill) */}
            <input type="text" name="hidden" style={{ display: 'none' }} />
            <input type="password" name="hidden" style={{ display: 'none' }} />
            <SectionHeading title="회원정보" wrapperStyle={{ marginTop: 0 }} />
            <KeyValueTable>
              <tr>
                <td>
                  <ProfileImageForm />
                </td>
              </tr>
              <tr>
                <th>이름</th>
              </tr>
              <tr>
                <td>
                  {!!values[fields.name] ? (
                    <Text hasBorder>{values[fields.name]}</Text>
                  ) : (
                    <Text>(휴대폰 본인 인증이 필요합니다)</Text>
                  )}
                </td>
              </tr>

              {/* 닉네임 */}
              <tr>
                <th>닉네임</th>
              </tr>
              <tr>
                <td>
                  <NicknameForm />
                </td>
              </tr>

              {/* 아이디 */}
              <tr>
                <th>아이디(이메일)</th>
              </tr>
              <tr>
                <td>
                  <EmailVerifyForm />
                </td>
              </tr>

              {/* 휴대폰 번호 */}
              <tr>
                <th>휴대폰 번호</th>
              </tr>
              <tr>
                <td>
                  <MobileAuthForm />
                </td>
              </tr>

              {/* 비밀번호 */}
              <tr>
                <th>비밀번호</th>
              </tr>
              <tr>
                <td>
                  <NewPasswordForm />
                </td>
              </tr>

              <tr>
                <th>연결된 계정</th>
              </tr>
              <tr>
                <td>
                  <ConnectedSNSForm />
                </td>
              </tr>
              <tr>
                <th>배송지</th>
              </tr>
              <tr>
                <td>
                  <ShippingAddressForm />
                </td>
              </tr>

              {/* 각종 정보 수신 동의 관련 폼 */}
              <NotificationAgreementForm />
            </KeyValueTable>

            {/* 내 사이즈 및 기타정보 */}
            <div className={css.sectionDivider} />
            <SectionHeading title="추가 정보" />
            <AdditionalInfoForm />

            {/* 환불 계좌정보 */}
            <SectionHeading title="환불 계좌정보" />
            <RefundBankAccountForm />

            <WithdrawalForm />

            <FormErrors />
          </div>
        )}
      </UserEditFormContext.Consumer>
    );
  }
}

export default UserEditForm;
