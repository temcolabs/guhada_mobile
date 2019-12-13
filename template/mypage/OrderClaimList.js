import React, { Component } from 'react';
import { withRouter } from 'next/router';
import MypageLayout, {
  MypageContentsWrap,
} from 'components/mypage/MypageLayout';
import _ from 'lodash';
import css from './OrderCompleteList.module.scss';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { dateUnit } from 'childs/lib/constant/date';
import { pushRoute } from 'childs/lib/router';
import OrderItem from 'components/mypage/order/OrderItem';
import Pagination from 'components/common/Pagination';
import PeriodSelector, {
  DEFAULT_TAB_IN_USE,
  DEFAULT_PERIOD,
} from 'components/mypage/PeriodSelector';
import { scrollToTarget } from 'childs/lib/common/scroll';
import OrderCancelDashboard from 'components/mypage/orderCancel/OrderCancelDashboard';
import EmptyListNoti from 'components/mypage/EmptyListNoti';
import LoadingPortal from 'components/common/loading/Loading';
// import ReviewWriteModal, {
//   reviewModalType,
// } from 'components/mypage/review/ReviewWriteModal';
// import SellerClaimModal from 'components/claim/sellerclaim/SellerClaimModal';
// import DeliveryTrackingModal from 'components/mypage/shipping/DeliveryTrackingModal';

/**
 * 마이페이지 - 주문 배송 (주문 취소 ・ 교환 ・ 반품 목록)
 */
