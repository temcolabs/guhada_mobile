import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import MypageLayout, {
  MypageContentsWrap,
} from 'components/mypage/MypageLayout';
import PeriodSelector, {
  DEFAULT_PERIOD,
  DEFAULT_TAB_IN_USE,
} from 'components/mypage/PeriodSelector';
import { dateUnit } from 'childs/lib/constant';
import OrderDashboard from 'components/mypage/order/OrderDashboard';
import { inject, observer } from 'mobx-react';
import { scrollToTarget } from 'childs/lib/common/scroll';
import moment from 'moment';
import { pushRoute } from 'childs/lib/router';
import _ from 'lodash';

/**
 * 마이페이지 - 주문 배송 (주문 완료 목록)
 */
@withRouter
@inject(
  'orderCompleteList'
  // 'mypageAddress',
  // 'mypagereview',
  // 'myDelivery',
  // 'mypagePoint'
)
@observer
class OrderCompleteList extends Component {
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
    { value: 15, unit: dateUnit.DAY },
    { value: 30, unit: dateUnit.DAY },
  ];

  // 대쉬보드 id. 스크롤에 사용한다
  dashboardElementId = 'OrderDashboard';

  periodClickCount = 0;

  componentDidMount() {
    this.initOrdersWithQuery(this.props.router.query);
  }

  componentWillUnmount() {
    this.props.orderCompleteList.emtpyList();
  }

  get emtpyListMessage() {
    // TODO: 기간에 따라 메시지 달라져야 함
    return `주문 내역이 없습니다`;
  }

  initOrdersWithQuery = (query = {}) => {
    const { initialPeriodData } = this.state;

    const {
      startDate = initialPeriodData.period.startDate,
      endDate = initialPeriodData.period.endDate,
      tabInUse = initialPeriodData.tabInUse,
      defaultTabIndex = initialPeriodData.defaultTabIndex,
      page = 1,
    } = query;

    this.getOrders({ startDate, endDate, page });

    this.setInitialPeriodWithQuery({
      startDate,
      endDate,
      tabInUse,
      defaultTabIndex,
    });
  };

  getOrders = ({ startDate, endDate, page }) => {
    this.props.orderCompleteList.getMyOrderStatus();

    // 주문 완료 목록
    this.props.orderCompleteList.getMyOrders({
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
    this.initOrdersWithQuery(updatedQuery);
    this.pushRouteToGetList(updatedQuery);
  };

  /**
   * 페이지 선택
   */
  handleChangePage = page => {
    scrollToTarget({ id: this.dashboardElementId, behavior: 'auto' });

    const updatedQuery = {
      ...this.props.router.query,
      page, // 기간 변경시 페이지는 1로 초기화
    };

    this.initOrdersWithQuery(updatedQuery);
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
    const {
      orderCompleteList: orderCompleteListStore,
      // mypagereview,
      // mypagePoint: mypagePointStore,
    } = this.props;

    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MypageLayout>
          <PeriodSelector
            defaultTabItems={[
              { value: 1, unit: dateUnit.WEEK },
              { value: 1, unit: dateUnit.MONTH },
              { value: 3, unit: dateUnit.MONTH },
              { value: 1, unit: dateUnit.YEAR },
            ]}
            monthlyTabRange={0}
            onChangePeriod={this.handleChangePeriod}
          />

          <MypageContentsWrap wrapperStyle={{ paddingTop: '10px' }}>
            <OrderDashboard data={orderCompleteListStore.myOrderStatus} />
          </MypageContentsWrap>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderCompleteList;
