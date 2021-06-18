import React, { Component } from 'react';
import css from './TimeDeal.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import CategorySlider from 'components/common/CategorySlider';
import { mainCategory } from 'childs/lib/constant/category';
import { observer, inject } from 'mobx-react';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { withRouter } from 'next/router';
import TimeDealItem from 'components/home/TimeDealItem';

@withScrollToTopOnMount
@withRouter
@inject('main', 'searchitem', 'timedeal')
@observer
class TimeDeal extends Component {
  render() {
    const { main, timedeal } = this.props;
    return (
      <DefaultLayout title={null} topLayout={'main'}>
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={main.setNavDealId}
        />
        <div className={css.wrap}>
          {timedeal.timeDeal.length ? (
            <div
              className={css.bg}
              style={{
                backgroundImage: `url(${
                  process.env.API_CLOUD
                }/images/background/timedeal/time_deal_bg_mobile.png)`,
              }}
            >
              {timedeal.timeDeal.map((deal, index) => {
                return (
                  <div key={index}>
                    <TimeDealItem deal={deal} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={css.empty}>
              진행 중인 타임딜이 없습니다.
            </div>
          )}
        </div>
      </DefaultLayout>
    );
  }
}

export default TimeDeal;
