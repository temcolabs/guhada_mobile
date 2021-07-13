import { Component } from 'react';
import _ from 'lodash';
import cn from 'classnames';
import { Form, Field } from 'react-final-form';
import { observer, inject } from 'mobx-react';
import DetailPageLayout from 'components/layout/DetailPageLayout';
import css from 'components/mypage/order/OrderClaimForm.module.scss';
import Input from 'components/mypage/form/Input';
import Select from 'components/mypage/form/Select';
import QuantityControl from 'components/mypage/form/QuantityControl';
import DealOrdered from 'components/mypage/DealOrdered';
import { withRouter } from 'next/router';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import RadioGroup from 'components/mypage/form/RadioGroup';
import addCommaToNum from 'lib/common/addCommaToNum';
import NoInvoiceWarning from 'components/mypage/orderCancel/NoInvoiceWarning';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import addHyphenToMobile from 'lib/string/addHyphenToMobile';
import {
  claimShippingPriceTypes,
  claimShippingPriceOptions,
} from 'lib/constant/order/claimShippingPrice';

import isDev from 'lib/common/isDev';
import { devLog } from 'lib/common/devLog';
import {
  alreadySentTypes,
  alreadySentOptions,
} from 'lib/constant/order/alreadySent';
// import SelectMyAddressModal from 'components/common/modal/SelectMyAddressModal';
import openDaumAddressSearch from 'lib/common/openDaumAddressSearch';
import { isFalsey } from 'lib/common/isTruthy';
import {
  composeValidators,
  maxValue,
  required,
  requiredWithMessage,
} from 'lib/common/finalFormValidators';
import TextArea from 'components/mypage/form/TextArea';
import MypageSectionTitle from 'components/mypage/MypageSectionTitle';
import MypageAddressModal from 'components/mypage/address/MypageAddressModal';

/**
 * 주문 교환 신청 및 수정 페이지.
 */
@withScrollToTopOnMount
@withRouter
@inject('orderClaimForm', 'mypageAddress', 'alert')
@observer
class OrderExchangeForm extends Component {
  // 폼 필드
  // http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM/orderExchangeUsingPOST
  fields = {
    // body에 사용할 데이터
    claimShippingPriceType: 'claimShippingPriceType', // 교환 배송비 결제방식
    exchangeReason: 'exchangeReason', // 교환 사유
    exchangeReasonDetail: 'exchangeReasonDetail',
    invoiceNo: 'invoiceNo', // 송장번호
    quantity: 'quantity', // 수량
    shippingCompanyCode: 'shippingCompanyCode', // 택배사

    // body의 exchangeShippingAddress 객체에 들어갈 필드
    defaultAddress: 'defaultAddress', // 기본 주소 여부
    address: 'address', // 주소검색 결과
    roadAddress: 'roadAddress', // 도로명 주소
    detailAddress: 'detailAddress', // 상세 주소
    recipientMobile: 'recipientMobile', // 받는 사람 전화번호(휴대폰)
    recipientName: 'recipientName', // 이름
    safetyMobile: 'safetyMobile', // 안심번호 여부
    shippingMessage: 'shippingMessage', // 배송 메시지. 코드가 아니라 텍스트
    shippingName: 'shippingName', // 배송지 이름
    zip: 'zip', //. 우편번호

    // 기타 필드
    isAlreadySent: 'isAlreadySent', // 이미 발송?
    isUserFault: 'isUserFault', // 교환배송비 부담을 누구에게 줄 것인지
    shippingMessageType: 'shippingMessageType', // 배송 메시지 타입 (코드)
  };

  // form 필드 기본값
  defaultInitialValues = {
    // body
    claimShippingPriceType: null,
    exchangeReason: null,
    exchangeReasonDetail: null,
    invoiceNo: null, // number
    quantity: 1,
    shippingCompanyCode: null,
    address: null,
    defaultAddress: false,
    detailAddress: null,
    recipientMobile: null,
    recipientName: null,
    roadAddress: null,
    safetyMobile: false,
    shippingMessage: null,
    shippingName: null,
    zip: null,

    // 기타 값
    isAlreadySent: alreadySentTypes.YES,
    isUserFault: null,
    shippingMessageType: null,
  };

