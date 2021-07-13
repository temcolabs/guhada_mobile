import { useState, useCallback, useContext, useEffect } from 'react';
import css from './UserEditForm.module.scss';
import Input, { inputStatTypes } from 'components/mypage/form/Input';
import { Field } from 'react-final-form';
import {
  composeValidators,
  validateWithValue,
  delayedValidation,
  validateStringHasLength,
  nickNameLength,
} from 'lib/common/finalFormValidators';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import { useObserver } from 'mobx-react';

export default function NicknameVerifyForm() {
  const { fields, initialValues } = useContext(UserEditFormContext);

  // 마지막 입력값. 밸리데이션 중복 실행을 방지
  const [lastValue, setLastValue] = useState(null);

  const onChange = useCallback(
    (v, { input }) => {
      const nickname = _.trim(v); // 양쪽 공백 제거

      input.onChange(nickname);
      setLastValue(nickname);
    },
    [setLastValue]
  );

  // setLastValue 최초 1회 실행
  useEffect(() => {
    setLastValue(initialValues[fields.nickname]);
    return () => {};
  }, [fields.nickname, initialValues]);

  return useObserver(() => (
    <Field
      name={fields.nickname}
      validate={composeValidators(
        delayedValidation(
          validateStringHasLength(validateWithValue(nickNameLength))
        )
      )}
    >
      {({ meta, input }) => {
        return (
          <div className={css.formGroup}>
            <div className={css.formInput} data-type="defaultSize">
              <input type="text" name="hidden" style={{ display: 'none' }} />
              <Input
                initialValue={meta.initial}
                onChange={(v) => onChange(v, { input, meta })}
                autoComplete="false"
                status={meta.error ? inputStatTypes.ERROR : inputStatTypes.OK}
              />
              {meta.error && meta.dirty && (
                <div className={css.errorText}>{meta.error}</div>
              )}
            </div>
          </div>
        );
      }}
    </Field>
  ));
}
