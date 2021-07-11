import React, { useContext } from 'react';
import css from './UserEditForm.module.scss';
import { Field } from 'react-final-form';
import { mustBeBoolean } from 'childs/lib/common/finalFormValidators';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import { useObserver } from 'mobx-react';
import Checkbox from 'components/mypage/form/Checkbox';
import ErrorMessage from 'components/mypage/form/ErrorMessage';

export default function NotificationAgreementForm() {
  const { fields } = useContext(UserEditFormContext);

  return useObserver(() => (
    <>
      {/* 쇼핑혜택・이벤트 */}
      <tr>
        <th>쇼핑혜택・이벤트</th>
      </tr>
      <tr>
        <td>
          <div className={css.formGroup}>
            <Field name={fields.agreeEmailReception} validate={mustBeBoolean}>
              {({ meta, input }) => (
                <div className={css.formInput} data-type="notiAgreeCheckbox">
                  <Checkbox
                    name={fields.agreeEmailReception}
                    initialValue={meta.initial}
                    onChange={input.onChange}
                  >
                    SMS 수신동의
                  </Checkbox>
                  {meta.submitFailed && meta.error && (
                    <ErrorMessage>{meta.error}</ErrorMessage>
                  )}
                </div>
              )}
            </Field>

            <Field name={fields.agreeSmsReception} validate={mustBeBoolean}>
              {({ meta, input }) => (
                <div className={css.formInput} data-type="notiAgreeCheckbox">
                  <Checkbox
                    name={fields.agreeSmsReception}
                    initialValue={meta.initial}
                    onChange={input.onChange}
                  >
                    이메일 수신동의
                  </Checkbox>
                  {meta.submitFailed && meta.error && (
                    <ErrorMessage>{meta.error}</ErrorMessage>
                  )}
                </div>
              )}
            </Field>

            {/* 개인정보 수정 동의 TODO: API 없음 */}
            {/* <div className={css.formInput} data-type="notiAgreeCheckbox">
              <Checkbox>
                홍보 마케팅 목적 개인정보 수집 및 이용 동의 [선택]
              </Checkbox>
            </div> */}
          </div>
        </td>
      </tr>
      {/* 정보성 알림 수신방법. TODO: API 없음 */}
      {/* <tr>
        <td>정보성 알림 수신방법</td>
        <td>
          <div className={css.formGroup}>
            <div className={css.formInput} data-type="notiAgreeCheckbox">
              <Checkbox>카카오톡</Checkbox>
            </div>
            <div className={css.formInput} data-type="notiAgreeCheckbox">
              <Checkbox>문자</Checkbox>
            </div>
            <div className={css.formInput} data-type="notiAgreeCheckbox">
              <Checkbox>이메일</Checkbox>
            </div>
          </div>
        </td>
      </tr> */}
    </>
  ));
}
