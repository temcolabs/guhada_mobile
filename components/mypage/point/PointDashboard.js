import React from 'react';
import css from './PointDashboard.module.scss';
const PointDashboard = ({ props }) => {
  return (
    <div className={css.wrap}>
      <div className={css.top}>
        <div className={css.availablePointWrap}>
          <div className={css.availablePointTitle}>사용 가능 포인트</div>
          <div className={css.availablePointValue}>
            {Number.isInteger(props.totalFreePoint) ||
            Number.isInteger(props.totalPaidPoint)
              ? `${props.totalFreePoint.toLocaleString()}P`
              : '-'}
          </div>
        </div>
      </div>
      <div className={css.bottom}>
        <div className={css.bottomSection}>
          <div className={css.dueSaveWrap}>
            <div className={css.dueSavePointValue}>
              {Number.isInteger(props.totalDueSavePoint)
                ? `${props.totalDueSavePoint?.toLocaleString()}P`
                : '(-)'}
            </div>
            <div className={css.dueSavePointTitle}>적립예정</div>
          </div>
        </div>

        <div className={css.bottomSection}>
          <div className={css.savedPointWrap}>
            <div className={css.savedPointValue}>
              {Number.isInteger(props.totalFreePoint)
                ? `${props.totalFreePoint.toLocaleString()}P`
                : '-'}
            </div>
            <div className={css.savedPointTitle}>적립 포인트</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointDashboard;
