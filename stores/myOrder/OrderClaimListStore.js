import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant/date';
import { pushRoute } from 'childs/lib/router';
import { DEFAULT_PERIOD } from 'components/mypage/PeriodSelector';
import orderClaimService from 'childs/lib/API/claim/orderClaimService';

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
}
