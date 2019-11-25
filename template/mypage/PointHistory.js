import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import css from './PointHistory.module.scss';
import MyPageLayout from 'components/mypage/MyPageLayout';
import PointDashboard from 'components/mypage/point/PointDashboard';
import PeriodSelector from 'components/mypage/PeriodSelector';
import { dateUnit } from 'childs/lib/constant/date';
import { inject, observer } from 'mobx-react';

@withRouter
@inject('mypagePoint')
@observer
class PointHistory extends React.Component {
  componentDidMount() {
    this.handleChangePeriod();
    this.getPointSummary();
  }

  getPointSummary = () => {
    const { mypagePoint } = this.props;

    mypagePoint.getPointSummary();
  };

  handleChangePeriod = ({ startDate, endDate } = {}) => {
    const { mypagePoint } = this.props;

    mypagePoint.getPointHistory({
      startDate,
      endDate,
      pageNo: 1,
    });
  };

  handleChangePage = page => {
    this.props.mypagePoint.getPointHistory({ pageNo: page });
  };

  render() {
    let { mypagePoint } = this.props;
    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        toolBar={false}
        headerShape={'mypage'}
      >
        <MyPageLayout>
          <div className={css.wrap}>
            <PointDashboard props={mypagePoint.pointSummary} />

            <PeriodSelector
              defaultTabItems={[
                { value: 1, unit: dateUnit.WEEK },
                { value: 15, unit: dateUnit.DAY },
                { value: 30, unit: dateUnit.DAY },
                { value: 3, unit: dateUnit.MONTH },
                { value: 6, unit: dateUnit.MONTH },
                { value: 1, unit: dateUnit.YEAR },
                { value: 3, unit: dateUnit.YEAR },
              ]}
              monthlyTabRange={0}
              onChangePeriod={this.handleChangePeriod}
            />
          </div>
        </MyPageLayout>
      </DefaultLayout>
    );
  }
}

export default PointHistory;
