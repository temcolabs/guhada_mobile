import React, { useState, useEffect, useMemo } from 'react';
import css from './OrderAddressEditModal.module.scss';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { Form, Field } from 'react-final-form';
import {
  composeValidators,
  notEmptyString,
  mustBeBoolean,
  required,
  mustBeMobile,
} from 'childs/lib/common/finalFormValidators';
import Input from 'components/mypage/form/Input';
import Checkbox from '../form/Checkbox';
import openDaumAddressSearch from 'childs/lib/common/openDaumAddressSearch';
import { useObserver } from 'mobx-react-lite';
import FormButton from '../form/FormButton';
import ModalLayout, {
  useModalLayoutState,
} from 'components/layout/ModalLayout';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';

/**
 * 주문 배송지 수정 모달
 *
 * 내 주문내역에서 결제 성공 후 배송 시작 전인 주문만 수정이 가능하다.
 * 배송지 수정 버튼은 OrderActionButtonConductor에서 확인.
 */
function OrderAddressEditModal({
  isOpen,
  onClose,
  initialAddressValues, // observable object
  purchaseId,
  updateShippingAddress,
}) {
  const { isModalLayoutOpen } = useModalLayoutState({
    isModalOpen: isOpen,
  });
  // final form field names
  const fields = useMemo(
    () => ({
      defaultAddress: 'defaultAddress', // boolean, 배송지 추가시 기본 배송지로 변경할 지 여부
      zip: 'zip', // string, 우편번호
      address: 'address', // string, 지번 주소
      roadAddress: 'roadAddress', // string, 도로명 주소
      detailAddress: 'detailAddress', // string, 상세 주소
      recipientMobile: 'recipientMobile', // string, 받는사람 전화번호
      recipientName: 'recipientName', // string, 받는 사람 이름
      safetyMobile: 'safetyMobile', // boolean, 안심번호 여부
      shippingMessage: 'shippingMessage', // string, 배송 메세지
      shippingName: 'shippingName', // string, 저장될 배송지명
    }),
    []
  );

  // 폼 기본값
  const defaultValues = useMemo(
    () => ({
      defaultAddress: false,
      zip: '',
      address: '',
      detailAddress: '',
      recipientMobile: '',
      recipientName: '',
      roadAddress: '',
      safetyMobile: false,
      shippingMessage: '',
      shippingName: '',
    }),
    []
  );

  const [initialValues, setInitialValues] = useState(defaultValues);

  // 초기값 반영
  useEffect(() => {
    setInitialValues(Object.assign({}, defaultValues, initialAddressValues));
  }, [defaultValues, initialAddressValues]);

  // 주소찾기 버튼 클릭
  const handleClickAddressSearch = ({ formApi }) => {
    // 다음 주소검색 오픈
    openDaumAddressSearch({
      onComplete: ({ zonecode, roadAddress, jibunAddress }) => {
        formApi.batch(() => {
          formApi.change(fields.zip, zonecode);
          formApi.change(fields.roadAddress, roadAddress);
          formApi.change(fields.address, jibunAddress);
        });
      },
    });
  };

  /**
   * final form onsubmit
   * 주문 배송지 업데이트
   */
  const handleSubmit = values => {
    updateShippingAddress({ shippingAddress: values, purchaseId });
  };

  return useObserver(() => (
    <ModalLayout
      pageTitle={'주문 배송지 수정'}
      isOpen={isModalLayoutOpen}
      onClose={onClose}
    >
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        render={({ handleSubmit, form: formApi }) => {
          const { values } = formApi.getState();

          console.log(
            `addHyphenToMobile(fields.recipientMobile)`,
            addHyphenToMobile(values[fields.recipientMobile])
          );

          return (
            <form onSubmit={handleSubmit}>
              <div className={css.modal}>
                <div className={css.modal__body}>
                  <table className={css.modal_body__table}>
                    <tbody>
                      <tr>
                        <td>
                          <Field
                            name={fields.shippingName}
                            validate={composeValidators(
                              required,
                              notEmptyString
                            )}
                          >
                            {props => (
                              <div className={css.inputWrapper}>
                                <Input
                                  type="text"
                                  placeholder="배송지명"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[fields.shippingName]
                                  }
                                />
                                {props.meta.submitFailed && (
                                  <div className={css.errorMessage}>
                                    {props.meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <td className={css.addressField}>
                          {/* 우편번호 찾기를 통해 우편번호, 도로명, 지번 주소를 동시에 설정  */}
                          {/* 3개의 필드를 검사해야 하지만, 우편번호를 검색했음을 보장하는 zip 필드만 체크한다 */}
                          <Field
                            name={fields.zip}
                            validate={composeValidators(required)}
                          >
                            {props => (
                              <div className={css.inputWrapper}>
                                <Input
                                  type="text"
                                  initialValue={
                                    values.zip &&
                                    (values.roadAddress || values.address) &&
                                    `(우:${values.zip}) ${values.roadAddress ||
                                      values.address}`
                                  }
                                  disabled
                                  placeholder="우편번호찾기를 통해 입력"
                                />
                                {props.meta.submitFailed && (
                                  <div className={css.errorMessage}>
                                    {props.meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                          <FormButton
                            onClick={() =>
                              handleClickAddressSearch({ formApi })
                            }
                            id="mypage__editAddress"
                          >
                            우편번호찾기
                          </FormButton>
                          <Field name={fields.zip}>{() => null}</Field>
                          <Field name={fields.roadAddress}>{() => null}</Field>
                          <Field name={fields.address}>{() => null}</Field>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            name={fields.detailAddress}
                            validate={composeValidators(
                              required,
                              notEmptyString
                            )}
                          >
                            {props => (
                              <div className={css.inputWrapper}>
                                <Input
                                  type="text"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[fields.detailAddress]
                                  }
                                  placeholder="상세 주소"
                                />
                                {props.meta.submitFailed && (
                                  <div className={css.errorMessage}>
                                    {props.meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            name={fields.recipientName}
                            validate={composeValidators(
                              required,
                              notEmptyString
                            )}
                          >
                            {props => (
                              <div className={css.inputWrapper}>
                                <Input
                                  type="text"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[fields.recipientName]
                                  }
                                  placeholder="받는분"
                                />
                                {props.meta.submitFailed && (
                                  <div className={css.errorMessage}>
                                    {props.meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field
                            name={fields.recipientMobile}
                            validate={composeValidators(
                              required,
                              notEmptyString,
                              mustBeMobile
                            )}
                          >
                            {props => (
                              <div className={css.inputWrapper}>
                                <Input
                                  type="text"
                                  formatter={addHyphenToMobile}
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[fields.recipientMobile]
                                  }
                                />
                                {props.meta.submitFailed && (
                                  <div className={css.errorMessage}>
                                    {props.meta.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Field name={fields.shippingMessage}>
                            {props => (
                              <div className={css.inputWrapper}>
                                <Input
                                  type="text"
                                  placeholder="배송 메시지"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[fields.shippingMessage]
                                  }
                                />
                              </div>
                            )}
                          </Field>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {/* 기본 배송지 설정 */}
                          <Field
                            name={fields.defaultAddress}
                            validate={composeValidators(mustBeBoolean)}
                          >
                            {props => (
                              <>
                                <div className={css.inputWrapper}>
                                  <Checkbox
                                    initialValue={
                                      initialValues[fields.defaultAddress]
                                    }
                                    name={fields.defaultAddress}
                                    onChange={checked => {
                                      props.input.onChange(checked);
                                    }}
                                    checked={props.input.value}
                                  >
                                    기본배송지 설정
                                  </Checkbox>
                                  {props.meta.submitFailed && (
                                    <div className={css.errorMessage}>
                                      {props.meta.error}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </Field>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={css.modal__bottom}>
                  <button type="submit">수정</button>
                </div>
              </div>
            </form>
          );
        }}
      />
    </ModalLayout>
  ));
}

export default OrderAddressEditModal;
