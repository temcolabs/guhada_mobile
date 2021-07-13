import { useContext } from 'react';
import css from './UserEditForm.module.scss';
import ErrorMessage from 'components/mypage/form/ErrorMessage';
import {
  UserEditFormContext,
  fieldNames,
} from 'template/mypage/UserInfomation';
import _ from 'lodash';

/**
 * Form 컴포넌트의 에러를 표시한다.
 */
export default function FormErrors() {
  const { formApi } = useContext(UserEditFormContext);
  const { errors, submitFailed, error } = formApi.getState();

  return submitFailed && error ? (
    <div className={css.formGroup}>
      {_keys(errors).map((field) => (
        <ErrorMessage key={field}>
          [{fieldNames[field]}] {errors[field]} {/* [label] message */}
        </ErrorMessage>
      ))}
    </div>
  ) : null;
}
