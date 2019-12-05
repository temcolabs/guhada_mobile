import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SectionHeading from 'components/common/SectionHeading';
import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import tableCSS from 'components/mypage/form/KeyValueTable.module.scss';
import { Field } from 'react-final-form';
import {
  composeValidators,
  notEmptyString,
  required,
} from 'childs/lib/common/finalFormValidators';
import { devLog } from 'childs/lib/common/devLog';
import FormButton, {
  formButtonColors,
} from 'components/mypage/form/FormButton';
import accountService from 'childs/lib/API/order/accountService';

/**
 * 환불 계좌정보 입력 폼.
 * 취소, 반품 신청에서 사용한다
 *
 * final form의 render props 안에 마운팅되어야 한다.
 */
export default function RefundAccountInfoForm({
  isRefundEnabled = false, // 환불이 가능한지
  orderClaimForm,
  isCreate = true,
  fields = {
    refundBankCode: 'refundBankCode',
    refundBankAccountNumber: 'refundBankAccountNumber',
    refundBankAccountOwner: 'refundBankAccountOwner',
    isRefundAccountChecked: 'isRefundAccountChecked',
  },
  formApi, // final form instance
}) {
  const [isValidatingTried, setIsValidatingTried] = useState(false);
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);

  const { values } = formApi.getState();
  const claimData = orderClaimForm.claimData;

  // 환불 계좌정보 입력 양식. 반품 신청에서 표시된다.
  const isRefundAccountFormVisible = isCreate && isRefundEnabled;

  // 저장된 환불 계좌정보 표시 여부. 반품 신청 수정에서 표시된다.
  const isRefundAccontInfoVisible = !isCreate && isRefundEnabled;

  /**
   * 계좌번호 확인
   */
  const handleClickCheckAccount = useCallback(() => {
    const { values } = formApi.getState();
    const refundBankCode = values[fields.refundBankCode];
    const refundBankAccountNumber = values[fields.refundBankAccountNumber];
    const refundBankAccountOwner = values[fields.refundBankAccountOwner];

    if (
      !refundBankCode ||
      !refundBankAccountNumber ||
      !refundBankAccountOwner
    ) {
      // 필요한 정보를 입력하지 않았다면 오류 처리
      formApi.change(fields.isRefundAccountChecked, false);
    } else {
      setIsValidatingAccount(true);
      setIsValidatingTried(true);

      accountService
        .accountCheck({
          bankCode: refundBankCode,
          bankNumber: refundBankAccountNumber,
          name: refundBankAccountOwner,
        })
        .then(({ data }) => {
          devLog(`accountCheck`, data);

          if (data.data?.result === true) {
            formApi.change(fields.isRefundAccountChecked, true);
          } else {
            formApi.change(fields.isRefundAccountChecked, false);
          }
        })
        .catch(e => {
          console.error(e);
          formApi.change(fields.isRefundAccountChecked, false);
        })
        .finally(() => {
          setIsValidatingAccount(false);
        });
    }
  }, [
    fields.isRefundAccountChecked,
    fields.refundBankAccountNumber,
    fields.refundBankAccountOwner,
    fields.refundBankCode,
    formApi,
  ]);

  const isAllInputFilled =
    !!values[fields.refundBankAccountNumber] &&
    !!values[fields.refundBankCode] &&
    !!values[fields.refundBankAccountOwner];

  return (
    <>
      {isRefundAccountFormVisible && (
        <>
          <SectionHeading title="환불 계좌정보" />
          <KeyValueTable>
            <tr>
              <td>은행명</td>
              <td>
                <div className={tableCSS.smallInputWrapper}>
                  <Field
                    name={fields.refundBankCode}
                    validate={composeValidators(required)}
                  >
                    {props => (
                      <div>
                        <Select
                          options={orderClaimForm.bankCodeOptions}
                          value={orderClaimForm.bankCodeOptions?.find(
                            o => o.value === props.input.value
                          )}
                          onChange={({ value }) => {
                            props.input.onChange(value);

                            // 변경될때마다 계좌가 확인 안됨으로 변경
                            if (isAllInputFilled) {
                              formApi.change(
                                fields.isRefundAccountChecked,
                                false
                              );
                            }

                            formApi.change(
                              fields.isRefundAccountChecked,
                              false
                            );
                          }}
                        />
                        {props.meta.submitFailed && props.meta.error && (
                          <div data-name="error">{props.meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
              </td>
            </tr>
            <tr>
              <td>계좌번호</td>
              <td>
                <div className={tableCSS.smallInputWrapper}>
                  <Field
                    name={fields.refundBankAccountNumber}
                    validate={composeValidators(required, notEmptyString)}
                  >
                    {({ input, meta }) => (
                      <>
                        <Input
                          initialValue={input.value}
                          onChange={value => {
                            if (isAllInputFilled) {
                              formApi.change(
                                fields.isRefundAccountChecked,
                                false
                              );
                            }
                            input.onChange(value);
                          }}
                          placeholder="계좌번호를 입력해주세요."
                        />
                        {meta.submitFailed && meta.error && (
                          <div data-name="error">{meta.error}</div>
                        )}
                      </>
                    )}
                  </Field>
                </div>
              </td>
            </tr>
            <tr>
              <td>예금주명 (본인명)</td>
              <td>
                <div
                  className={tableCSS.smallInputWrapper}
                  style={{ float: 'left', marginRight: '10px' }}
                >
                  <Field
                    name={fields.refundBankAccountOwner}
                    validate={composeValidators(required, notEmptyString)}
                  >
                    {props => (
                      <div>
                        <Input
                          initialValue={props.input.value}
                          onChange={value => {
                            props.input.onChange(value);

                            if (isAllInputFilled) {
                              formApi.change(
                                fields.isRefundAccountChecked,
                                false
                              );
                            }
                          }}
                          placeholder="예금주명을 입력해주세요."
                        />
                        {props.meta.submitFailed && props.meta.error && (
                          <div data-name="error">{props.meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                {/* 계좌 확인 메시지 */}
                <Field
                  name={fields.isRefundAccountChecked}
                  validate={v => {
                    return isAllInputFilled && v === true
                      ? undefined
                      : '일치하는 계좌정보가 없습니다';
                  }}
                >
                  {({ meta }) => {
                    return (
                      <>
                        <FormButton
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            formApi.submit();
                            handleClickCheckAccount();
                          }}
                          status={
                            !meta.error
                              ? formButtonColors.DEFAULT
                              : formButtonColors.PURPLE
                          }
                        >
                          {isValidatingAccount
                            ? '확인중...'
                            : !meta.error
                            ? '확인 완료'
                            : '계좌확인'}
                        </FormButton>

                        {isValidatingTried && isAllInputFilled && meta.error ? (
                          <div data-name="error">{meta.error}</div>
                        ) : meta.dirty && !meta.error ? (
                          <div data-name="success">계좌 확인되었습니다</div>
                        ) : null}
                      </>
                    );
                    // 초기값이 변경된 후에 에러메시지 표시
                  }}
                </Field>
              </td>
            </tr>
          </KeyValueTable>
        </>
      )}

      {/* 입력한 환불 계좌정보 */}
      {isRefundAccontInfoVisible && (
        <>
          <SectionHeading title="환불 계좌정보" />
          <KeyValueTable>
            <tr>
              <td>은행명</td>
              <td>
                <div className={'textValueCell'}>
                  {
                    orderClaimForm.bankCodeOptions.find(
                      o => o.value === claimData?.refundBankCode
                    )?.label
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td>계좌번호</td>
              <td>
                <div className={'textValueCell'}>
                  {claimData?.refundBankAccountNumber}
                </div>
              </td>
            </tr>
            <tr>
              <td>예금주명 (본인명)</td>
              <td>
                <div className={'textValueCell'}>
                  {claimData?.refundBankAccountOwner}
                </div>
              </td>
            </tr>
          </KeyValueTable>
        </>
      )}
    </>
  );
}