  /**
   * 교환 신청 request body
   */
  defaultBody = {
    claimShippingPriceType: null,
    exchangeReason: null,
    exchangeReasonDetail: '',
    invoiceNo: null, // number

    quantity: 1,
    shippingCompanyCode: null,
    exchangeShippingAddress: {
      address: null,
      defaultAddress: true,
      detailAddress: null,
      recipientMobile: null,
      recipientName: null,
      roadAddress: null,
      safetyMobile: false,
      shippingMessage: null,
      shippingName: null,
      zip: null,
    },
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
      initialValues: { ...this.defaultInitialValues },
    };
  }

  componentDidMount() {
    // 폼 데이터 초기화
    this.initFormValues();

    // 배송지 목록 가져오기
    this.props.mypageAddress.getAddressList();
  }

  componentWillUnmount() {
    // 개발 모드에서 unmount시 reset 해버리면 HMR을 활용할 수 없음. 매번 새로고침 해야함
    if (!isDev) {
      this.props.orderClaimForm.resetClaimData();
    }
  }

  /**
   * 신청시에는 클레임 아이디가 없다
   */
  getIsCreate = () => {
    const isCreate = isFalsey(this.orderClaimId);
    return isCreate;
  };

  /**
   * 클레임 정보 사용해서 폼 초기화
   */
  initFormValues = () => {
    const { orderProdGroupId, orderClaimId } = this.props.router.query;
    const { orderClaimForm } = this.props;

    // 신청 관련 데이터 가져오기
    orderClaimForm.setClaimId({
      orderProdGroupId,
      orderClaimId,
    });

    const job = (claimData = {}) => {
      // 서버에 저장된 교환 배송 메시지로 어떤 타입인지 확인한다.
      const shippingMessageTypeSaved = this.props.orderClaimForm.shippingMessageOptions?.find(
        (o) => o.label === claimData?.exchangeBuyerShippingMessage
      )?.value;

      const initValues = this.getIsCreate()
        ? // 신청서 등록 초기화 데이터
          {
            ...this.defaultInitialValues,
            quantity: claimData.quantity,
            defaultAddress: false,
            address: claimData?.address,
            roadAddress: claimData?.receiverRoadAddress,
            detailAddress: claimData?.receiverAddressDetail,
            recipientMobile: claimData?.receiverPhone,
            recipientName: claimData?.receiverName,
            shippingMessage: claimData?.receiverMessage,
            shippingName: claimData?.receiverAddressName,
            zip: claimData?.receiverZipcode,
            safetyMobile: false,
          }
        : // 신청서 수정 초기화 데이터
          {
            // UI 전용
            isAlreadySent: !_.isNil(claimData?.exchangePickingInvoiceNo)
              ? alreadySentTypes.YES
              : alreadySentTypes.NO,
            isUserFault: orderClaimForm.isClaimReasonUserFault,

            shippingMessageType:
              shippingMessageTypeSaved ||
              // 저장된 타입이 없다면 '직접 입력'으로 저장했다고 판단한다
              this.props.orderClaimForm.shippingMessageOptions?.find(
                (o) => o.value === 'SELF'
              )?.value,

            // API 데이터
            exchangeReason: claimData?.exchangeReason,
            exchangeReasonDetail: claimData?.exchangeReasonDetail,
            quantity: claimData?.quantity,
            defaultAddress: false,
            claimShippingPriceType: claimData?.exchangeShippingPriceType,
            address: claimData?.exchangeBuyerAddress,
            roadAddress: claimData?.exchangeBuyerRoadAddress,
            detailAddress: claimData?.exchangeBuyerDetailAddress,
            recipientMobile: claimData?.exchangeBuyerRecipientMobile,
            recipientName: claimData?.exchangeBuyerRecipientName,
            shippingMessage: claimData?.exchangeBuyerShippingMessage, // 직접 입력한 배송 메시지.
            shippingName: claimData?.exchangeBuyerAddressName,
            zip: claimData?.exchangeBuyerZip,
            shippingCompanyCode: claimData?.exchangePickingShipCompany,
            invoiceNo: claimData?.exchangePickingInvoiceNo,
            safetyMobile: false,
          };

      // 폼 초기값 설정
      this.setState({ initialValues: initValues });
    };

    // 클레임 데이터를 가져온 후 job 실행
    this.props.orderClaimForm.pushJobForClaimData(job);
  };

  /**
   * 사유 변경
   */
  handleChangeReason = ({ reasonSelected, formApi, isUserFault, values }) => {
    // 필드 업데이트.
    formApi.change(this.fields.isUserFault, isUserFault);
    formApi.change(this.fields.exchangeReason, reasonSelected);
    formApi.change(this.fields.exchangeReasonDetail, null);

    // 판매자 귀책사유라면
    if (isUserFault) {
      if (
        _.isEmpty(values[this.fields.claimShippingPriceType]) ||
        _.isNil(values[this.fields.claimShippingPriceType])
      ) {
        // 교환배송지 결제방식 기본값을 변경
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
   * 배송 메시지 선택
   */
  handleChangeShippingMessage = ({ option, formApi, fieldProps }) => {
    // 배송 메시지 텍스트
    fieldProps.input.onChange(option.label);

    // 배송 메시지 타입
    formApi.change(this.fields.shippingMessageType, option.value);

    if (option.value === 'SELF') {
      // 직접 입력이면 상세 메시지 초기화
      formApi.change(this.fields.shippingMessage, '');
    } else {
      // 옵션을 선택했다면 라벨을 저장
      formApi.change(this.fields.shippingMessage, option.label);
    }
  };

  /**
   * 배송지 변경 모달 열기
   */
  openEditOrderAddressModal = (formValues) => {
    const { claimData } = this.props.orderClaimForm;

    this.props.mypageAddress.openEditOrderAddressModal({
      purchaseId: claimData.purchaseId,
      address: {
        addressBasic: formValues.address,
        addressDetail: formValues.detailAddress,
        roadAddress: formValues.roadAddress,
        phone: formValues.recipientMobile,
        receiverName: formValues.recipientName,
        addressname: formValues.shippingName,
        zipcode: formValues.zip,
      },
    });
  };

  /**
   * 배송지 목록 모달에서 주소 선택
   */
  handleSelectAddressFromListModal = ({
    address = {
      address: null,
      defaultAddress: true,
      detailAddress: null,
      recipientMobile: null,
      recipientName: null,
      roadAddress: null,
      safetyMobile: false,
      shippingMessage: null,
      shippingName: null,
      zip: null,
    },
    formApi,
  } = {}) => {
    formApi.batch(() => {
      formApi.change(this.fields.defaultAddress, address.defaultAddress); // 기본 주소 여부
      formApi.change(this.fields.address, address.address); // 주소검색 결과
      formApi.change(this.fields.roadAddress, address.roadAddress); // 도로명 주소
      formApi.change(this.fields.detailAddress, address.detailAddress); // 상세 주소
      formApi.change(this.fields.recipientMobile, address.recipientMobile); // 받는 사람 전화번호(휴대폰)
      formApi.change(this.fields.recipientName, address.recipientName); // 이름
      formApi.change(this.fields.safetyMobile, address.safetyMobile); // 안심번호 여부
      formApi.change(this.fields.shippingMessage, address.shippingMessage); // 배송 메시지. 코드가 아니라 텍스트
      formApi.change(this.fields.shippingName, address.shippingName); // 배송지 이름
      formApi.change(this.fields.zip, address.zip); //. 우편번호
    });
  };

  handleSelectDaumAddressSearchResult = ({ data, formApi }) => {
    devLog(`[handleSelectDaumAddressSearchResult] data`, data);

    formApi.change(this.fields.address, data.jibunAddress); // 번지 주소
    formApi.change(this.fields.roadAddress, data.roadAddress); // 도로명 주소
    formApi.change(this.fields.zip, data.zonecode); // 우편번호(신규 5자리)
  };

  /**
   * 입력 폼의 주소 데이터로 '배송주소' 필드에 표시할 전체 주소를 구성한다.
   */
  getFullAddressString = ({
    zip = '',
    detailAddress = '',
    roadAddress = '',
    address = '',
  } = {}) => {
    return `[${zip}] ${roadAddress || address || ''} ${detailAddress || ''}`;
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
   * 배송지 타입이 신규 배송지가 아니라면, 기존에 있는 데이터로 배송 정보를 렌더링한다.
   */
  renderAddressInfoSaved = ({ values }) => {
    return (
      <>
        <div className={css.shippingName}>
          {values[this.fields.shippingName]}
        </div>
        <div>
          {this.getFullAddressString({
            zip: values[this.fields.zip],
            detailAddress: values[this.fields.detailAddress],
            roadAddress: values[this.fields.roadAddress],
            address: values[this.fields.address],
          })}
        </div>
        <div>
          <span>{values[this.fields.recipientName]} </span>
          <span>{addHyphenToMobile(values[this.fields.recipientMobile])}</span>
        </div>
      </>
    );
  };

  /**
   * 배송지명 타입이 신규 배송지라면, 입력필드를 렌더링한다.
   * Form 의 render props 안에 들어간다.
   */
  renderNewAddressForm({ values, formApi }) {
    return (
      <>
        <div className={css.inputWrapper}>
          <Field name={this.fields.shippingName}>
            {(props) => (
              <Input
                initialValue={props.input.value}
                onChange={props.input.onChange}
                placeholder="배송지 이름을 입력해주세요"
              />
            )}
          </Field>
        </div>

        <div className={css.inputWrapper}>
          <Input
            disabled
            placeholder="주소는 우편번호 찾기를 통해 입력해주세요."
            initialValue={
              // 도로명 주소를 우선해서 초기값을 넣어준다
              values[this.fields.roadAddress] || values[this.fields.address]
            }
          />
          <button
            type="button"
            className={css.addressListButton}
            onClick={() =>
              openDaumAddressSearch({
                onComplete: (data) =>
                  this.handleSelectDaumAddressSearchResult({
                    data,
                    formApi,
                  }),
              })
            }
          >
            우편번호 찾기
          </button>
        </div>
        {/*  상세 주소 */}
        <div className={css.inputWrapper}>
          <Field name={this.fields.detailAddress}>
            {(props) => (
              <Input
                initialValue={props.input.value}
                onChange={props.input.onChange}
                placeholder="상세 주소를 입력해주세요."
              />
            )}
          </Field>
        </div>
        {/* 수령인 */}
        <div className={css.inputWrapper}>
          <Field name={this.fields.recipientName}>
            {(props) => (
              <Input
                placeholder="수령인을 입력해주세요"
                initialValue={props.input.value}
                onChange={props.input.onChange}
              />
            )}
          </Field>
        </div>
        {/* 연락처 */}
        <div className={css.inputWrapper}>
          <Field name={this.fields.recipientMobile}>
            {(props) => (
              <Input
                placeholder="연락처를 입력해주세요"
                initialValue={props.input.value}
                onChange={props.input.onChange}
                formatter={addHyphenToMobile}
              />
            )}
          </Field>
        </div>
      </>
    );
  }

  /**
   * 교환 신청 API 호출
   */
  handleSubmit = (values = {}) => {
    const { orderProdGroupId, orderClaimId } = this.props.router.query;

    // 배송지 주소가 있는지 확인
    const body = Object.assign({}, this.defaultBody, {
      claimShippingPriceType: values.claimShippingPriceType,
      exchangeReason: values.exchangeReason,
      exchangeReasonDetail: values.exchangeReasonDetail,
      invoiceNo: values.invoiceNo,
      quantity: values.quantity,
      shippingCompanyCode: values.shippingCompanyCode,
      exchangeShippingAddress: {
        address: values.address,
        defaultAddress: values.defaultAddress,
        detailAddress: values.detailAddress,
        recipientMobile: values.recipientMobile,
        recipientName: values.recipientName,
        roadAddress: values.roadAddress,
        safetyMobile: values.safetyMobile,
        shippingMessage: values.shippingMessage,
        shippingName: values.shippingName,
        zip: values.zip,
      },
    });

    if (this.getIsCreate()) {
      this.props.orderClaimForm.createOrderExchange(
        Object.assign(body, { orderProdGroupId })
      );
    } else {
      this.props.orderClaimForm.updateOrderExchange(
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

          const exchangeReasonLabel = orderClaimForm.exchangeReasonOptions.find(
            (o) => o.value === values[this.fields.exchangeReason]
          )?.label;

          return (
            <DetailPageLayout pageTitle={'교환 신청'}>
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
                    <DealOrdered
                      order={orderClaimForm.claimData}
                      isSmallImage={false}
                      isBrandAndProductInSameLine={false}
                      hasOptionQuantity={true}
                      isPurchaseStatusVisible
                      isPriceVisible
                    />

                    <div className={css.quantityControlWrapper}>
                      <div className={cn(css.field, css.hasChildrenInOneLine)}>
                        <div className={css.field__label}>교환수량</div>
                        <div className={css.field__value}>
                          <Field
                            name={this.fields.quantity}
                            validate={composeValidators(
                              maxValue(claimData?.quantity)
                            )}
                          >
                            {(props) => {
                              return (
                                <QuantityControl
                                  initialValue={
                                    this.state.initialValues[
                                      this.fields.quantity
                                    ]
                                  }
                                  max={claimData?.quantity}
                                  onChange={(value) => {
                                    props.input.onChange(value);
                                  }}
                                />
                              );
                            }}
                          </Field>
                        </div>
                      </div>
                      <div className={cn(css.field, css.hasChildrenInOneLine)}>
                        <div className={css.field__label}>판매자</div>
                        <div className={css.field__value}>
                          {claimData?.sellerName || '-'}
                        </div>
                      </div>
                    </div>

                    <div className={css.reasonSelectWrapper}>
                      <Field
                        name={this.fields.exchangeReason}
                        validate={composeValidators(required)}
                      >
                        {({ input, meta }) => {
                          return (
                            <>
                              <Select
                                placeholder="교환 사유를 선택해주세요."
                                options={orderClaimForm.exchangeReasonOptions}
                                value={orderClaimForm.exchangeReasonOptions.find(
                                  (o) =>
                                    o.value ===
                                    values[this.fields.exchangeReason]
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
                        name={this.fields.exchangeReasonDetail}
                        validate={requiredWithMessage(
                          '교환 사유를 간략히 적어주세요.'
                        )}
                      >
                        {({ input, meta }) => (
                          <>
                            <TextArea
                              placeholder="교환 사유를 간략히 적어주세요."
                              onChange={input.onChange}
                              initialValue={
                                values[this.fields.exchangeReasonDetail]
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
                    <MypageSectionTitle>교환 반송지</MypageSectionTitle>
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
                    <MypageSectionTitle>교환 발송 여부</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <div>이미 발송하셨나요?</div>

                      <div className={css.radioWrapper}>
                        <Field name={this.fields.isAlreadySent}>
                          {(props) => {
                            return (
                              <RadioGroup
                                name={this.fields.isAlreadySent}
                                options={alreadySentOptions}
                                onChange={(value) => {
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
                              {(props) => (
                                <Select
                                  placeholder="택배사를 선택해주세요"
                                  options={orderClaimForm.shipCompanyOptions}
                                  onChange={(option) => {
                                    props.input.onChange(option.value);
                                  }}
                                  value={orderClaimForm.shipCompanyOptions.find(
                                    (o) => o.value === props.input.value
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
                              {(props) => (
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
                    <MypageSectionTitle>교환배송비 결제</MypageSectionTitle>
                    <div className={css.formSection__content}>
                      <Field name={this.fields.isUserFault}>
                        {({ input }) =>
                          input.value === null ? (
                            <div />
                          ) : input.value === true ? (
                            <div>
                              교환사유 "<b>{exchangeReasonLabel}</b>
                              "으로 인해 교환배송비{' '}
                              <b>
                                {addCommaToNum(
                                  claimData?.exchangeShippingPrice
                                )}
                              </b>
                              원을{' '}
                              <b>{claimData?.exchangeShippingPriceTypeText}</b>
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
                          {(props) => (
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

                  {/* 배송지 정보 */}
                  <div className={css.formSection}>
                    <MypageSectionTitle>
                      <div className={css.exchangeAddressTitleWrap}>
                        <span>교환상품 배송지</span>
                        <button
                          type="button"
                          className={css.exchangeAddressTitleWrap__button}
                          onClick={() => this.openEditOrderAddressModal(values)}
                        >
                          배송지 변경
                        </button>
                      </div>
                    </MypageSectionTitle>

                    {/* 배송지 */}
                    <div className={css.formSection__content}>
                      {this.renderAddressInfoSaved({ values })}
                    </div>

                    {/* 배송 메모 */}
                    <div className={css.reasonSelectWrapper}>
                      <Field name={this.fields.shippingMessage}>
                        {(props) => (
                          <div>
                            <Select
                              placeholder="배송 메모를 선택해주세요."
                              options={orderClaimForm.shippingMessageOptions}
                              onChange={(option) => {
                                this.handleChangeShippingMessage({
                                  option,
                                  formApi,
                                  fieldProps: props,
                                });
                              }}
                              // 옵션 기본값
                              value={orderClaimForm.shippingMessageOptions.find(
                                (o) =>
                                  o.value ===
                                  values[this.fields.shippingMessageType]
                              )}
                            />

                            {// 직접 입력
                            values[this.fields.shippingMessageType] ===
                              'SELF' && (
                              <Input
                                initialValue={props.input.value}
                                onChange={props.input.onChange}
                                wrapperStyle={{ marginTop: '10px' }}
                              />
                            )}
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>

                  <SubmitButtonWrapper
                    fixedToBottom
                    wrapperStyle={{ marginTop: '60px' }}
                  >
                    <CancelButton onClick={() => this.props.router.back()}>
                      취소
                    </CancelButton>
                    <SubmitButton disabled={!_.isEmpty(errors)}>
                      교환 신청{!this.getIsCreate() && ' 수정'}
                    </SubmitButton>
                  </SubmitButtonWrapper>
                </form>
              </div>

              <MypageAddressModal
                isOpen={this.props.mypageAddress.isModalOpen}
              />
            </DetailPageLayout>
          );
        }}
      />
    );
  }
}

export default OrderExchangeForm;
