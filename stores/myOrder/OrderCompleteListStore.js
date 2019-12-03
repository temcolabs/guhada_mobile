import React from 'react';
import _ from 'lodash';
import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import moment from 'moment';
import { pushRoute } from 'childs/lib/router';
import qs from 'qs';
import isFunction from 'childs/lib/common/isFunction';
import orderService from 'childs/lib/API/order/orderService';
import { devLog } from 'childs/lib/common/devLog';
import isTruthy from 'childs/lib/common/isTruthy';
import pointProcessService from 'childs/lib/API/benefit/pointProcessService';

const reviewModalType = {
  WRITE: 'Write',
  MODIFY: 'Modify',
};

/**
 * 내 주문 목록
 *
 * 주문 완료 목록,
 * 주문 취소 목록을 함께 관리한다.
 */
export default class OrderListStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  // 나의 주문 상태
  @observable
  myOrderStatus = {
    deliveryComplete: 0,
    paymentComplete: 0,
    prepareProduct: 0,
    sending: 0,
    waitingPayment: 0,
  };

  // 주문 취소 ・ 교환 ・ 반품 상태
  @observable
  myCancelOrderStatus = {
    cancelOrder: 0,
    exchangeOrder: 0,
    returnOrder: 0,
  };

  // 나의 주문리스트
  @observable
  list = [];

  // 목록 로딩 여부. 로딩스피너 및 중복 호출 방지를 위함
  @observable
  isLoadingList = false;

  @action emtpyList = () => {
    this.list = [];
  };

  // UI에서 사용중인 1개의 주문상품 고유 키.(1개의 주문은 복수의 상품을 가질 수 있음)
  @observable
  targetOrderProdGroupId = null;

  // UI에서 사용중인 주문 상품 데이터
  @computed
  get targetOrderItem() {
    return this.list.find(
      item => item.orderProdGroupId === this.targetOrderProdGroupId
    );
  }

  // 조회 기간
  @observable
  period = {
    startDate: null,
    endDate: null,
  };

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

  @computed
  get isNoResults() {
    return !this.isLoadingList && this.list?.length === 0;
  }

  // 배송지 수정 모달
  @observable
  isOrderAddressEditModalOpen = false;

  // 배송지 수정 모달 초기값. 객체 형태는 OrderAddressEditModal 컴포넌트 참조
  @observable
  orderAddressEditModalInitialValue = {};
  orderAddressEditModalPurchaseId = null;

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

  @action
  getMyOrderStatus = async params => {
    try {
      const { data } = await API.order.get(`/order/my-orders-status`, {
        params,
      });
      this.myOrderStatus = data.data;
    } catch (e) {
      console.error('/order/my-orders-status', e);
    }
  };

  /**
   * 나의 주문리스트
   */
  @action
  getMyOrders = async ({
    startDate = this.period.startDate,
    endDate = this.period.endDate,
    pageNo = this.page,
  } = {}) => {
    if (!this.isLoadingList) {
      // 목록 새로고침을 위해 기간을 저장해 둔다.
      this.changePeriod({ startDate, endDate });
      this.page = pageNo;

      this.isLoadingList = true;

      try {
        const { data } = await API.order.get(`/order/my-order-list`, {
          params: {
            startTimestamp: +moment(startDate).startOf('day'),
            endTimestamp: +moment(endDate).endOf('day'),
            page: pageNo,
          },
        });
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
    }
  };

  // ============================================================
  // 주문 배송 관련 액션
  // ============================================================

  /**
   * 주문 상세 조회 버튼 클릭
   */
  handleClickShowOrderButton = ({ purchaseId } = {}) => {
    this.redirectToOrderCompleteDetail({ purchaseId });
  };

  /**
   * 배송지 수정 버튼 클릭
   */
  handleClickEditAddressButton = async (orderListItem = {}) => {
    this.openOrderAddressEditModal({ purchaseId: orderListItem.purchaseId });
  };

  @action
  toggleOrderConfirmModal = isOpen => {
    if (_.isNil(isOpen)) {
      this.isOrderConfirmModalOpen = !this.isOrderConfirmModalOpen;
    } else {
      this.isOrderConfirmModalOpen = isOpen;
    }
  };

  /**
   * 구매 확정 버튼 클릭
   */
  @action
  handleClickConfirmOrderButton = async ({
    order = {},
    onSuccess = () => {}, // 성공 콜백. 현재 목록 새로고침 사용 중
  }) => {
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
        item => item.dueSaveType === 'BUY'
      )?.totalPoint,

      // 리뷰 작성시 포인트
      dueSavePointOnReview: dueSavePointList?.find(
        item => item.dueSaveType === 'REVIEW'
      )?.totalPoint,

      dueSavePointOnFirstPurchase: dueSavePointList?.find(
        item => item.dueSaveType === 'FIRST_ORDER'
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

  /**
   * 취소 신청
   * 취소 신청 페이지로 이동
   */
  handleClickCancelOrderButton = ({ orderProdGroupId } = {}) => {
    pushRoute(`/mypage/orders/claim/cancel/form`, {
      query: {
        orderProdGroupId,
      },
    });
  };

  /**
   * 교환 신청 버튼 클릭 -> 신청 페이지로 이동
   */
  handleClickExchangeOrderButton = ({ orderProdGroupId } = {}) => {
    pushRoute(`/mypage/orders/claim/exchange/form`, {
      query: {
        orderProdGroupId,
      },
    });
  };

  /**
   * 목록에서 교환 신청 수정 버튼 클릭
   */
  handleClickEditExchangeFormButton = ({
    orderClaimId,
    orderProdGroupId,
  } = {}) => {
    pushRoute(`/mypage/orders/claim/exchange-edit/form`, {
      query: {
        orderClaimId,
        orderProdGroupId,
      },
    });
  };

  /**
   * 교환 철회
   */
  handleClickWithdrawExchangeButton = (orderListItem = {}) => {
    this.root.alert.showConfirm({
      content: () => (
        <div>
          <div>교환 요청을 철회하시겠습니까?</div>
          <div>교환 요청은 최대 3회까지 요청가능하며,</div>
          <div>경우에 따라 제한될 수 있습니다.</div>
        </div>
      ),
      onConfirm: () => {
        this.root.orderClaimForm.withdrawOrderExchange({
          orderClaimId: orderListItem.orderClaimId,
          onSuccess: () => {
            this.root.alert.showAlert('교환 요청이 철회되었습니다.');
            this.root.orderClaimList.getMyCancelOrders(); // 목록 새로고침
          },
        });
      },
    });
  };

  /**
   * 목록에서 반품 신청 버튼 클릭
   */
  handleClickReturnOrderButton = ({ orderProdGroupId } = {}) => {
    pushRoute(`/mypage/orders/claim/return/form`, {
      query: { orderProdGroupId },
    });
  };

  /**
   * 목록 반품 신청 수정 버튼 클릭
   */
  handleClickEditReturnFormButton = ({
    orderClaimId,
    orderProdGroupId,
  } = {}) => {
    pushRoute(`/mypage/orders/claim/return-edit/form`, {
      query: {
        orderClaimId,
        orderProdGroupId,
      },
    });
  };

  /**
   * 반품 철회
   */
  handleClickWithdrawReturnButton = (orderListItem = {}) => {
    this.root.alert.showConfirm({
      content: () => (
        <div>
          <div>반품 요청을 철회하시겠습니까?</div>
          <div>반품 요청은 최대 3회까지 요청가능하며,</div>
          <div>경우에 따라 제한될 수 있습니다.</div>
        </div>
      ),
      onConfirm: () => {
        this.root.orderClaimForm.withdrawOrderReturn({
          orderClaimId: orderListItem.orderClaimId,
          onSuccess: () => {
            this.root.alert.showAlert('반품 요청이 철회되었습니다.');
            this.root.orderClaimList.getMyCancelOrders(); // 목록 새로고침
          },
        });
      },
    });
  };

  /**
   * 리뷰 작성
   * 주문 배송 목록, 취소 목록에서 사용
   */
  handleClickWriteReviewButton = (orderListItem = {}) => {
    // 리뷰 작성 대상 주문 상품 정보 저장
    this.root.mypagereview.setOrderProdGroup(orderListItem);

    this.root.mypagereview.setIsReviewModalOpen({
      isOpen: true,
      type: reviewModalType.WRITE,
    });
  };

  /**
   * 리뷰 수정
   * 주문 배송 목록, 취소 목록에서 사용
   */
  handleClickEditReviewButton = async (orderListItem = {}) => {
    try {
      // 리뷰 데이터 가져오기
      await this.root.mypagereview.getReviewData({
        productId: orderListItem.productId,
        reviewId: orderListItem.reviewId,
      });

      // 리뷰를 작성할 주문 상품 정보 지정
      this.root.mypagereview.setOrderProdGroup(orderListItem);

      this.root.mypagereview.setIsReviewModalOpen({
        isOpen: true,
        type: reviewModalType.MODIFY,
      });
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 주문 목록 중에서 상품 데이터 1건 가져옴
   */
  @action
  getOrderProdGroupById = orderProdGroupId => {
    return this.list.find(item => item.orderProdGroupId === orderProdGroupId);
  };

  /**
   * 주문 완료 목록으로 이동
   */
  redirectToOrderCompleteList = () => {
    pushRoute(`/mypage/orders/complete/list`);
  };

  /**
   * 주문 완료 상세로 이동
   * orderClaimId 필요
   */
  redirectToOrderCompleteDetail = ({ purchaseId } = {}) => {
    pushRoute(`/mypage/orders/complete/detail/${purchaseId}`);
  };

  /**
   * 배송지 주소 수정 모달 열기
   */
  @action
  openOrderAddressEditModal = async ({ purchaseId }) => {
    try {
      // 주문 상세정보 API 호출
      const { data } = await orderService.getOrderComplete({ purchaseId });
      const shippingAddress = data.data?.shippingAddress;

      if (shippingAddress) {
        // 모달 초기값 할당
        this.orderAddressEditModalInitialValue = {
          defaultAddress: shippingAddress.addressDefault,
          address: shippingAddress.addressBasic,
          detailAddress: shippingAddress.addressDetail,
          recipientMobile: shippingAddress.phone,
          recipientName: shippingAddress.receiverName,
          roadAddress: shippingAddress.roadAddress,
          safetyMobile: !!shippingAddress.safetyMobile,
          shippingMessage: shippingAddress.message,
          shippingName: shippingAddress.addressName,
          zip: shippingAddress.zipcode,
        };

        // 배송지 수정 모달 열기
        this.orderAddressEditModalPurchaseId = purchaseId;
        this.isOrderAddressEditModalOpen = true;
      } else {
        throw new Error();
      }
    } catch (e) {
      console.error(e);
    }
  };

  @action
  closeOrderAddressEditModal = () => {
    // 모달 관련 데이터 초기화
    this.orderAddressEditModalInitialValue = {};
    this.isOrderAddressEditModalOpen = false;
    this.orderAddressEditModalPurchaseId = null;
  };

  updateShippingAddress = async ({ shippingAddress, purchaseId }) => {
    try {
      await orderService.updateShippingAddress({
        purchaseId,
        addShippingAddress: shippingAddress.defaultAddress,
        shippingAddress,
      });

      this.closeOrderAddressEditModal();
      this.root.alert.showAlert('배송 주소지가 수정되었습니다.');
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다.');
      console.error(e);
    }
  };
}
