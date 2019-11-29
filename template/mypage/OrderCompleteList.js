import React, { Component } from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import MypageLayout from 'components/mypage/MypageLayout';
import PeriodSelector from 'components/mypage/PeriodSelector';
import { dateUnit } from 'childs/lib/constant';

/**
 * 마이페이지 - 주문 배송 (주문 완료 목록)
 */
@withRouter
class OrderCompleteList extends Component {
  render() {
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
          <div>주문배송</div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default OrderCompleteList;
