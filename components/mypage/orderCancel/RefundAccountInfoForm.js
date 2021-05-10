import React, { useState, useCallback } from 'react';
import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import css from './RefundAccountInfoForm.module.scss';
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
import useStores from 'stores/useStores';
import claimFormCSS from 'components/mypage/order/OrderClaimForm.module.scss';
import cn from 'classnames';

/**
 * 환불 계좌정보 입력 폼.
 * 취소, 반품 신청에서 사용한다
 *
 * final form의 render props 안에 마운팅되어야 한다.
 */
export default function RefundAccountInfoForm({
  isCreate = true,
  // fields = {
  //   refundBankCode: 'refundBankCode',
  //   refundBankAccountNumber: 'refundBankAccountNumber',
  //   refundBankAccountOwner: 'refundBankAccountOwner',
  //   isRefundAccountChecked: 'isRefundAccountChecked',
  // },
  // formApi, // final form instance
}) {
  const { orderClaimForm } = useStores();
  const [isValidatingTried, setIsValidatingTried] = useState(false);
  const [isValidatingAccount, setIsValidatingAccount] = useState(false);

  // const { values } = formApi.getState();
  const claimData = orderClaimForm.claimData;

  // 환불 계좌정보 입력 양식. 반품 신청에서 표시된다.
  const isRefundAccountFormVisible = isCreate && orderClaimForm.isRefundEnabled;

  // 저장된 환불 계좌정보 표시 여부. 반품 신청 수정에서 표시된다.
  const isRefundAccontInfoVisible = !isCreate && orderClaimForm.isRefundEnabled;

  /**
   * 계좌번호 확인
   */
  // const handleClickCheckAccount = useCallback(() => {
  //   const { values } = formApi.getState();
  //   const refundBankCode = values[fields.refundBankCode];
  //   const refundBankAccountNumber = values[fields.refundBankAccountNumber];
  //   const refundBankAccountOwner = values[fields.refundBankAccountOwner];

  //   if (
  //     !refundBankCode ||
  //     !refundBankAccountNumber ||
  //     !refundBankAccountOwner
  //   ) {
  //     // 필요한 정보를 입력하지 않았다면 오류 처리
  //     formApi.change(fields.isRefundAccountChecked, false);
  //   } else {
  //     setIsValidatingTried(false);
  //     setIsValidatingAccount(true);

  //     accountService
  //       .accountCheck({
  //         bankCode: refundBankCode,
  //         bankNumber: refundBankAccountNumber,
  //         name: refundBankAccountOwner,
  //       })
  //       .then(({ data }) => {
  //         devLog(`accountCheck`, data);

  //         if (data.data?.result === true) {
  //           formApi.change(fields.isRefundAccountChecked, true);
  //         } else {
  //           formApi.change(fields.isRefundAccountChecked, false);
  //         }
  //       })
  //       .catch(e => {
  //         console.error(e);
  //         formApi.change(fields.isRefundAccountChecked, false);
  //       })
  //       .finally(() => {
  //         setIsValidatingTried(true);
  //         setIsValidatingAccount(false);
  //       });
  //   }
  // }, [
  //   fields.isRefundAccountChecked,
  //   fields.refundBankAccountNumber,
  //   fields.refundBankAccountOwner,
  //   fields.refundBankCode,
  //   formApi,
  // ]);

  // const isAllInputFilled =
  //   !!values[fields.refundBankAccountNumber] &&
  //   !!values[fields.refundBankCode] &&
  //   !!values[fields.refundBankAccountOwner];

  // const isAccountVerified = values[fields.isRefundAccountChecked];

  return (
    <div>
      {isRefundAccountFormVisible && (
        <div style={{ marginTop: '20px' }}>
          <div className={claimFormCSS.field}>
            <div className={claimFormCSS.field__label}>은행명</div>
            <div className={claimFormCSS.field__value}>
              <input type="text" value={claimData?.refundBankName} readOnly />
              {/* <Field
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
                          formApi.change(fields.isRefundAccountChecked, false);
                        }

                        formApi.change(fields.isRefundAccountChecked, false);
                      }}
                    />
                    {props.meta.submitFailed && props.meta.error && (
                      <div className={claimFormCSS.errorMsg}>
                        {props.meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field> */}
            </div>
          </div>
          <div className={claimFormCSS.field}>
            <div className={claimFormCSS.field__label}>계좌번호</div>
            <div className={claimFormCSS.field__value}>
              <div className={css.smallInputWrapper}>
                <input
                  type="text"
                  value={claimData?.refundBankAccountNumber}
                  readOnly
                />
                {/* <Field
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
                        <div className={claimFormCSS.errorMsg}>
                          {meta.error}
                        </div>
                      )}
                    </>
                  )}
                </Field> */}
              </div>
            </div>
          </div>
          <div className={claimFormCSS.field}>
            <div className={claimFormCSS.field__label}>예금주명 (본인명)</div>
            <div className={claimFormCSS.field__value}>
              <div className={css.checkAccountField}>
                <div className={css.checkAccountField__input}>
                  <input
                    type="text"
                    value={claimData?.refundBankAccountOwner}
                    readOnly
                  />
                  {/* <Field
                    name={fields.refundBankAccountOwner}
                    validate={composeValidators(required, notEmptyString)}
                  >
                    {props => (
                      <>
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
                          <div className={claimFormCSS.errorMsg}>
                            {props.meta.error}
                          </div>
                        )}
                      </>
                    )}
                  </Field> */}
                </div>

                {/* 계좌 확인 메시지 */}
                {/* <div className={css.checkAccountField__button}>
                  <FormButton
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      formApi.submit();
                      handleClickCheckAccount();
                    }}
                    status={
                      !isAccountVerified
                        ? formButtonColors.DEFAULT
                        : formButtonColors.PURPLE
                    }
                  >
                    {isValidatingAccount
                      ? '확인중...'
                      : isAccountVerified
                      ? '확인 완료'
                      : '계좌확인'}
                  </FormButton>
                </div> */}
              </div>

              {/* <div>
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
                        {isValidatingTried && isAllInputFilled && meta.error ? (
                          <div className={claimFormCSS.errorMsg}>
                            {meta.error}
                          </div>
                        ) : null}
                      </>
                    );
                    // 초기값이 변경된 후에 에러메시지 표시
                  }}
                </Field>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* 입력한 환불 계좌정보 */}
      {isRefundAccontInfoVisible && (
        <div style={{ marginTop: '20px' }}>
          <div
            className={cn(
              claimFormCSS.field,
              claimFormCSS.hasChildrenInOneLine
            )}
          >
            <div className={claimFormCSS.field__label}>은행명</div>
            <div className={claimFormCSS.field__value}>
              {
                orderClaimForm.bankCodeOptions.find(
                  (o) => o.value === claimData?.refundBankCode
                )?.label
              }
            </div>
          </div>
          <div
            className={cn(
              claimFormCSS.field,
              claimFormCSS.hasChildrenInOneLine
            )}
          >
            <div className={claimFormCSS.field__label}>계좌번호</div>
            <div className={claimFormCSS.field__value}>
              {claimData?.refundBankAccountNumber}
            </div>
          </div>
          <div
            className={cn(
              claimFormCSS.field,
              claimFormCSS.hasChildrenInOneLine
            )}
          >
            <div className={claimFormCSS.field__label}>예금주명 (본인명)</div>
            <div className={claimFormCSS.field__value}>
              {claimData?.refundBankAccountOwner}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
