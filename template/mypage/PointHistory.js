import React from 'react';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import css from './PointHistory.module.scss';
import MypageLayout from 'components/mypage/MypageLayout';
import PointDashboard from 'components/mypage/point/PointDashboard';
import PeriodSelector from 'components/mypage/PeriodSelector';
import { dateUnit } from 'lib/constant/date';
import { inject, observer } from 'mobx-react';
import PointItem from 'components/mypage/point/PointItem';

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

  handleChangePage = (page) => {
    this.props.mypagePoint.getPointHistory({ pageNo: page });
  };

  render() {
    let { mypagePoint } = this.props;
    return (
      <DefaultLayout
        topLayout={'main'}
        toolBar={false}
        headerShape={'mypage'}
        kakaoChat={false}
      >
        <MypageLayout
          headerShape={'mypageDetail'}
          pageTitle={'포인트'}
          kakaoChat={false}
        >
          <div className={css.wrap}>
            <PointDashboard props={mypagePoint.pointSummary} />

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

            <div className={css.pointHistoryList}>
              {mypagePoint.pointHistory.length > 0 ? (
                mypagePoint.pointHistory.map((data, index) => {
                  return (
                    <PointItem
                      key={index}
                      data={data}
                      delete={() => {
                        mypagePoint.pointDelete(data.id);
                      }}
                    />
                  );
                })
              ) : (
                <div className={css.pointHistoryNodata}>
                  <div>
                    <img
                      src="/public/icon/icon-no-data@3x.png"
                      alt="데이터 없음"
                    />
                  </div>
                  해당 기간은 포인트 내역이 없습니다.
                </div>
              )}
            </div>
            {mypagePoint.totalItemsPage > 1 &&
            mypagePoint.totalItemsPage > mypagePoint.page ? (
              <div
                className={css.more}
                onClick={() => {
                  mypagePoint.getMorePointHistory();
                }}
              >
                더 보기
                <i className={css.detailBtn} />
              </div>
            ) : null}
          </div>
        </MypageLayout>
      </DefaultLayout>
    );
  }
}

export default PointHistory;
