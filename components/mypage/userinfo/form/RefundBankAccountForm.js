import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import css from './UserEditForm.module.scss';
import { Field } from 'react-final-form';
import Input, { inputStatTypes } from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import { composeValidators } from 'lib/common/finalFormValidators';
import FormButton, {
  formButtonColors,
} from 'components/mypage/form/FormButton';
import ErrorMessage from 'components/mypage/form/ErrorMessage';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import bankService from 'lib/API/user/bankService';
import isTruthy from 'lib/common/isTruthy';
import accountService from 'lib/API/order/accountService';
import useStores from 'stores/useStores';

/**
 * 환불계좌정보 입력 양식
 * @param {*} param0
 */
export default function RefundBankAccountForm() {
  const { alert: alertStore } = useStores();
  const { fields, values, formApi } = useContext(UserEditFormContext);

  const [isCheckingAccount, setIsCheckingAccount] = useState(false);

  const [bankOptions, setbankOptions] = useState([]);

  useEffect(() => {
    bankService.getBanks().then((banks) => {
      banks.splice(0, 0, {
        label: '(선택 없음)',
        value: null,
      });
      setbankOptions(banks);
    });
    return () => {
      setbankOptions([]);
    };
  }, []);

  /**
   * 계좌번호 확인
   * @param {} param0
   */
  const verifyAccount = () => {
    setIsCheckingAccount(true);

    accountService
      .accountCheck({
        bankCode: values[fields.bankCode],
        bankNumber: values[fields.accountNumber],
        name: values[fields.accountHolder],
      })
      .then(({ data }) => {
        if (data.data?.result) {
          formApi.change(fields.isAccountVerified, true);
          formApi.change(fields.accountHolder, data.data?.name);
        } else {
          alertStore.showAlert('계좌를 확인할 수 없습니다.');
        }
      })
      .catch((e) => {
        console.error(e);
        formApi.change(fields.isAccountVerified, false);
      })
      .finally(() => {
        setIsCheckingAccount(false);
      });
  };

  const isAccountVerified = values[fields.isAccountVerified];

  return (
    <KeyValueTable>
      <tr>
        <th>은행명</th>
      </tr>
      <tr>
        <td>
          <Field name={fields.bankCode}>
            {({ input, meta }) => (
              <div className={css.formGroup}>
                <div className={css.formInput} data-type="defaultSize">
                  <Select
                    options={bankOptions}
                    value={bankOptions?.find((o) => o.value === input.value)}
                    onChange={({ value, label }) => {
                      formApi.batch(() => {
                        // 은행 코드
                        input.onChange(value);
                        // 은행이름
                        formApi.change(fields.bankName, label);
                        // 변경될때마다 계좌가 확인 안됨으로 변경
                        formApi.change(fields.isAccountVerified, false);
                        // 계좌주 초기화r
                        formApi.change(fields.accountHolder, null);
                      });
                    }}
                  />

                  {meta.submitFailed && meta.error && (
                    <ErrorMessage>{meta.error}</ErrorMessage>
                  )}
                </div>
              </div>
            )}
          </Field>
        </td>
      </tr>
      <tr>
        <th>계좌번호</th>
      </tr>
      <tr>
        <td>
          <Field name={fields.accountNumber} validate={composeValidators()}>
            {({ input, meta }) => (
              <div className={css.formGroup}>
                <div className={css.formInput} data-type="defaultSize">
                  <Input
                    initialValue={meta.initial}
                    onChange={(v) => {
                      input.onChange(v);
                      formApi.change(fields.isAccountVerified, false);
                    }}
                  />
                  {meta.submitFailed && meta.error && (
                    <ErrorMessage>{meta.error}</ErrorMessage>
                  )}
                </div>
              </div>
            )}
          </Field>
        </td>
      </tr>
      <tr>
        <th>예금주명 (본인명)</th>
      </tr>
      <tr>
        <td>
          <Field name={fields.accountHolder}>
            {({ input, meta }) => (
              <>
                <div className={css.formGroup}>
                  <div className={css.formInput} data-type="formButtonSize">
                    {/* NOTE: 이름은 입력받지 않는다 */}
                    <Input
                      initialValue={input.value}
                      onChange={(v) => {
                        input.onChange(v);
                        formApi.change(fields.isAccountVerified, false);
                      }}
                      type="text"
                      disabled
                    />
                    {meta.submitFailed && meta.error && (
                      <ErrorMessage>{meta.error}</ErrorMessage>
                    )}
                  </div>
                  <div className={css.formInput}>
                    <FormButton
                      disabled={values.isAccountVerified}
                      onClick={verifyAccount}
                      color={
                        !values.isAccountVerified
                          ? formButtonColors.PURPLE
                          : formButtonColors.DEFAULT
                      }
                    >
                      {isCheckingAccount
                        ? '확인 중...'
                        : isAccountVerified
                        ? '확인 완료'
                        : '계좌 확인'}
                    </FormButton>
                  </div>
                </div>
              </>
            )}
          </Field>

          <Field
            name={fields.isAccountVerified}
            validate={(isAccountVerified) => {
              const { values } = formApi.getState();
              const { bankCode, accountNumber, accountHolder } = values;

              // 입력값이 있는데 계좌 확인이 안되었다면
              if (
                (isTruthy(bankCode) ||
                  isTruthy(accountNumber) ||
                  isTruthy(accountHolder)) &&
                !isAccountVerified
              ) {
                return '계좌 확인이 필요합니다.';
              } else {
                return undefined;
              }
            }}
          >
            {({ input, meta }) => (
              <div>
                {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
              </div>
            )}
          </Field>
        </td>
      </tr>
    </KeyValueTable>
  );
}
