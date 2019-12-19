import React, { Component } from 'react';
import { withRouter } from 'next/router';
import css from 'components/mypage/order/OrderClaimForm.module.scss';
import cn from 'classnames';
import DetailPageLayout from 'components/layout/DetailPageLayout';
import SectionHeading from 'components/common/SectionHeading';
import { observer, inject } from 'mobx-react';
import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import QuantityControl from 'components/mypage/form/QuantityControl';
import DealOrdered from 'components/mypage/DealOrdered';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import RadioGroup from 'components/mypage/form/RadioGroup';
import tableCSS from 'components/mypage/form/KeyValueTable.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import NoInvoiceWarning from 'components/mypage/orderCancel/NoInvoiceWarning';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { Form, Field } from 'react-final-form';
import {
  composeValidators,
  notEmptyString,
  required,
  requiredWithMessage,
  maxValue,
} from 'childs/lib/common/finalFormValidators';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import {
  claimShippingPriceTypes,
  claimShippingPriceOptions,
} from 'childs/lib/constant/order/claimShippingPrice';
import isDev from 'childs/lib/common/isDev';
import { devLog } from 'childs/lib/common/devLog';
import {
  alreadySentTypes,
  alreadySentOptions,
} from 'childs/lib/constant/order/alreadySent';
import RefundInfo from 'components/mypage/orderCancel/RefundInfo';
import paymentMethod from 'childs/lib/constant/order/paymentMethod';
import FormButton from 'components/mypage/form/FormButton';
import accountService from 'childs/lib/API/order/accountService';
import { isFalsey } from 'childs/lib/common/isTruthy';
import RefundAccountInfoForm from 'components/mypage/orderCancel/RefundAccountInfoForm';
import TextArea from 'components/mypage/form/TextArea';
import _ from 'lodash';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';

/**
 * 주문 반품 신청 및 수정 페이지.
 */
@withScrollToTopOnMount
@withRouter
@inject('orderClaimForm', 'mypageAddress', 'alert')
@observer
class OrderReturnForm extends Component {
  // 폼 필드
  // http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/orderExchangeUsingPOST
  fields = {
    // body에 사용할 데이터
    claimShippingPriceType: 'claimShippingPriceType', // 반품 배송비 결제방식
    returnReason: 'returnReason', // 반품 사유
    returnReasonDetail: 'returnReasonDetail',
    invoiceNo: 'invoiceNo', // 송장번호
    quantity: 'quantity', // 수량
    shippingCompanyCode: 'shippingCompanyCode', // 택배사

    // TODO:무통장 입금시 환불 계좌정보. 수정시에는 넣지 않고 생성시에만 넣을 수 있다.
    refundBankCode: 'refundBankCode', // 은행코드
    refundBankAccountNumber: 'refundBankAccountNumber', // 계좌번호
    refundBankAccountOwner: 'refundBankAccountOwner', // 예금주
    isRefundAccountChecked: 'isRefundAccountChecked', // 환불계좌가 확인되었는지?

    // 기타 필드. UI에 표시되지 않는 것 있음
    isAlreadySent: 'isAlreadySent', // 이미 발송?
    isUserFault: 'isUserFault', // 반품배송비 부담을 누구에게 줄 것인지
  };

  // form 필드 기본값
  defaultInitialValues = {
    // body
    claimShippingPriceType: null,
    returnReason: null,
    returnReasonDetail: null,
    invoiceNo: null, // number
    quantity: 1,
    shippingCompanyCode: null,
    refundBankCode: null,
    refundBankAccountNumber: null,
    refundBankAccountOwner: null,

    // 기타 값
    isAlreadySent: alreadySentTypes.YES,
    isUserFault: null,
    isRefundAccountChecked: true, //  신청시에만 false로 초기화
  };

  /**
   * 반품 신청 request body
   */
  defaultBody = {
    claimShippingPriceType: null,
    invoiceNo: null,
    quantity: null,
    returnReason: null,
    returnReasonDetail: null,
    shippingCompanyCode: null,
  };

