import css from './SpecialDetailHeader.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';

const SpecialDetailHeader = ({ specialDetail, handleCopyUrlToClipboard }) => (
  <div className={css['special-detail-header']}>
    <div className={css['header__info']}>
      <div className={css['info-wrap']}>
        <div className={css['header__info__title']}>{specialDetail.title}</div>
        {specialDetail.startDate && (
          <div className={css['header__info__date']}>
            {moment(specialDetail.startDate).format('YYYY. MM. DD')} ~{' '}
            {specialDetail.endDate &&
              moment(specialDetail.endDate).format('YYYY. MM. DD')}
          </div>
        )}
      </div>
      <div
        className={css['header__info__copy']}
        onClick={handleCopyUrlToClipboard}
      />
    </div>
    <div className={css['header__image']}>
      <img src={specialDetail.mobileImageUrl} />
    </div>
  </div>
);

SpecialDetailHeader.propTypes = {
  specialDetail: PropTypes.shape({
    title: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    mobileImageUrl: PropTypes.string,
  }),
  handleCopyUrlToClipboard: PropTypes.func,
};

export default observer(SpecialDetailHeader);