@withRouter
@inject('orderClaimList', 'mypagereview')
@observer
class OrderClaimList extends Component {
  constructor(props) {
    super(props);

    const { router } = this.props;

    this.state = {
      // 날짜 선택 UI 초기값. 쿼리스트링에서 가져와 초기화한다
      initialPeriodData: {
        period: {
          startDate: moment(router.query.startDate || DEFAULT_PERIOD.startDate),
          endDate: moment(router.query.endDate || DEFAULT_PERIOD.endDat),
        },
        tabInUse: router.query.tabInUse || DEFAULT_TAB_IN_USE,
        defaultTabIndex: router.query.defaultTabIndex || 0,
      },

      // 판매자 문의하기 모달
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: false,
      },
    };
  }

  defaultPeriodTabItems = [
    { value: 1, unit: dateUnit.WEEK },
    { value: 1, unit: dateUnit.MONTH },
    { value: 3, unit: dateUnit.MONTH },
    { value: 1, unit: dateUnit.YEAR },
  ];

  // 대쉬보드 id. 스크롤에 사용한다
  dashboardElementId = 'CancelOrderDashboard';

  componentDidMount() {
    this.initClaimOrdersWithQuery(this.props.router.query);
  }

  componentWillUnmount() {
    this.props.orderClaimList.emtpyList();
  }

  get emtpyListMessage() {
    // TODO: 기간에 따라 메시지 달라져야 함
    return `최근 내역이 없습니다`;
  }

  initClaimOrdersWithQuery = query => {
    const { initialPeriodData } = this.state;

    const {
      startDate = initialPeriodData.period.startDate,
      endDate = initialPeriodData.period.endDate,
      tabInUse = initialPeriodData.tabInUse,
      defaultTabIndex = initialPeriodData.defaultTabIndex,
      page = 1,
    } = query;

    this.getClaimOrders({
      startDate,
      endDate,
      page,
    });

    this.setInitialPeriodWithQuery({
      startDate,
      endDate,
      tabInUse,
      defaultTabIndex,
    });
  };

  getClaimOrders = ({ startDate, endDate, page }) => {
    // 취소 주문 상태
    this.props.orderClaimList.getMyCancelOrderStatus({
      startDate,
      endDate,
    });

    // 취소 주문 목록
    this.props.orderClaimList.getMyCancelOrders({
      startDate,
      endDate,
      pageNo: page,
    });
  };

  setInitialPeriodWithQuery = ({
    startDate,
    endDate,
    tabInUse,
    defaultTabIndex,
  }) => {
    if (!!startDate && !!endDate && !!tabInUse) {
      this.setState({
        initialPeriodData: {
          period: {
            startDate,
            endDate,
          },
          tabInUse: tabInUse,
          defaultTabIndex,
        },
      });
    }
  };

  /**
   * 기간 선택 후 주문 목록 조회
   */
  handleChangePeriod = (
    query = {
      startDate: '2019-01-01',
      endDate: '2019-01-01',
      tabInUse: DEFAULT_TAB_IN_USE,
      defaultTabIndex: 0,
    }
  ) => {
    const updatedQuery = {
      ...query,
      page: 1, // 기간 변경시 페이지는 1로 초기화
    };
    this.initClaimOrdersWithQuery(updatedQuery);
    this.pushRouteToGetList(updatedQuery);
  };

  handleChangePage = page => {
    scrollToTarget({ id: this.dashboardElementId, behavior: 'auto' });

    const updatedQuery = {
      ...this.props.router.query,
      page, // 기간 변경시 페이지는 1로 초기화
    };

    this.initClaimOrdersWithQuery(updatedQuery);
    this.pushRouteToGetList(updatedQuery);
  };

  /**
   * 쿼리스트링 기반으로 목록 가져오기
   */
  pushRouteToGetList = (requestedQuery = {}) => {
    const query = {
      ...this.props.router.query,
      ...requestedQuery,
    };

    pushRoute(this.props.router.asPath, {
      query: _.omitBy(query, _.isNil),
    });
  };

  handleOpenSellerClaimModal = (order = {}) => {
    this.setState({
      sellerClaimModal: {
        sellerId: order.sellerId,
        orderProdGroupId: order.orderProdGroupId,
        isOpen: true,
      },
    });
  };

  handleCloseSellerClaimModal = () => {
    this.setState({
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: false,
      },
    });
  };

  render() {
    const { orderClaimList, mypagereview } = this.props;

    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        {orderClaimList.isLoadingList && <LoadingPortal />}
        <PeriodSelector
          initialData={this.state.initialPeriodData}
          defaultTabItems={this.defaultPeriodTabItems}
          monthlyTabRange={0}
          onChangePeriod={this.handleChangePeriod}
        />
        <MypageContentsWrap>
          <OrderCancelDashboard data={orderClaimList.myCancelOrderStatus} />
          {/* 취소교환반품 목록 */}
          <div className={css.listWrap}>
            {orderClaimList.isNoResults ? (
              <EmptyListNoti message={this.emtpyListMessage} />
            ) : (
              orderClaimList.list?.map((order, index) => {
                return (
                  <OrderItem
                    key={index}
                    order={order}
                    onClickInquire={this.handleOpenSellerClaimModal}
                    isClaim={true}
                    redirectToDetail={() =>
                      this.props.orderClaimList.redirectToOrderClaimDetail(
                        order
                      )
                    }
                  />
                );
              })
            )}
          </div>
          <div className={css.paginationWrap}>
            <Pagination
              initialPage={parseInt(orderClaimList.page, 10)}
              onChangePage={this.handleChangePage}
              itemsCountPerPage={orderClaimList.itemsCountPerPage}
              totalItemsCount={orderClaimList.count}
            />
          </div>
        </MypageContentsWrap>

        {/* 리뷰 작성 모달 */}
        {/* <ReviewWriteModal
          isOpen={mypagereview.isReviewWriteModalOpen}
          handleModalClose={mypagereview.closeReviewModal}
          modalData={mypagereview.orderProdGroup} // 선택한 주문 데이터
          status={reviewModalType.WRITE}
          onSuccessSubmit={() => {
            mypagereview.closeReviewModal();
            orderClaimList.getMyCancelOrders(); //  목록 새로고침
          }}
        /> */}

        {/* 리뷰 수정 모달 */}
        {/* <ReviewWriteModal
          isOpen={mypagereview.isReviewModifyModalOpen}
          handleModalClose={mypagereview.closeReviewModal}
          modalData={mypagereview.orderProdGroup} // 선택한 주문 데이터
          status={reviewModalType.MODIFY}
          reviewData={mypagereview.reviewData}
          onSuccessModify={() => {
            mypagereview.closeReviewModal();
            orderClaimList.getMyCancelOrders(); //  목록 새로고침
          }}
        /> */}

        {/* 판매자 문의하기 모달 */}
        {/* <SellerClaimModal
          sellerId={this.state.sellerClaimModal.sellerId}
          isOpen={this.state.sellerClaimModal.isOpen}
          onClose={this.handleCloseSellerClaimModal}
        /> */}
        {/* 배송 조회 모달. 컨트롤은 store에서 */}
        {/* <DeliveryTrackingModal /> */}
      </MypageLayout>
    );
  }
}

export default OrderClaimList;
