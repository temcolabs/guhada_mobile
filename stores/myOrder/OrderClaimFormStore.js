import { observable, action, computed, toJS } from 'mobx';
import _ from 'lodash';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import { pushRoute } from 'lib/router';
import { devLog } from 'lib/common/devLog';
import isTruthy from 'lib/common/isTruthy';
import orderClaimTypes from 'lib/constant/order/orderClaimTypes';
import moment from 'moment';
import { dateFormat } from 'lib/constant/date';
import purchaseStatus from 'lib/constant/order/purchaseStatus';
import paymentMethod from 'lib/constant/order/paymentMethod';

/**
 * 클레임(취소교환반품) 폼, 클레임 상세에서 사용할 데이터 관리.
 *
 * 클레임 API 문서
 * http://dev.claim.guhada.com/swagger-ui.html#/ORDER-CLAIM
 */
export default class OrderClaimFormStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }
  }

  // * 주문 중에서 상품 1건의 아이디. 클레임 최초 생성시 claim-form API 호출을 위해 사용한다
  @observable
  orderProdGroupId = null;

  // * 클레임 아이디. 취소교환반품이 신청되면 생성된다. 신청서 수정에서 사용한다
  @observable
  orderClaimId = null;

  /**
   * * 취소교환반품이 신청되면 생성된다. 신청 완료 화면애서 사용한다.
   * 취소를 1개 이상 하면 orderClaimId도 1개 이상 생성된다. (목록에서도 분리되어 표시)
   * 목록에서 상세로 이동하거나, 클레임을 수정할 때는 orderClaimId를 사용한다.
   *
   * 하지만 신청 완료 페이지에서는 신청 당시 복수개의 주문 건에 대한 정보를 합산해서 보여줘야 한다.
   * 그래서 복수의 orderClaimId를 가리키는 orderClaimGroupId를 사용한다.
   */
  @observable
  orderClaimGroupId = null;

  /**
   * * 주문 클레임 양식에 필요한 데이터.
   * getOrderClaimRegisterForm, getOrderClaimUpdateForm 을 통해 가져온 데이터가 저장된다.
   */
  @observable
  claimData = {};

  /**
   * 환불 예상 데이터
   */
  @observable
  refundResponse = {
    // totalCancelDiscountPrice: 0, // 상품 주문할인 취소
    // totalCancelOrderPrice: 0, // 취소상품 주문금액
    // totalCancelProductPrice: 0, // 취소상품 금액합계
    // totalCancelShipPrice: 0, // 취소 배송비 합계
    // totalPaymentCancelPrice: 0, // 신용카드 환불금액
    // totalPointCancelPrice: 0, // 포인트 환불금액
  };

  // * 클레임 종류. 이 스토어에서는 claimId와 claimType에 기반해서 computed value를 많이 사용함
  @computed
  get claimType() {
    return /cancel/i.test(this.claimData?.claimStatus)
      ? orderClaimTypes.CANCEL
      : /exchange/i.test(this.claimData?.claimStatus)
      ? orderClaimTypes.EXCHANGE
      : /return/i.test(this.claimData?.claimStatus)
      ? orderClaimTypes.RETURN
      : null;
  }

  /**
   * 페이지 마운팅시 클레임 관련 아이디를 할당한다.
   *
   * 아이디가 유효하면 폼 데이터를 가져온다.
   * orderClaimGroupId => 취소교환반품 완료 페이지. 클레임 상세 페이지
   * orderClaimId => 클레임 수정, 클레임 상세 페이지에서 사용
   * orderProdGroupId => 클레임 신청 페이지에서 사용
   */
  @action
  setClaimId = ({ orderClaimGroupId, orderClaimId, orderProdGroupId } = {}) => {
    this.orderClaimGroupId = orderClaimGroupId;
    this.orderClaimId = orderClaimId;
    this.orderProdGroupId = orderProdGroupId;

    if (isTruthy(orderClaimGroupId)) {
      // 클레임 신청 완료
      this.getOrderClaimCompleteForm(orderClaimGroupId);
    } else if (isTruthy(orderClaimId)) {
      // 클레임 신청 수정
      this.getOrderClaimUpdateForm(orderClaimId);
    } else if (isTruthy(orderProdGroupId)) {
      // 클레임 신청 전
      this.getOrderClaimRegisterForm(orderProdGroupId);
    } else {
      console.error(
        `orderClaimGroupId,orderClaimId, orderProdGroupId 중 1개의 데이터가 필요합니다.`
      );
    }
  };

  /**
   * 클레임 데이터 초기화.
   * 클레임 신청, 수정, 상세 페이지가 unmount 될 때 호출해준다.
   */
  @action
  resetClaimData() {
    this.orderClaimId = null;
    this.orderClaimGroupId = null;
    this.orderProdGroupId = null;

    this.claimData = null;
    this.refundResponse = null;
  }

  /**
   * orderClaimId가 있으면 클레임이 등록된 상태 => 클레임 수정, 조회
   */
  @computed
  get hasClaimId() {
    return isTruthy(this.orderClaimId);
  }

  /**
   * 클레임 타입 텍스트.
   * 취소 ・ 교환 ・ 반품 중 1
   */
  @action
  getClaimTypeLabel() {
    switch (this.claimType) {
      case orderClaimTypes.CANCEL:
        return '취소';

      case orderClaimTypes.EXCHANGE:
        return '교환';

      case orderClaimTypes.RETURN:
        return '반품';

      default:
        return [];
    }
  }

  /**
   * 사용자가 요청한 클레임 코드
   * 타입에 따라 claimData에서 가져온다
   */
  @computed
  get claimReasonCode() {
    switch (this.claimType) {
      case orderClaimTypes.CANCEL:
        return this.claimData?.cancelReason;

      case orderClaimTypes.EXCHANGE:
        return this.claimData?.exchangeReason;

      case orderClaimTypes.RETURN:
        return this.claimData?.returnReason;

      default:
        return null;
    }
  }

  /**
   * 사용자가 요청한 클레임 라벨
   * ex) 단순 변심
   */
  @computed
  get claimReasonLabel() {
    return (
      this.claimReasonOptionsByType?.find(
        (o) => o.value === this.claimReasonCode
      )?.label || ''
    );
  }

  /**
   * 클레임 사유가 사용자의 잘못인지 확인
   */
  @computed
  get isClaimReasonUserFault() {
    return this.claimReasonOptionsByType.find(
      (o) => o.value === this.claimReasonCode
    )?.userFault;
  }

  /**
   * 반품, 환불 배송비 표시 텍스트.
   * ex) "~로 인해 ~부담"
   */
  @computed
  get claimShippingChargeLabel() {
    // 사유 옵션
    const reason = this.claimReasonOptionsByType.find(
      (o) => o.value === this.claimReasonCode
    );

    return isTruthy(reason)
      ? `${reason.label}에 인해 ${reason.userFault ? '구매자' : '판매자'} 부담`
      : '';
  }

  /**
   * 배송회사 코드로 라벨 가져오기
   * 교환, 반품일 때 데이터가 다르므로 claimData 기반으로 판단한다
   */
  getShipCompanyLabelFromClaim = () => {
    let shipCompanyCode = null;

    switch (this.claimType) {
      case orderClaimTypes.EXCHANGE:
        shipCompanyCode = this.claimData?.exchangePickingShipCompany;
        break;

      case orderClaimTypes.RETURN:
        shipCompanyCode = this.claimData?.returnPickingShipCompany;
        break;

      default:
        break;
    }

    return (
      this.shipCompanyOptions.find((o) => o.value === shipCompanyCode)?.label ||
      `코드: ${shipCompanyCode}`
    );
  };

  /**
   * claimData가 주문 객체 필드를 모두 포함하고 있다.
   */
  @computed
  get claimDataList() {
    const claimData = toJS(this.claimData);
    return _.isEmpty(claimData) ? [] : [claimData];
  }

  // 주문의 배송 주소
  @computed
  get receiverAddressInView() {
    if (isTruthy(this.claimData)) {
      const {
        receiverZipcode,
        receiverAddress,
        receiverRoadAddress,
        receiverAddressDetail,
      } = this.claimData || {};
      return `${receiverZipcode} ${receiverRoadAddress ||
        receiverAddress} ${receiverAddressDetail}`;
    } else {
      return '';
    }
  }

  // 반송지 주소
  @computed
  get sellerReturnAddressInView() {
    if (isTruthy(this.claimData)) {
      const {
        sellerReturnZip,
        sellerReturnAddress,
        sellerReturnRoadAddress,
        sellerReturnDetailAddress,
      } = this.claimData;
      return `[${sellerReturnZip}] ${sellerReturnRoadAddress ||
        sellerReturnAddress} ${sellerReturnDetailAddress}`;
    } else {
      return '';
    }
  }

  /**
   * 취소 옵션
   */
  @computed
  get cancelReasonOptions() {
    return this.claimData?.cancelReasonList?.length > 0
      ? this.claimData?.cancelReasonList.map((reason, index) => ({
          value: reason.code,
          label: reason.contents,
          userFault: reason.userFault,
        }))
      : [];
  }

  /**
   * 교환 옵션
   */
  @computed
  get exchangeReasonOptions() {
    return (
      this.claimData?.exchangeReasonList?.map((reason, index) => ({
        value: reason.code,
        label: reason.contents,
        userFault: reason.userFault,
      })) || []
    );
  }

  /**
   * 반품 옵션
   */
  @computed
  get returnReasonOptions() {
    return (
      this.claimData?.returnReasonList?.map((reason, index) => ({
        value: reason.code,
        label: reason.contents,
        userFault: reason.userFault,
      })) || []
    );
  }

  /**
   * 초기화 과정에서 설정한 claimType으로 클레임 원인 배열을 리턴한다
   */
  @computed
  get claimReasonOptionsByType() {
    switch (this.claimType) {
      case orderClaimTypes.CANCEL:
        return this.cancelReasonOptions || [];

      case orderClaimTypes.EXCHANGE:
        return this.exchangeReasonOptions || [];

      case orderClaimTypes.RETURN:
        return this.returnReasonOptions || [];

      default:
        return [];
    }
  }

  /**
   * 배송 메시지
   */
  @computed
  get shippingMessageOptions() {
    return (
      this.claimData?.shippingMessageList?.map((reason, index) => ({
        value: reason.type,
        label: reason.message,
      })) || []
    );
  }

  // 반송 송장번호 입력할 때 택배회사 선택 옵션
  @computed
  get shipCompanyOptions() {
    return (
      this.claimData?.shipCompanyList?.map((shipCompany) => ({
        value: shipCompany.code,
        label: shipCompany.name,
      })) || []
    );
  }

  @computed
  get bankCodeOptions() {
    return (
      this.claimData?.banks?.map((bank) => ({
        value: bank.bankCode,
        label: bank.bankName,
      })) || []
    );
  }

  // 결제 수단 텍스트
  @computed
  get paymentMethodText() {
    return this.claimData?.paymentMethodText || this.claimData?.paymentMethod;
  }

  /**
   * 클레임 등록할 때 필요한 데이터 가져오기
   * memoize 적용해서 같은 아이디로 중복 호출 안함
   */
  @action
  getOrderClaimRegisterForm = async (orderProdGroupId) => {
    try {
      const header = {
        'ACCEPT-VERSION': '1.1',
      };

      const { data } = await API.claim.get(
        `/order-claim/claim-form/${orderProdGroupId}`,
        {
          headers: header,
        }
      );

      this.claimData = data.data;
      this.runJobsForClaimData(data.data);
      devLog('claim-form', toJS(data.data));
    } catch (e) {
      this.claimRegisterForm = {};
      console.error(e);
    }
  };

  /**
   * 클레임 수정할 때 필요한 데이터 가져오기
   * memoize 적용해서 같은 아이디로 중복 호출 안함
   */
  @action
  getOrderClaimUpdateForm = async (orderClaimId) => {
    try {
      const { data } = await API.claim.get(
        `/order-claim/claim-update-form/${orderClaimId}`
      );

      this.claimData = data.data;
      this.runJobsForClaimData(data.data);
      devLog('claim-update-form', toJS(data.data));
    } catch (e) {
      this.claimUpdateForm = {};
      console.error(e);
    }
  };

  /**
   * 취소교환반품 완료 페이지에서 사용할 데이터 가져오기.
   * orderClaimGroupId는 클레임 목록과 신청, 수정 API 리스펀스에서 가져올 수 있다.
   */
  @action
  getOrderClaimCompleteForm = async (orderClaimGroupId) => {
    try {
      const { data } = await API.claim.get(
        `/order-claim/claim-complete-form/${orderClaimGroupId}`
      );

      this.claimData = data.data;
      this.runJobsForClaimData(data.data);

      devLog('claim-complete-form', toJS(data.data));
    } catch (e) {
      this.claimUpdateForm = {};
      console.error(e);
    }
  };

  /**
   * 클레임 데이터를 가져온 후 실행할 함수 스택
   */
  jobsForClaimData = [];

  /**
   * 클레임 데이터를 가져온 후 실행할 함수 등록
   */
  @action
  pushJobForClaimData = (job = () => {}) => {
    if (typeof job === 'function') {
      if (_.isEmpty(toJS(this.claimData))) {
        this.jobsForClaimData.push(job);
      } else {
        // 데이터가 있으면 즉시 실행한다.
        job(this.claimData);
      }
    } else {
      console.error('[pushJobForClaimData] job is not function');
    }
  };

  /**
   * pushJobForClaimData에서 쌓아둔 잡 실행
   */
  @action
  runJobsForClaimData = (claimData = {}) => {
    while (this.jobsForClaimData.length > 0) {
      const job = this.jobsForClaimData.pop();
      job(claimData);
    }
  };

  /**
   * 취소 신청
   */
  @action
  createOrderCancel = async ({
    purchaseId, // 페이지 이동에 사용함
    orderProdGroupId,
    cancelReason,
    cancelReasonText,
    quantity,
  }) => {
    try {
      const { data } = await API.claim.post(`/order-claim/order-cancel`, {
        orderProdGroupId,
        cancelReason,
        cancelReasonDetail: cancelReasonText,
        quantity,
      });

      // 완료 페이지로 이동
      pushRoute(`/mypage/orders/claim/cancel/done`, {
        query: {
          orderClaimGroupId: data.data?.orderClaimGroupId,
          orderClaimId: data.data?.orderClaimId, // ! deprecated. 오픈 후 제거
        },
      });
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다');
      console.error(e);
    }
  };

  /**
   * 교환 신청
   */
  @action
  createOrderExchange = async (body = {}) => {
    try {
      const { data } = await API.claim.post(
        `/order-claim/order-exchange`,
        body
      );

      pushRoute(`/mypage/orders/claim/exchange/done`, {
        query: {
          orderClaimGroupId: data.data?.orderClaimGroupId,
          orderClaimId: data.data?.orderClaimId, // ! deprecated. 오픈 후 제거
        },
      });
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다');
      console.error(e);
    }
  };

  /**
   * 교환 수정
   */
  @action
  updateOrderExchange = async (body = {}) => {
    try {
      const { data } = await API.claim.post(
        `/order-claim/update-order-exchange`,
        body
      );
      pushRoute(`/mypage/orders/claim/exchange/done`, {
        query: {
          orderClaimId: data.data?.orderClaimId,
          orderClaimGroupId: data.data?.orderClaimGroupId,
        },
      });
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다');
      console.error(e);
    }
  };

  /**
   * 교환 철회
   */
  @action
  withdrawOrderExchange = async ({
    orderClaimId = 0,
    onSuccess = () => {},
  }) => {
    try {
      await API.claim.delete(`/order-claim/order-exchange-withdraw`, {
        params: {
          orderClaimId,
        },
      });

      onSuccess();
    } catch (e) {
      console.error(e);
      const resultMessage = _.get(e, 'data.message');
      if (resultMessage) {
        this.root.alert.showAlert(e.data.message);
      } else {
        this.root.alert.showAlert('오류가 발생했습니다');
      }
    }
  };

  /**
   * 반품 신청
   */
  @action
  createOrderReturn = async (body = {}) => {
    try {
      const { data } = await API.claim.post(`/order-claim/order-return`, body);

      pushRoute(`/mypage/orders/claim/return/done`, {
        query: {
          orderClaimGroupId: data.data?.orderClaimGroupId,
          orderClaimId: data.data?.orderClaimId, // ! deprecated. 오픈 후 제거
        },
      });
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다');
      console.error(e);
    }
  };

  /**
   * 반품 수정
   */
  @action
  updateOrderReturn = async (body = {}) => {
    try {
      const { data } = await API.claim.post(
        `/order-claim/update-order-return`,
        body
      );

      pushRoute(`/mypage/orders/claim/return/done`, {
        query: {
          orderClaimId: data.data?.orderClaimId,
          orderClaimGroupId: data.data?.orderClaimGroupId,
        },
      });
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다');
      console.error(e);
    }
  };

  /**
   * 반품 철회
   */
  @action
  withdrawOrderReturn = async ({ orderClaimId = 0, onSuccess = () => {} }) => {
    try {
      await API.claim.delete(`/order-claim/order-return-withdraw`, {
        params: {
          orderClaimId,
        },
      });

      onSuccess();
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다');
      console.error(e);
    }
  };

  /**
   * 환불 예정금액
   */
  @action
  getRefundResponse = async ({ orderProdGroupId, quantity }) => {
    try {
      const { data } = await API.claim.get(`/order-claim/refund-price`, {
        params: {
          orderProdGroupId,
          quantity,
        },
      });

      this.refundResponse = data.data;
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 포맷된 주문 날짜. claimData.orderTimestamp 날짜를 사용한다.
   */
  @computed get orderDateWithFormat() {
    return (
      moment(this.claimData?.orderTimestamp).format(dateFormat.YYYYMMDD_UI) ||
      '-'
    );
  }

  /**
   * 환불계좌 입력 양식을 표시할 것인지 결정
   * 입금 대기중이 아니고, 무통장 입금 결제일 때
   */
  @computed
  get isRefundEnabled() {
    return (
      this.claimData?.orderStatus !== purchaseStatus.WAITING_PAYMENT.code &&
      this.claimData?.paymentMethod === paymentMethod.VBANK.code
    );
  }
}
