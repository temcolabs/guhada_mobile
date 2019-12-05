import React, { Component } from 'react';
import css from './OrderCancelForm.module.scss';
import MypageLayout from 'components/mypage/MypageLayout';
import SectionHeading from 'components/common/SectionHeading';
import sectionHeadingCss from 'components/common/SectionHeading.module.scss';
import { observer, inject } from 'mobx-react';
import Table from 'components/mypage/Table';
import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import QuantityControl from 'components/mypage/form/QuantityControl';
import DealOrdered from 'components/mypage/DealOrdered';
import { withRouter } from 'next/router';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import RefundInfo from 'components/mypage/orderCancel/RefundInfo';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import tableCSS from 'components/mypage/form/KeyValueTable.module.scss';
import claimFormCSS from 'components/mypage/order/OrderClaimForm.module.scss';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { Form, Field } from 'react-final-form';
import {
  composeValidators,
  maxValue,
  required,
  requiredWithMessage,
} from 'childs/lib/common/finalFormValidators';
import isDev from 'childs/lib/common/isDev';
import purchaseStatus from 'childs/lib/constant/order/purchaseStatus';
import paymentMethod from 'childs/lib/constant/order/paymentMethod';
import RefundAccountInfoForm from 'components/mypage/orderCancel/RefundAccountInfoForm';
import { isFalsey } from 'childs/lib/common/isTruthy';
import { toJS } from 'mobx';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';

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

    // ? 로그를 찍지 않으면 RefundInfo에 업데이트된 refundResponse가 전달되지 않음.
    devLog('refundResponse', toJS(this.props.orderClaimForm.refundResponse));

    devLog(
      'orderClaimFormorderClaimFormorderClaimForm',
      toJS(this.props.orderClaimForm)
    );
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
            <MypageLayout
              isMenuVisibile={false}
              headerShape={'mypageSimple'}
              pageTitle={'주문상품 취소 신청'}
            >
              <form onSubmit={handleSubmit}>
                <Table className={claimFormCSS.orderItemTable}>
                  <thead>
                    <tr>
                      <th data-name="deal">상품 정보</th>
                      <th data-name="quantity">취소수량</th>
                      <th data-name="seller">판매자</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <DealOrdered
                          order={orderClaimForm.claimData}
                          isSmallImage={false}
                          isBrandAndProductInSameLine={false}
                          hasOptionQuantity={true}
                          isPurchaseStatusVisible
                          isPriceVisible
                        />
                      </td>
                      <td>
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
                                  this.state.initialValues[this.fields.quantity]
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
                      </td>
                      <td>{claimData?.sellerName || '-'}</td>
                    </tr>
                  </tbody>
                </Table>
                <div className={css.reasonWrapper}>
                  <KeyValueTable>
                    <tr>
                      <td>사유 선택</td>
                      <td>
                        <div className={tableCSS.smallInputWrapper}>
                          <Field
                            name={this.fields.cancelReason}
                            validate={composeValidators(required)}
                          >
                            {({ input, meta }) => {
                              return (
                                <>
                                  <Select
                                    placeholder="선택해주세요."
                                    options={cancelReasonOptions}
                                    value={cancelReasonOptions.find(
                                      o =>
                                        o.value ===
                                        values[this.fields.cancelReason]
                                    )}
                                    onChange={({ value }) => {
                                      this.handleChangeReason({
                                        reasonSelected: value,
                                        formApi,
                                      });
                                    }}
                                  />
                                  {meta.submitFailed && meta.error && (
                                    <div data-name="error">{meta.error}</div>
                                  )}
                                </>
                              );
                            }}
                          </Field>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>사유 상세</td>
                      <td>
                        <Field
                          name={this.fields.cancelReasonText}
                          validate={requiredWithMessage(
                            '취소 사유를 간략히 적어주세요.'
                          )}
                        >
                          {({ input, meta }) => (
                            <>
                              <Input
                                placeholder="간략히 적어주세요."
                                onChange={input.onChange}
                                initialValue={
                                  values[this.fields.cancelReasonText]
                                }
                              />
                              {meta.submitFailed && meta.error && (
                                <div data-name="error">{meta.error}</div>
                              )}
                            </>
                          )}
                        </Field>
                      </td>
                    </tr>
                  </KeyValueTable>
                </div>

                {/* 환불 계좌정보 */}
                <RefundAccountInfoForm
                  isRefundEnabled={
                    // 입금 대기중이 아니고
                    claimData?.orderStatus !==
                      purchaseStatus.WAITING_PAYMENT.code &&
                    // 무통장 입금
                    claimData?.paymentMethod === paymentMethod.VBANK.code
                  }
                  orderClaimForm={orderClaimForm}
                  isCreate={this.getIsCreate()}
                  fields={this.fields}
                  formApi={formApi}
                />

                {isRefundInfoVisible && (
                  <>
                    <SectionHeading
                      title={() => {
                        return (
                          <>
                            <span>환불 정보</span>
                            <span className={sectionHeadingCss.guideText}>
                              환불확정금액은 아래 예상금액과 다를 수 있습니다.
                            </span>
                          </>
                        );
                      }}
                    />

                    <RefundInfo
                      isRefundExpectation={true}
                      refundResponse={orderClaimForm.refundResponse}
                      paymentMethodText={
                        claimData?.paymentMethodText || claimData?.paymentMethod
                      }
                    />
                  </>
                )}

                <SubmitButtonWrapper wrapperStyle={{ marginTop: '60px' }}>
                  <CancelButton
                    onClick={this.props.orderClaimList.redirectToOrderClaimList}
                  >
                    취소
                  </CancelButton>
                  <SubmitButton disabled={!_.isEmpty(errors)}>
                    주문취소 신청
                  </SubmitButton>
                </SubmitButtonWrapper>
              </form>
            </MypageLayout>
          );
        }}
      />
    );
  }
}

export default OrderCancelForm;
