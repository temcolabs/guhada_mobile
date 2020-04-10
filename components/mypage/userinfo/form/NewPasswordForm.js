import React, { useContext } from 'react';
import css from './UserEditForm.module.scss';
import Input, { inputStatTypes } from 'components/mypage/form/Input';
import { Field } from 'react-final-form';
import {
  composeValidators,
  validateWithValue,
  mustBePassword,
  delayedValidation,
  validateStringHasLength,
} from 'childs/lib/common/finalFormValidators';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import { useObserver } from 'mobx-react-lite';
import ErrorMessage from 'components/mypage/form/ErrorMessage';
import isTruthy from 'childs/lib/common/isTruthy';

/**
 * 새 비밀번호 확인
 */
export default function NewPasswordForm() {
  const { fields, values, formApi } = useContext(UserEditFormContext);

  // 입력창 스타일
  const getInputStatusType = meta => {
    const { password, passwordConfirm } = values;
    const isPasswordSame =
      isTruthy(password) &&
      isTruthy(passwordConfirm) &&
      password === passwordConfirm;

    return meta.dirty
      ? meta.error
        ? inputStatTypes.ERROR
        : isPasswordSame
        ? inputStatTypes.OK
        : inputStatTypes.NORMAL
      : inputStatTypes.NORMAL;
  };

  return useObserver(() => (
    <>
      {/* 새 비밀번호 */}
      <div className={css.formGroup}>
        <Field
          name={fields.password}
          validate={delayedValidation(
            validateStringHasLength(validateWithValue(mustBePassword))
          )}
        >
          {({ input, meta }) => (
            <div className={css.formInput} data-type="defaultSize">
              <input
                type="password"
                name="hidden"
                style={{ display: 'none' }}
              />
              <Input
                initialValue={meta.inital}
                onChange={input.onChange}
                autoComplete="off"
                type="password"
                placeholder="새 비밀번호"
                status={getInputStatusType(meta)}
              />
              {meta.dirty && meta.error && (
                <ErrorMessage>{meta.error}</ErrorMessage>
              )}
            </div>
          )}
        </Field>
      </div>

      {/* 새 비밀번호 확인 */}
      <div className={css.formGroup}>
        <Field
          name={fields.passwordConfirm}
          validate={composeValidators(
            delayedValidation(
              validateStringHasLength(validateWithValue(mustBePassword))
            ),
            v => {
              // 비밀번호 일치여부 검사
              return v !== values[fields.password]
                ? '비밀번호가 일치하지 않습니다.'
                : undefined;
            }
          )}
        >
          {({ input, meta }) => (
            <div className={css.formInput} data-type="defaultSize">
              <input
                type="password"
                name="hidden"
                style={{ display: 'none' }}
              />
              <Input
                initialValue={meta.inital}
                onChange={input.onChange}
                autoComplete="off"
                type="password"
                placeholder="새 비밀번호 확인"
                status={getInputStatusType(meta)}
              />
            </div>
          )}
        </Field>
      </div>

      <div
        className={css.description}
        style={{ lineHeight: 1, marginBottom: '15px' }}
      >
        ・ 영문, 숫자, 특수문자로 8~15자 사이에서만 생성할 수 있습니다.
      </div>

      {/* 비밀번호 확인 오류 메시지 */}
      {formApi.getFieldState(fields.passwordConfirm)?.error && (
        <ErrorMessage>
          {formApi.getFieldState(fields.passwordConfirm)?.error}
        </ErrorMessage>
      )}
    </>
  ));
}
