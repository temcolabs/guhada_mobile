import { observable, action, computed } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import moment from 'moment';
import { dateFormat } from 'lib/constant/date';
import { pushRoute } from 'lib/router';
import { DEFAULT_PERIOD } from 'components/mypage/PeriodSelector';
import orderClaimService from 'lib/API/claim/orderClaimService';
import pointProcessService from 'lib/API/benefit/pointProcessService';
import isTruthy from 'lib/common/isTruthy';
import qs from 'qs';
import { devLog } from 'lib/common/devLog';
import isFunction from 'lib/common/isFunction';

/**
 * 취소 ・ 교환 ・ 반품 목록
 */
export default class OrderClaimListStore {
  // 기본 기간
  defaultPeriod = {
    startDate: DEFAULT_PERIOD.startDate.format(dateFormat.YYYYMMDD),
    endDate: DEFAULT_PERIOD.endDate.format(dateFormat.YYYYMMDD),
  };

  // 주문 취소 ・ 교환 ・ 반품 상태
  @observable
  myCancelOrderStatus = {
    cancelOrder: 0,
    exchangeOrder: 0,
    returnOrder: 0,
  };

  // 주문 취소 리스트
  @observable
  list = [];

  // 목록 로딩 여부. 로딩스피너 및 중복 호출 방지를 위함
  @observable
  isLoadingList = false;

  @action emtpyList = () => {
    this.list = [];
  };

  // 조회 기간
  @observable
  period = this.defaultPeriod;

  // 페이지
  @observable
  page = 1;

  // 전체 항목 수
  @observable
  count = 0;

  @observable
  totalPage = 1;

  @observable
  itemsCountPerPage = 10;

  // 구매확정 모달 오픈 여부
  @observable
  isOrderConfirmModalOpen = false;

  // 구매확정 모달에서 사용할 데이터
  @observable
  orderConfirmModalData = Object.assign(
    {},
    this.DEFAULT_ORDER_CONFIRM_MODAL_DATA
  );

  DEFAULT_ORDER_CONFIRM_MODAL_DATA = {
    order: {},
    dueSavePointOnConfirm: 0, // 구매
    dueSavePointOnReview: 0, // 리뷰 작성시 모달
    dueSavePointOnFirstPurchase: 0, // 첫 구매 시
    onConfirm: () => {},
    onClose: () => {},
  };

  @computed
  get isNoResults() {
    return !this.isLoadingList && this.list?.length === 0;
  }

  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @action
  initPeriod = () => {
    this.period = this.defaultPeriod;
  };

  /**
   * 조회 기간 변경
   */
  @action
  changePeriod = ({ startDate, endDate }) => {
    this.period = {
      startDate,
      endDate,
    };
  };

  /**
   * 취소주문 상태 리스트
   * 취소교환반품 목록 상단 현황 데이터
   */
  @action
  getMyCancelOrderStatus = async ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
  }) => {
    this.changePeriod({ startDate, endDate });

    try {
      const { data } = await orderClaimService.getMyCancelOrderStatusList({
        startDate,
        endDate,
      });

      this.myCancelOrderStatus = data.data;
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 주문 취소 목록
   * 전달되지 않은 파라미터는 store의 값을 그대로 사용한다.
   * 시작일 종료일은 changePeriod 액션으로 변경한다.
   */
  getMyCancelOrders = async ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
    pageNo = this.page,
  } = {}) => {
    this.changePeriod({ startDate, endDate });
    this.page = pageNo;

    this.isLoadingList = true;

    try {
      const { data } = await API.claim.get(
        `/order-claim/my-cancel-order-list`,
        {
          params: {
            startTimestamp: +moment(startDate).startOf('day'),
            endTimestamp: +moment(endDate).endOf('day'),
            page: pageNo,
          },
        }
      );

      const result = data.data;
      const { orderItemList, count, page, totalPage } = result;

      this.list = orderItemList;
      this.page = page;
      this.count = count;
      this.totalPage = totalPage;
    } catch (e) {
      console.error(e);
      this.emtpyList();
    } finally {
      this.isLoadingList = false;
    }
  };

  /**
   * 클레임 목록으로 이동
   */
  redirectToOrderClaimList = () => {
    pushRoute(`/mypage/orders/claim/list`);
  };

  /**
   * 클레임 상세로 이동
   * orderClaimId 필요
   */
  redirectToOrderClaimDetail = ({ orderClaimId, orderClaimGroupId } = {}) => {
    pushRoute(`/mypage/orders/claim/detail`, {
      query: {
        orderClaimId,
        orderClaimGroupId,
      },
    });
  };

  /**
   * 구매 확정 버튼 클릭
   */
  @action
  handleClickConfirmOrderButton = async ({
    order = {},
    onSuccess = () => {}, // 성공 콜백. 현재 목록 새로고침 사용 중
  }) => {
    devLog('OrderClaimListStore : handleClickConfirmOrderButton called.');
    const { orderProdGroupId } = order;

    // 적립예정포인트 데이터 가져오기
    const { data } = await pointProcessService.getConfirmDueSave({
      orderProdGroupId,
    });
    const { dueSavePointList = [] } = data.data;

    this.orderConfirmModalData = {
      order,

      // 구매 확정시 포인트
      dueSavePointOnConfirm: dueSavePointList?.find(
        (item) => item.dueSaveType === 'BUY'
      )?.totalPoint,

      // 리뷰 작성시 포인트
      dueSavePointOnReview: dueSavePointList?.find(
        (item) => item.dueSaveType === 'REVIEW'
      )?.totalPoint,

      dueSavePointOnFirstPurchase: dueSavePointList?.find(
        (item) => item.dueSaveType === 'FIRST_ORDER'
      )?.totalPoint,

      onConfirm: async () => {
        try {
          const { data } = await API.order.post(
            `/order/order-prod-confirm?${qs.stringify({
              orderProdGroupId,
            })}`
          );

          // 적립 포인트 내역
          if (isTruthy(data?.data)) {
            const savedPointResponse = {
              dueSavedPoint: data.data.dueSavedPoint,
              message: data.data.message,
              saveTargetType: data.data.saveTargetType,
              savedPoint: data.data.savedPoint,
              totalFreePoint: data.data.totalFreePoint,
              totalPaidPoint: data.data.totalPaidPoint,
            };

            this.root.mypagePoint.openPointSavingModal(savedPointResponse);

            devLog(`order-prod-confirm data.data`, data.data);
          } else {
            this.root.alert.showAlert('구매확정 되었습니다.');
          }

          if (isFunction(onSuccess)) {
            onSuccess();
          }
        } catch (e) {
          this.root.alert.showAlert({
            content: '구매확정 요청에 실패했습니다.',
          });
          console.error(e);
        } finally {
          this.toggleOrderConfirmModal(false);
        }
      },

      onClose: () => {
        // 모달 닫고 데이터 리셋
        this.toggleOrderConfirmModal(false);

        this.orderConfirmModalData = Object.assign(
          {},
          this.DEFAULT_ORDER_CONFIRM_MODAL_DATA
        );
      },
    };

    this.toggleOrderConfirmModal(true);
  };

  @action
  toggleOrderConfirmModal = (isOpen) => {
    if (_.isNil(isOpen)) {
      this.isOrderConfirmModalOpen = !this.isOrderConfirmModalOpen;
    } else {
      this.isOrderConfirmModalOpen = isOpen;
    }
  };
}
