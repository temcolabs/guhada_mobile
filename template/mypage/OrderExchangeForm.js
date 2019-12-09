import React, { Component } from 'react';
import _ from 'lodash';
import MypageLayout from 'components/mypage/MypageLayout';
import css from './OrderExchangeForm.module.scss';
import SectionHeading from 'components/common/SectionHeading';
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
import KeyValueTable from 'components/mypage/form/KeyValueTable';
import RadioGroup from 'components/mypage/form/RadioGroup';
import tableCSS from 'components/mypage/form/KeyValueTable.module.scss';
import sectionHeadingCss from 'components/common/SectionHeading.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import NoInvoiceWarning from 'components/mypage/orderCancel/NoInvoiceWarning';
import claimFormCSS from 'components/mypage/order/OrderClaimForm.module.scss';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { Form, Field } from 'react-final-form';
import addHyphenToMobile from 'childs/lib/string/addHyphenToMobile';
import {
  claimShippingPriceTypes,
  claimShippingPriceOptions,
} from 'childs/lib/constant/order/claimShippingPrice';
import {
  claimShippingAddressTypeOptions,
  claimShippingAddressTypes,
} from 'childs/lib/constant/order/claimShippingAddress';
import isDev from 'childs/lib/common/isDev';
import { devLog } from 'childs/lib/common/devLog';
import {
  alreadySentTypes,
  alreadySentOptions,
} from 'childs/lib/constant/order/alreadySent';
// import SelectMyAddressModal from 'components/common/modal/SelectMyAddressModal';
import openDaumAddressSearch from 'childs/lib/common/openDaumAddressSearch';
import { isFalsey } from 'childs/lib/common/isTruthy';
import nilToZero from 'childs/lib/common/nilToZero';
import {
  requiredWithMessage,
  required,
} from 'childs/lib/common/finalFormValidators';

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
    claimShippingAddressType: 'claimShippingAddressType', // 배송지 종류 라디오
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
    isAlreadySent: alreadySentTypes.NO,
    claimShippingAddressType: claimShippingAddressTypes.ORDER_ADDRESS,
    // claimShippingAddressType: claimShippingAddressTypes.NEW_ADDRESS, // FIXME: 테스트용
    isUserFault: null,
    shippingMessageType: null,
  };

  /**
   * 교환 신청 request body
   */
  defaultBody = {
    claimShippingPriceType: null,
    exchangeReason: null,
    exchangeReasonDetail: null,
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

  get claimShippingAddressTypeOptions() {
    const hasDefaultAdress =
      this.props.mypageAddress.addressList?.findIndex(
        address => address.defaultAddress === true
      ) > -1;

    if (hasDefaultAdress) {
      return claimShippingAddressTypeOptions;
    } else {
      return claimShippingAddressTypeOptions.filter(
        o => o.value !== claimShippingAddressTypes.DEFAULT_ADDRESS
      );
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      initialValues: { ...this.defaultInitialValues },

      isMyAddressModalOpen: false, // 내 배송지 선택 모달
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
        o => o.label === claimData?.exchangeBuyerShippingMessage
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
            claimShippingAddressType:
              claimShippingAddressTypes.EXCHANGE_ADDRESS,
            isAlreadySent: !_.isNil(claimData?.exchangePickingInvoiceNo)
              ? alreadySentTypes.YES
              : alreadySentTypes.NO,
            isUserFault: orderClaimForm.isClaimReasonUserFault,

            shippingMessageType:
              shippingMessageTypeSaved ||
              // 저장된 타입이 없다면 '직접 입력'으로 저장했다고 판단한다
              this.props.orderClaimForm.shippingMessageOptions?.find(
                o => o.value === 'SELF'
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
   * 교환상품 배송지 타입 변경
   */
  handleChangeShippingAddressType = ({
    type = claimShippingAddressTypes.ORDER_ADDRESS,
    formApi,
  }) => {
    const { mypageAddress } = this.props;
    const { claimData = {} } = this.props.orderClaimForm;

    devLog(`this.fields`, this.fields);

    switch (type) {
      // 교환 주소지 (claimData)
      case claimShippingAddressTypes.EXCHANGE_ADDRESS:
        formApi.batch(() => {
          formApi.change(this.fields.defaultAddress, false);
          formApi.change(
            this.fields.address,
            claimData?.exchangeBuyerAddressName
          );
          formApi.change(
            this.fields.detailAddress,
            claimData?.exchangeBuyerRoadAddress
          );
          formApi.change(
            this.fields.recipientMobile,
            claimData?.exchangeBuyerRecipientMobile
          );
          formApi.change(
            this.fields.recipientName,
            claimData?.exchangeBuyerRecipientName
          );
          formApi.change(
            this.fields.roadAddress,
            claimData?.exchangeBuyerRoadAddress
          );
          formApi.change(
            this.fields.shippingMessage,
            claimData?.exchangeBuyerShippingMessage
          );
          formApi.change(
            this.fields.shippingName,
            claimData?.exchangeBuyerAddressName
          );
          formApi.change(this.fields.zip, claimData?.exchangeBuyerZip);
          formApi.change(this.fields.safetyMobile, claimData?.false);
        });

        break;

      // 주문 주소
      case claimShippingAddressTypes.ORDER_ADDRESS:
        formApi.batch(() => {
          formApi.change(this.fields.defaultAddress, false);
          formApi.change(this.fields.address, claimData?.receiverAddress);
          formApi.change(
            this.fields.detailAddress,
            claimData?.receiverAddressDetail
          );
          formApi.change(this.fields.recipientMobile, claimData?.receiverPhone);
          formApi.change(this.fields.recipientName, claimData?.receiverName);
          formApi.change(
            this.fields.roadAddress,
            claimData?.receiverRoadAddress
          );
          formApi.change(
            this.fields.shippingMessage,
            claimData?.receiverMessage
          );
          formApi.change(
            this.fields.shippingName,
            claimData?.receiverAddressName
          );
          formApi.change(this.fields.zip, claimData?.receiverZipcode);
          formApi.change(this.fields.safetyMobile, false);
        });
        break;

      // 내 배송지 데이터의 기본 주소 선택
      case claimShippingAddressTypes.DEFAULT_ADDRESS:
        const {
          address,
          roadAddress,
          zip,
          detailAddress,
          recipientName,
          recipientMobile,
          shippingName,
          shippingMessage,
        } = mypageAddress.myDefaultAddress || {};

        formApi.batch(() => {
          formApi.change(this.fields.defaultAddress, true);
          formApi.change(this.fields.address, address);
          formApi.change(this.fields.detailAddress, detailAddress);
          formApi.change(this.fields.recipientMobile, recipientMobile);
          formApi.change(this.fields.recipientName, recipientName);
          formApi.change(this.fields.roadAddress, roadAddress);
          formApi.change(this.fields.shippingMessage, shippingMessage);
          formApi.change(this.fields.shippingName, shippingName);
          formApi.change(this.fields.zip, zip);
          formApi.change(this.fields.safetyMobile, false); // TODO: 안심번호 여부
        });
        break;

      // 신규 주소. 입력 필드에서 새로 입력받는다.
      case claimShippingAddressTypes.NEW_ADDRESS:
        formApi.batch(() => {
          formApi.change(this.fields.defaultAddress, false);
          formApi.change(this.fields.address, '');
          formApi.change(this.fields.detailAddress, '');
          formApi.change(this.fields.recipientMobile, '');
          formApi.change(this.fields.recipientName, '');
          formApi.change(this.fields.roadAddress, '');
          formApi.change(this.fields.safetyMobile, false);
          formApi.change(this.fields.shippingMessage, '');
          formApi.change(this.fields.shippingName, '');
          formApi.change(this.fields.zip, '');
          formApi.change(this.fields.shippingMessageType, null);
        });
        break;

      default:
        break;
    }
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
      formApi.change(this.fields.shippingMessage, null);
    } else {
      // 옵션을 선택했다면 라벨을 저장
      formApi.change(this.fields.shippingMessage, option.label);
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
    return `${zip || ''} ${roadAddress || address || ''} ${detailAddress ||
      ''}`;
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
        <tr>
          <td>받는 분</td>
          <td>
            <Field name={this.fields.recipientName}>
              {props => (
                <div className={'textValueCell'}>{props.input.value}</div>
              )}
            </Field>
          </td>
        </tr>
        <tr>
          <td>배송주소</td>
          <td>
            <div className={'textValueCell'}>
              {this.getFullAddressString({
                zip: values[this.fields.zip],
                detailAddress: values[this.fields.detailAddress],
                roadAddress: values[this.fields.roadAddress],
                address: values[this.fields.address],
              })}
            </div>
          </td>
        </tr>
        <tr>
          <td>연락처</td>
          <td>
            <div className={'textValueCell'}>
              {addHyphenToMobile(values[this.fields.recipientMobile])}
            </div>
          </td>
        </tr>
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
        <Field name={this.fields.shippingName}>
          {props => (
            <tr>
              <td>배송지 이름</td>
              <td>
                <div className={tableCSS.smallInputWrapper}>
                  <Input
                    initialValue={props.input.value}
                    onChange={props.input.onChange}
                  />
                </div>
              </td>
            </tr>
          )}
        </Field>

        <tr>
          <td>배송 주소</td>
          <td className={css.newAddressSearchField}>
            <div className={tableCSS.smallInputWrapper}>
              <Input
                disabled
                placeholder="우편번호 찾기를 통해 입력해주세요."
                initialValue={
                  // 도로명 주소를 우선해서 초기값을 넣어준다
                  values[this.fields.roadAddress] || values[this.fields.address]
                }
              />
            </div>
            <button
              type="button"
              className={css.addressListButton}
              onClick={() =>
                openDaumAddressSearch({
                  onComplete: data =>
                    this.handleSelectDaumAddressSearchResult({
                      data,
                      formApi,
                    }),
                })
              }
            >
              우편번호 찾기
            </button>
          </td>
        </tr>
        {/*  상세 주소 */}
        <Field name={this.fields.detailAddress}>
          {props => (
            <tr>
              <td />
              <td>
                <div className={tableCSS.smallInputWrapper}>
                  <Input
                    initialValue={props.input.value}
                    onChange={props.input.onChange}
                    placeholder="상세 주소를 입력해주세요."
                  />
                </div>
              </td>
            </tr>
          )}
        </Field>
        {/* 수령인 */}
        <Field name={this.fields.recipientName}>
          {props => (
            <tr>
              <td>수령인</td>
              <td>
                <div className={tableCSS.smallInputWrapper}>
                  <Input
                    initialValue={props.input.value}
                    onChange={props.input.onChange}
                  />
                </div>
              </td>
            </tr>
          )}
        </Field>
        {/* 연락처 */}
        <Field name={this.fields.recipientMobile}>
          {props => (
            <tr>
              <td>연락처</td>
              <td>
                <div className={tableCSS.smallInputWrapper}>
                  <Input
                    initialValue={props.input.value}
                    onChange={props.input.onChange}
                  />
                </div>
              </td>
            </tr>
          )}
        </Field>
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
            o => o.value === values[this.fields.exchangeReason]
          )?.label;

          return (
            <MypageLayout
              topLayout={'main'}
              pageTitle={'마이페이지'}
              headerShape={'mypage'}
            >
              <form onSubmit={handleSubmit}>
                <SectionHeading
                  title={() => (
                    <div>
                      {/* 수정일 때는 타이틀이 달라짐 */}
                      <span>교환 {this.getIsCreate() ? '신청' : '수정'}</span>
                      <span className={sectionHeadingCss.guideText}>
                        교환 신청을 하시기 전에 반드시 판매자와 교환 진행에 대해
                        먼저 협의해 주세요.
                      </span>
                    </div>
                  )}
                />
                <Table className={claimFormCSS.orderItemTable}>
                  <thead>
                    <tr>
                      <th data-name="deal">상품 정보</th>
                      <th data-name="quantity">교환수량</th>
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
                        <Field name={this.fields.quantity}>
                          {props =>
                            this.getIsCreate() ? (
                              <QuantityControl
                                initialValue={
                                  initialValues[this.fields.quantity]
                                }
                                onChange={props.input.onChange}
                                max={claimData?.quantity}
                              />
                            ) : (
                              // * 수정시에는 수량 변경 불가
                              <span>{props.input.value}</span>
                            )
                          }
                        </Field>
                      </td>
                      <td>{claimData?.sellerName || '-'}</td>
                    </tr>
                  </tbody>
                </Table>
                <KeyValueTable>
                  <tr>
                    <td>사유 선택</td>
                    <td>
                      <div className={tableCSS.smallInputWrapper}>
                        <Field
                          name={this.fields.exchangeReason}
                          validate={required}
                        >
                          {props => (
                            <>
                              <Select
                                options={orderClaimForm.exchangeReasonOptions}
                                onChange={({ value, userFault } = {}) => {
                                  this.handleChangeReason({
                                    reasonSelected: value,
                                    formApi,
                                    isUserFault: userFault,
                                    values,
                                  });
                                }}
                                // 기본값
                                value={orderClaimForm.exchangeReasonOptions?.find(
                                  o =>
                                    o.value ===
                                    values[this.fields.exchangeReason]
                                )}
                              />

                              {props.meta.submitFailed && props.meta.error && (
                                <div data-name="error">{props.meta.error}</div>
                              )}
                            </>
                          )}
                        </Field>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>사유 상세</td>
                    <td>
                      <Field
                        name={this.fields.exchangeReasonDetail}
                        validate={requiredWithMessage(
                          '교환 사유를 간략히 적어주세요.'
                        )}
                      >
                        {props => (
                          <>
                            <Input
                              initialValue={
                                initialValues[this.fields.exchangeReasonDetail]
                              }
                              onChange={props.input.onChange}
                            />
                            {props.meta.submitFailed && props.meta.error && (
                              <div data-name="error">{props.meta.error}</div>
                            )}
                          </>
                        )}
                      </Field>
                    </td>
                  </tr>
                </KeyValueTable>

                {/* TODO: 셀러 반송지 주소 연결 */}
                <SectionHeading
                  title={() => (
                    <div>
                      <span>교환 반송지</span>
                      <span className={sectionHeadingCss.guideText}>
                        교환을 보낼 곳입니다. 해당 주소로 교환 상품을 직접
                        반송해주세요.
                      </span>
                    </div>
                  )}
                />
                <KeyValueTable>
                  <tr>
                    <td>받는 분</td>
                    <td>
                      <div>
                        <div className={'textValueCell'}>
                          {claimData?.sellerName}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>연락처</td>
                    <td>
                      <div>
                        <div className={'textValueCell'}>
                          {addHyphenToMobile(claimData?.sellerReturnTelephone)}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>주소</td>
                    <td>
                      <div>
                        <div className={'textValueCell'}>
                          {orderClaimForm.sellerReturnAddressInView}
                        </div>
                      </div>
                    </td>
                  </tr>
                </KeyValueTable>

                <SectionHeading
                  title={() => (
                    <div>
                      <span>교환 발송 여부</span>
                      <span className={sectionHeadingCss.guideText}>
                        위 반송지로 발송을 하셨다면, 반드시 송장번호를
                        입력해주세요. 송장번호 미입력시 교환 처리가 늦어질 수
                        있습니다.
                      </span>
                    </div>
                  )}
                />
                <KeyValueTable>
                  <tr>
                    <td>
                      <div>이미 발송하셨나요?</div>
                    </td>
                    <td>
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
                            />
                          );
                        }}
                      </Field>
                    </td>
                  </tr>

                  {/* 이미 배송했다면 송장번호 입력 */}
                  {values[this.fields.isAlreadySent] ===
                    alreadySentTypes.YES && (
                    <>
                      <tr>
                        <td>
                          <div>택배사</div>
                        </td>
                        <td>
                          <div className={tableCSS.smallInputWrapper}>
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
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div>송장번호</div>
                        </td>
                        <td>
                          <div className={tableCSS.smallInputWrapper}>
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
                                  type="number"
                                  onChange={props.input.onChange}
                                  initialValue={
                                    initialValues[this.fields.invoiceNo]
                                  }
                                />
                              )}
                            </Field>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </KeyValueTable>

                <SectionHeading
                  title={() => (
                    <div>
                      <span>교환배송비 결제</span>
                      <span className={sectionHeadingCss.guideText}>
                        교환배송비는 교환 사유에 따라 부담여부가 결정되며,
                        올바르지 않은 사유 선택 시 판매자가 변경할 수 있습니다.
                      </span>
                    </div>
                  )}
                />
                <KeyValueTable>
                  <tr>
                    <td>교환배송비 부담 대상</td>
                    <td>
                      <Field name={this.fields.isUserFault}>
                        {props => (
                          <div>
                            <div className={'textValueCell'}>
                              {props.input.value === true
                                ? `${exchangeReasonLabel}에 인해 구매자 부담`
                                : props.input.value === false
                                ? `${exchangeReasonLabel}에 인해 판매자 부담`
                                : `(교환 사유를 선택하세요)`}
                            </div>
                          </div>
                        )}
                      </Field>
                    </td>
                  </tr>

                  {/* 판매자 귀책사유 */}
                  {values[this.fields.isUserFault] && (
                    <>
                      <tr>
                        <td>교환배송비</td>
                        <td>
                          <div className={'textValueCell'}>
                            {addCommaToNum(
                              parseInt(
                                nilToZero(
                                  claimData?.exchangeShippingPrice ||
                                    claimData?.exchangeShipExpense
                                ),
                                10
                              )
                            )}
                            원
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>교환배송비 결제방식</td>
                        <td>
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
                              />
                            )}
                          </Field>
                        </td>
                      </tr>
                    </>
                  )}
                </KeyValueTable>

                <SectionHeading
                  title={() => (
                    <div>
                      <span>교환상품 배송지</span>
                      <span className={sectionHeadingCss.guideText}>
                        교환 상품을 받을 곳입니다.
                      </span>
                    </div>
                  )}
                />
                <KeyValueTable>
                  <tr>
                    {/* TODO: 기본배송지 데이터 연결. 신규 배송지 선택시 배송지 입력 폼 작성 (주문에 있음) */}
                    {/* (주문 배송지 || 교환 배송지) || 기본 배송지 || 신규 배송지 */}
                    <td>배송지명</td>
                    <td>
                      <Field name={this.fields.claimShippingAddressType}>
                        {props => {
                          return (
                            <div className={css.exchangeAddressControl}>
                              {/* 주문 배송지와 교환 배송지가 다르면 배송지 이름 표시*/}
                              {!!claimData?.exchangeBuyerAddressName &&
                                !claimData?.orderExchangeAddressSame &&
                                !values[
                                  this.fields.claimShippingAddressType
                                ] && (
                                  <div
                                    className={'textValueCell'}
                                    style={{ marginRight: '2em' }}
                                  >
                                    <b>
                                      {claimData?.exchangeBuyerAddressName ||
                                        ''}
                                    </b>
                                  </div>
                                )}

                              <RadioGroup
                                name={this.fields.claimShippingAddressType}
                                options={this.claimShippingAddressTypeOptions}
                                initialValue={
                                  initialValues[
                                    this.fields.claimShippingAddressType
                                  ]
                                }
                                onChange={value => {
                                  props.input.onChange(value);

                                  this.handleChangeShippingAddressType({
                                    type: value,
                                    formApi,
                                  });
                                }}
                                wrapperStyle={{}}
                              />
                              <button
                                type="button"
                                className={css.addressListButton}
                                onClick={this.toggleOpenAddressListModal}
                              >
                                배송지 목록
                              </button>

                              {/* 배송지 선택 모달 */}
                              {/* FIXME: 추가 */}
                              {/* <SelectMyAddressModal
                                  isOpen={this.state.isMyAddressModalOpen}
                                  onClose={this.toggleOpenAddressListModal}
                                  onSubmit={address =>
                                    this.handleSelectAddressFromListModal({
                                      address,
                                      formApi,
                                    })
                                  }
                                /> */}
                            </div>
                          );
                        }}
                      </Field>
                    </td>
                  </tr>

                  {/* 새 주소 입력 모드에서는 다른 양식을 표시한다 */}
                  {values[this.fields.claimShippingAddressType] !==
                  claimShippingAddressTypes.NEW_ADDRESS
                    ? this.renderAddressInfoSaved({ values })
                    : this.renderNewAddressForm({ values, formApi })}

                  <tr>
                    <td>배송 메모</td>
                    <td>
                      <Field name={this.fields.shippingMessage}>
                        {props => (
                          <div className={tableCSS.smallInputWrapper}>
                            <Select
                              placeholder="배송 메모를 선택해주세요."
                              options={orderClaimForm.shippingMessageOptions}
                              onChange={option => {
                                this.handleChangeShippingMessage({
                                  option,
                                  formApi,
                                  fieldProps: props,
                                });
                              }}
                              // 옵션 기본값
                              value={orderClaimForm.shippingMessageOptions.find(
                                o =>
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
                    </td>
                  </tr>
                </KeyValueTable>

                {/* 이미 보냈을 때 송장번호 입력 안내  */}
                {this.isInvoiceWarningVisible({ values }) && (
                  <NoInvoiceWarning />
                )}

                <SubmitButtonWrapper wrapperStyle={{ marginTop: '60px' }}>
                  <CancelButton onClick={() => this.props.router.back()}>
                    취소
                  </CancelButton>
                  <SubmitButton disabled={!_.isEmpty(errors)}>
                    교환 신청{!this.getIsCreate() && ' 수정'}
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

export default OrderExchangeForm;