  get orderProdGroupId() {
    return this.props.router?.query.orderProdGroupId;
  }

  get orderClaimId() {
    return this.props.router?.query.orderClaimId;
  }

  constructor(props) {
    super(props);
    this.state = {
      initialValues: Object.assign({}, this.defaultInitialValues),
      isMyAddressModalOpen: false, // 내 배송지 선택 모달
    };
  }

  /**
   * 신청시에는 클레임 아이디가 없다
   */
  getIsCreate = () => {
    return isFalsey(this.props.router?.query.orderClaimId);
  };

  componentDidMount() {
    // 폼 데이터 초기화
    this.initFormValues();

    // 배송지 목록 가져오기
    this.props.mypageAddress.getAddressList();
  }

  componentWillUnmount() {
    if (!isDev) {
      this.props.orderClaimForm.resetClaimData();
    }
  }

  initFormValues = () => {
    const { query } = this.props.router;
    const { orderClaimForm } = this.props;

    // 신청 관련 데이터 가져오기
    orderClaimForm.setClaimId({
      orderProdGroupId: query.orderProdGroupId,
      orderClaimId: query.orderClaimId,
    });

    const job = (claimData = {}) => {
      const initValues = this.getIsCreate()
        ? // 신청서 등록 초기화 데이터
          {
            ...this.defaultInitialValues,
            quantity: claimData.quantity, // 구입한 전체 수량.
            isRefundAccountChecked: null, // 기본적으로 계좌 확인 안됨 상태
          }
        : // 신청서 수정 초기화 데이터
          {
            // API 데이터
            claimShippingPriceType: claimData?.returnShippingPriceType,
            returnReason: claimData?.returnReason,
            returnReasonDetail: claimData?.returnReasonDetail,
            quantity: claimData?.quantity, // * 수정시에는 수량 변경 불가
            invoiceNo: claimData?.returnPickingInvoiceNo,
            shippingCompanyCode: claimData?.returnPickingShipCompany,

            // UI 전용
            isAlreadySent: !_.isNil(claimData?.returnPickingInvoiceNo)
              ? alreadySentTypes.YES
              : alreadySentTypes.NO,
            isUserFault: orderClaimForm.isClaimReasonUserFault,
          };

      // 폼 초기값 설정
      this.setState({
        initialValues: initValues,
      });

      // 반품 환불예상금액 가져오기. 최초에 클레임 데이터(최대값)으로 계산
      orderClaimForm.getRefundResponse({
        orderProdGroupId: claimData?.orderProdGroupId,
        quantity: claimData?.quantity,
      });
    };

    // 클레임 데이터를 가져온 후 job 실행
    this.props.orderClaimForm.pushJobForClaimData(job);
  };

  /**
   * 사유 변경
   */
  handleChangeReason = ({ reasonSelected, formApi, isUserFault, values }) => {
    // 필드 업데이트. 사용자가 직접 업데이트하지 않는 필드임
    formApi.change(this.fields.isUserFault, isUserFault);
    formApi.change(this.fields.returnReason, reasonSelected);
    formApi.change(this.fields.returnReasonDetail, null);

    // 판매자 귀책사유라면
    if (isUserFault) {
      if (
        _.isEmpty(values[this.fields.claimShippingPriceType]) ||
        _.isNil(values[this.fields.claimShippingPriceType])
      ) {
        // 반품배송지 결제방식 기본값을 변경
        formApi.change(
          this.fields.claimShippingPriceType,
          claimShippingPriceTypes.BOX
        );
      }
    } else {
      formApi.change(this.fields.claimShippingPriceType, '');
    }
  };

  handleChangeIsAlreadySent = ({ value, formApi }) => {
    // 이미 발송 X. 데이터 초기화
    if (value === alreadySentTypes.NO) {
      formApi.change(this.fields.shippingCompanyCode, null);
      formApi.change(this.fields.invoiceNo, null);
    }
  };

