import { Component } from 'react';
import css from './TimeDeal.module.scss';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'next/router';
import TimeDealItem from 'components/home/TimeDealItem';

@withRouter
@inject('main', 'searchitem', 'timedeal')
@observer
class TimeDeal extends Component {
  render() {
    const { timedeal } = this.props;
    return (
      <div className={css.wrap}>
        {timedeal.timeDeal.length ? (
          <div
            className={css.bg}
            style={{
              backgroundImage: `url(${process.env.API_CLOUD}/images/background/timedeal/time_deal_bg_mobile.png)`,
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
          <div className={css.empty}>진행 중인 타임딜이 없습니다.</div>
        )}
      </div>
    );
  }
}

export default TimeDeal;
