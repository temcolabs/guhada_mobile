import React, { useState, useCallback, useContext, useEffect } from 'react';
import _ from 'lodash';
import css from './UserEditForm.module.scss';
import Input, { inputStatTypes } from 'components/mypage/form/Input';
import { Field } from 'react-final-form';
import {
  composeValidators,
  notEmptyString,
} from 'childs/lib/common/finalFormValidators';
import debouncePromise from 'childs/lib/common/debouncePromise';
import userService from 'childs/lib/API/user/userService';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
// import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react-lite';

export default function NicknameVerifyForm() {
  const { fields, initialValues, runAfterFormInit } = useContext(
    UserEditFormContext
  );

  // 마지막 입력값. 밸리데이션 중복 실행을 방지
  const [lastValue, setLastValue] = useState(null);

  /**
   * 닉네임 중복 확인
   */
  const checkIsNicknameDup = useCallback(
    debouncePromise(async nickname => {
      return await userService.isNicknameExist({ nickname });
    }, 300),
    []
  );

  const onChange = useCallback(
    (v, { input }) => {
      const nickname = _.trim(v); // 양쪽 공백 제거

      input.onChange(nickname);
      setLastValue(nickname);
    },
    [setLastValue]
  );

  const validator = useCallback(
    runAfterFormInit(
      composeValidators(notEmptyString, async v => {
        if (lastValue !== v) {
          // 초기값과 같으면 문제없음
          if (initialValues[fields.nickname] === v) {
            return undefined;
          } else {
            if (await checkIsNicknameDup(v)) {
              return '이미 사용중인 닉네임입니다.';
            } else {
              return undefined;
            }
          }
        }
      })
    ),
    [lastValue]
  );

  // setLastValue 최초 1회 실행
  useEffect(() => {
    setLastValue(initialValues[fields.nickname]);
    return () => {};
  }, [fields.nickname, initialValues]);

  return useObserver(() => (
    <Field name={fields.nickname} validate={validator}>
      {({ meta, input }) => {
        return (
          <div className={css.formGroup}>
            <div className={css.formInput} data-type="defaultSize">
              <input type="text" name="hidden" style={{ display: 'none' }} />
              <Input
                initialValue={meta.initial}
                onChange={v => onChange(v, { input, meta })}
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