  /**
   * 배송지 목록 모달 열고 닫기
   */
  toggleOpenAddressListModal = () => {
    this.setState((state, props) => ({
      isMyAddressModalOpen: !state.isMyAddressModalOpen,
    }));
  };

  /**
   * 송장번호 입력 경고
   */
  isInvoiceWarningVisible({ values }) {
    return (
      values[this.fields.isAlreadySent] === alreadySentTypes.YES &&
      (_.isNil(values[this.fields.invoiceNo]) ||
        _.isEmpty(values[this.fields.invoiceNo]))
    );
  }

  /**
   * 수량 변경
   */
  handleChangeQuantity = quantity => {
    // 샹금액 변경
    this.props.orderClaimForm.getRefundResponse({
      orderProdGroupId: this.orderProdGroupId,
      quantity,
    });
  };

  /**
   * 환불 계좌정보 입력 양식 및 저장된 정보 표시
   *
   * 무통장 입금 결제일때 입력 가능하다.
   */
  renderRefundAccountInfo = ({ formApi, values }) => {
    const { orderClaimForm } = this.props;
    const claimData = orderClaimForm.claimData;

    // 환불 계좌정보 입력 양식. 반품 신청에서 표시된다.
    const isRefundAccountFormVisible =
      this.getIsCreate() &&
      claimData?.paymentMethod === paymentMethod.VBANK.code;

    // 저장된 환불 계좌정보 표시 여부. 반품 신청 수정에서 표시된다.
    const isRefundAccontInfoVisible =
      !this.getIsCreate() &&
      claimData?.paymentMethod === paymentMethod.VBANK.code;

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
                      name={this.fields.refundBankCode}
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
                              formApi.change(
                                this.fields.isRefundAccountChecked,
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
                      name={this.fields.refundBankAccountNumber}
                      validate={composeValidators(required, notEmptyString)}
                    >
                      {({ input, meta }) => (
                        <>
                          <Input
                            initialValue={input.value}
                            onChange={value => {
                              input.onChange(value);
                              // 변경될때마다 계좌가 확인 안됨으로 변경
                              formApi.change(
                                this.fields.isRefundAccountChecked,
                                false
                              );
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
                      name={this.fields.refundBankAccountOwner}
                      validate={composeValidators(required, notEmptyString)}
                    >
                      {props => (
                        <div>
                          <Input
                            initialValue={props.input.value}
                            onChange={value => {
                              props.input.onChange(value);
                              // 변경될때마다 계좌가 확인 안됨으로 변경
                              formApi.change(
                                this.fields.isRefundAccountChecked,
                                false
                              );
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
                    name={this.fields.isRefundAccountChecked}
                    validate={value => {
                      return !!values[this.fields.refundBankAccountNumber] &&
                        !!values[this.fields.refundBankCode] &&
                        !!values[this.fields.refundBankAccountOwner] &&
                        value === true
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
                              this.handleClickCheckAccount({ formApi });
                            }}
                          >
                            {!meta.error ? '확인 완료' : '계좌확인'}
                          </FormButton>

                          {meta.dirty && meta.error ? (
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
  };

  /**
   * 환별 계좌 유효성 확인
   */
  handleClickCheckAccount = ({ formApi }) => {
    const { values } = formApi.getState();
    const refundBankCode = values[this.fields.refundBankCode];
    const refundBankAccountNumber = values[this.fields.refundBankAccountNumber];
    const refundBankAccountOwner = values[this.fields.refundBankAccountOwner];

    if (
      !refundBankCode ||
      !refundBankAccountNumber ||
      !refundBankAccountOwner
    ) {
      // 필요한 정보를 입력하지 않았다면 오류 처리
      formApi.change(this.fields.isRefundAccountChecked, false);
    } else {
      accountService
        .accountCheck({
          bankCode: refundBankCode,
          bankNumber: refundBankAccountNumber,
          name: refundBankAccountOwner,
        })
        .then(({ data }) => {
          devLog(`accountCheck`, data);

          if (data.data?.result === true) {
            formApi.change(this.fields.isRefundAccountChecked, true);
          } else {
            formApi.change(this.fields.isRefundAccountChecked, false);
          }
        })
        .catch(e => {
          console.error(e);
          formApi.change(this.fields.isRefundAccountChecked, false);
        });
    }
  };

  /**
   * 반품 신청 API 호출
   */
  handleSubmit = (values = {}) => {
    const { orderProdGroupId, orderClaimId } = this.props.router.query;

    const body = Object.assign({}, this.defaultBody, {
      claimShippingPriceType: values[this.fields.claimShippingPriceType],
      invoiceNo: values[this.fields.invoiceNo],
      quantity: values[this.fields.quantity],
      returnReason: values[this.fields.returnReason],
      returnReasonDetail: values[this.fields.returnReasonDetail],
      shippingCompanyCode: values[this.fields.shippingCompanyCode],
    });

    if (this.getIsCreate()) {
      this.props.orderClaimForm.createOrderReturn(
        Object.assign(body, {
          orderProdGroupId,

          // * 신청시에는 환불계좌정보 넣는다
          refundBankCode: values[this.fields.refundBankCode],
          refundBankAccountNumber: values[this.fields.refundBankAccountNumber],
          refundBankAccountOwner: values[this.fields.refundBankAccountOwner],
        })
      );
    } else {
      this.props.orderClaimForm.updateOrderReturn(
        Object.assign(body, { orderClaimId })
      );
    }
  };

  render() {
    const { orderClaimForm } = this.props;
    const claimData = orderClaimForm.claimData || {};

    return (
      <Form
        onSubmit={this.handleSubmit}
        initialValues={this.state.initialValues}
        render={({ handleSubmit, form: formApi }) => {
          const formState = formApi.getState();
          const { values, errors, initialValues } = formState;
          devLog(`formState values`, values);
          devLog(`formState errors`, errors);

          const returnReasonLabel = orderClaimForm.returnReasonOptions.find(
            o => o.value === values[this.fields.returnReason]
          )?.label;

          return (
            <DetailPageLayout pageTitle={'반품 신청'}>
              <form onSubmit={handleSubmit}>
                <div className={css.wrap}>
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
                          <div className={css.field__label}>반품수량</div>
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
                        name={this.fields.returnReason}
                        validate={composeValidators(required)}
                      >
                        {({ input, meta }) => {
                          return (
                            <>
                              <Select
                                placeholder="반품 사유를 선택해주세요."
                                options={orderClaimForm.returnReasonOptions}
                                value={orderClaimForm.returnReasonOptions.find(
                                  o =>
                                    o.value === values[this.fields.returnReason]
                                )}
                                onChange={({ value, userFault }) => {
                                  this.handleChangeReason({
                                    reasonSelected: value,
                                    formApi,
                                    isUserFault: userFault,
                                    values,
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
                        name={this.fields.returnReasonDetail}
                        validate={requiredWithMessage(
                          '반품 사유를 간략히 적어주세요.'
                        )}
                      >
                        {({ input, meta }) => (
                          <>
                            <TextArea
                              placeholder="반품 사유를 간략히 적어주세요."
                              onChange={input.onChange}
                              initialValue={
                                values[this.fields.returnReasonDetail]
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

                  <div className={css.formSection}>
                    <MypageSectionTitle>반품 반송지</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <div>{orderClaimForm.sellerReturnAddressInView}</div>
                      <div>
                        <span>
                          {addHyphenToMobile(claimData?.sellerReturnTelephone)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <MypageSectionTitle>반품 발송 여부</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <div>이미 발송하셨나요?</div>

                      <div className={css.radioWrapper}>
                        <Field name={this.fields.isAlreadySent}>
                          {props => {
                            return (
                              <RadioGroup
                                name={this.fields.isAlreadySent}
                                options={alreadySentOptions}
                                onChange={value => {
                                  props.input.onChange(value);

                                  this.handleChangeIsAlreadySent({
                                    formApi,
                                    value,
                                  });
                                }}
                                initialValue={props.input.value}
                                isSingleItemInLine
                              />
                            );
                          }}
                        </Field>
                      </div>

                      {/* 이미 배송했다면 송장번호 입력 */}
                      {values[this.fields.isAlreadySent] ===
                        alreadySentTypes.YES && (
                        <>
                          <div className={css.reasonSelectWrapper}>
                            <Field
                              name={this.fields.shippingCompanyCode}
                              validate={
                                values[this.fields.isAlreadySent] ===
                                alreadySentTypes.YES
                                  ? required
                                  : undefined
                              }
                            >
                              {props => (
                                <Select
                                  placeholder="택배사를 선택해주세요"
                                  options={orderClaimForm.shipCompanyOptions}
                                  onChange={option => {
                                    props.input.onChange(option.value);
                                  }}
                                  value={orderClaimForm.shipCompanyOptions.find(
                                    o => o.value === props.input.value
                                  )}
                                />
                              )}
                            </Field>
                          </div>
                          <div className={css.reasonTextareaWrapper}>
                            <Field
                              name={this.fields.invoiceNo}
                              validate={
                                values[this.fields.isAlreadySent] ===
                                alreadySentTypes.YES
                                  ? required
                                  : undefined
                              }
                            >
                              {props => (
                                <Input
                                  placeholder="송장번호를 입력해주세요."
                                  type="number"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[this.fields.invoiceNo]
                                  }
                                />
                              )}
                            </Field>
                          </div>
                        </>
                      )}

                      {/* 이미 보냈을 때 송장번호 입력 안내  */}
                      {this.isInvoiceWarningVisible({ values }) && (
                        <NoInvoiceWarning />
                      )}
                    </div>
                  </div>

                  <div className={css.formSection}>
                    <MypageSectionTitle>반품 배송비 결제</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <Field name={this.fields.isUserFault}>
                        {({ input }) =>
                          input.value === null ? (
                            <div />
                          ) : input.value === true ? (
                            <div>
                              반품사유 "<b>{returnReasonLabel}</b>
                              "으로 인해 반품배송비{' '}
                              <b>
                                {addCommaToNum(claimData?.returnShippingPrice)}
                              </b>
                              원을{' '}
                              <b>{claimData?.returnShippingPriceTypeText}</b>
                              으로 구매자가 부담합니다.
                            </div>
                          ) : (
                            <div>판매자가 부담합니다.</div>
                          )
                        }
                      </Field>
                    </div>

                    {/* 판매자 귀책사유 */}
                    <div className={css.radioWrapper}>
                      {values[this.fields.isUserFault] && (
                        <Field
                          name={this.fields.claimShippingPriceType}
                          validate={required}
                        >
                          {props => (
                            <RadioGroup
                              name={this.fields.claimShippingPriceType}
                              options={claimShippingPriceOptions}
                              onChange={props.input.onChange}
                              initialValue={
                                values[this.fields.claimShippingPriceType]
                              }
                              isSingleItemInLine
                            />
                          )}
                        </Field>
                      )}
                    </div>
                  </div>

                  {/* 환불 계좌정보 . 반품일때는 무조건 가능*/}
                  {orderClaimForm.isRefundEnabled && (
                    <div className={css.formSection}>
                      <MypageSectionTitle>환불 계좌정보</MypageSectionTitle>
                      <RefundAccountInfoForm
                        isCreate={this.getIsCreate()}
                        fields={this.fields}
                        formApi={formApi}
                      />
                    </div>
                  )}

                  <RefundInfo />

                  <SubmitButtonWrapper
                    fixedToBottom
                    wrapperStyle={{ marginTop: '60px' }}
                  >
                    <CancelButton onClick={() => this.props.router.back()}>
                      취소
                    </CancelButton>
                    <SubmitButton disabled={!_.isEmpty(errors)}>
                      <span>반품 신청</span>
                      {!this.getIsCreate() && <span> 수정</span>}
                    </SubmitButton>
                  </SubmitButtonWrapper>
                </div>
              </form>
            </DetailPageLayout>
          );
        }}
      />
    );
  }
}

export default OrderReturnForm;
