import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import cn from 'classnames';
import { Form, Field } from 'react-final-form';
import { withRouter } from 'next/router';
import css from 'components/mypage/order/OrderClaimForm.module.scss';
import DetailPageLayout from 'components/layout/DetailPageLayout';
import TextArea from 'components/mypage/form/TextArea';
import Select from 'components/mypage/form/Select';
import QuantityControl from 'components/mypage/form/QuantityControl';
import DealOrdered from 'components/mypage/DealOrdered';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import RefundInfo from 'components/mypage/orderCancel/RefundInfo';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import {
  composeValidators,
  maxValue,
  required,
  requiredWithMessage,
} from 'childs/lib/common/finalFormValidators';
import isDev from 'childs/lib/common/isDev';
import purchaseStatus from 'childs/lib/constant/order/purchaseStatus';
import RefundAccountInfoForm from 'components/mypage/orderCancel/RefundAccountInfoForm';
import { isFalsey } from 'childs/lib/common/isTruthy';
import { devLog } from 'childs/lib/common/devLog';

/**
 * 주문 취소 신청 페이지
 */
@withScrollToTopOnMount
@withRouter
@inject('orderClaimForm', 'orderClaimList')
@observer
class OrderCancelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialValues: Object.assign({}, this.defaultInitialValues),
    };
  }
  // final form 필드 네임
  fields = {
    quantity: 'quantity',
    cancelReason: 'cancelReason',
    cancelReasonText: 'cancelReasonText',

    // 환불 계좌정보
    refundBankCode: 'refundBankCode', // 은행코드
    refundBankAccountNumber: 'refundBankAccountNumber', // 계좌번호
    refundBankAccountOwner: 'refundBankAccountOwner', // 예금주
    isRefundAccountChecked: 'isRefundAccountChecked', // 환불계좌가 확인되었는지?
  };

  // 폼 초기값
  defaultInitialValues = {
    [this.fields.quantity]: 1,
    [this.fields.cancelReason]: null,
    [this.fields.cancelReasonText]: null,

    [this.fields.refundBankCode]: null,
    [this.fields.refundBankAccountNumber]: null,
    [this.fields.refundBankAccountOwner]: null,
    [this.fields.isRefundAccountChecked]: null,
  };

  get orderProdGroupId() {
    return this.props.router.query.orderProdGroupId;
  }

  /**
   * 신청시에는 클레임 아이디가 없다
   */
  getIsCreate = () => {
    return isFalsey(this.props.router?.query.orderClaimId);
  };

  componentDidMount() {
    this.initFormValues();
  }

  initFormValues = () => {
    this.props.orderClaimForm.setClaimId({
      orderProdGroupId: this.orderProdGroupId,
    });

    const job = claimData => {
      // 반품 환불예상금액 가져오기. 최초에 클레임 데이터(최대값)으로 계산
      this.props.orderClaimForm.getRefundResponse({
        orderProdGroupId: claimData.orderProdGroupId,
        quantity: claimData.quantity,
      });

      // 초기값 수정
      this.setState({
        initialValues: {
          ...this.state.initialValues,
          quantity: claimData.quantity,
        },
      });
    };

    this.props.orderClaimForm.pushJobForClaimData(job);
  };

  componentWillUnmount() {
    if (!isDev) {
      this.props.orderClaimForm.resetClaimData();
    }
  }

  handleChangeReason = ({ reasonSelected, formApi }) => {
    formApi.change(this.fields.cancelReason, reasonSelected);
    formApi.change(this.fields.cancelReasonText, null);
  };

  /**
   * 취소수량 변경
   */
  handleChangeQuantity = quantity => {
    // 취소예샹금액 변경
    this.props.orderClaimForm.getRefundResponse({
      orderProdGroupId: this.orderProdGroupId,
      quantity,
    });
  };

  /**
   * 취소 신청
   * final form의 onSubmit 콜백. 필드에 오류가 있으면 호출되지 않는다.
   */
  handleSubmit = values => {
    this.props.orderClaimForm.createOrderCancel({
      orderProdGroupId: this.orderProdGroupId,
      cancelReason: values[this.fields.cancelReason],
      cancelReasonText: values[this.fields.cancelReasonText],
      quantity: values[this.fields.quantity],
    });
  };

  render() {
    const { orderClaimForm } = this.props;
    const { claimData, cancelReasonOptions } = orderClaimForm;

    // 입금 대기중에는 환불 정보가 보이지 않음.
    const isRefundInfoVisible =
      claimData?.orderStatus !== purchaseStatus.WAITING_PAYMENT.code;

    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={this.state.initialValues}
        render={({ handleSubmit, form: formApi }) => {
          const formState = formApi.getState();
          const { values, errors } = formState;
          devLog(`formState values`, values);
          devLog(`formState errors`, errors);

          return (
            <DetailPageLayout pageTitle={'주문상품 취소 신청'}>
              <div className={css.wrap}>
                <form onSubmit={handleSubmit}>
                  <div className={css.orderInfo}>
                    <div className={css.orderInfo__orderId}>
                      <div className={css.orderInfo__field}>
                        <span className={css.orderInfo__label}>주문번호</span>
                        <span className={css.orderInfo__value}>
                          {claimData.purchaseId || '-'}
                        </span>
                      </div>
                      <div className={css.orderInfo__field}>
                        <span className={css.orderInfo__label}>주문일</span>
                        <span className={cn(css.orderInfo__value)}>
                          {orderClaimForm.orderDateWithFormat}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <div className={css.dealWrap}>
                      <DealOrdered
                        order={orderClaimForm.claimData}
                        isSmallImage={false}
                        isBrandAndProductInSameLine={false}
                        hasOptionQuantity={true}
                        isPurchaseStatusVisible
                        isPriceVisible
                      />

                      <div
                        style={{
                          marginTop: '32px',
                        }}
                      >
                        <div
                          className={cn(css.field, css.hasChildrenInOneLine)}
                        >
                          <div className={css.field__label}>취소수량</div>
                          <div className={css.field__value}>
                            <Field
                              name={this.fields.quantity}
                              validate={composeValidators(
                                maxValue(claimData?.quantity)
                              )}
                            >
                              {props => {
                                return (
                                  <QuantityControl
                                    initialValue={
                                      this.state.initialValues[
                                        this.fields.quantity
                                      ]
                                    }
                                    max={claimData?.quantity}
                                    onChange={value => {
                                      props.input.onChange(value);
                                      this.handleChangeQuantity(value);
                                    }}
                                  />
                                );
                              }}
                            </Field>
                          </div>
                        </div>
                        <div
                          className={cn(css.field, css.hasChildrenInOneLine)}
                        >
                          <div className={css.field__label}>판매자</div>
                          <div className={css.field__value}>
                            {claimData?.sellerName || '-'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={css.reasonSelectWrapper}>
                      <Field
                        name={this.fields.cancelReason}
                        validate={composeValidators(required)}
                      >
                        {({ input, meta }) => {
                          return (
                            <>
                              <Select
                                placeholder="취소 사유를 선택해주세요."
                                options={cancelReasonOptions}
                                value={cancelReasonOptions.find(
                                  o =>
                                    o.value === values[this.fields.cancelReason]
                                )}
                                onChange={({ value }) => {
                                  this.handleChangeReason({
                                    reasonSelected: value,
                                    formApi,
                                  });
                                }}
                                styles={{ height: '45px' }}
                              />
                              {meta.submitFailed && meta.error && (
                                <div className={css.errorMsg}>{meta.error}</div>
                              )}
                            </>
                          );
                        }}
                      </Field>
                    </div>

                    <div className={css.reasonTextareaWrapper}>
                      <Field
                        name={this.fields.cancelReasonText}
                        validate={requiredWithMessage(
                          '취소 사유를 간략히 적어주세요.'
                        )}
                      >
                        {({ input, meta }) => (
                          <>
                            <TextArea
                              placeholder="취소 사유를 간략히 적어주세요."
                              onChange={input.onChange}
                              initialValue={
                                values[this.fields.cancelReasonText]
                              }
                              style={{ height: '120px' }}
                              isInputSizeVisible={false}
                            />
                            {meta.submitFailed && meta.error && (
                              <div className={css.errorMsg}>{meta.error}</div>
                            )}
                          </>
                        )}
                      </Field>
                    </div>
                  </div>

                  {orderClaimForm.isRefundEnabled && (
                    <div className={css.refundFormWrap}>
                      {/* 환불 계좌정보 */}
                      <RefundAccountInfoForm
                        isCreate={this.getIsCreate()}
                        fields={this.fields}
                        formApi={formApi}
                      />
                    </div>
                  )}

                  {isRefundInfoVisible && <RefundInfo />}

                  <SubmitButtonWrapper>
                    <CancelButton
                      onClick={
                        this.props.orderClaimList.redirectToOrderClaimList
                      }
                    >
                      취소
                    </CancelButton>
                    <SubmitButton disabled={!_.isEmpty(errors)}>
                      주문취소 신청
                    </SubmitButton>
                  </SubmitButtonWrapper>
                </form>
              </div>
            </DetailPageLayout>
          );
        }}
      />
    );
  }
}

export default OrderCancelForm;
