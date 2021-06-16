import React from 'react';
import css from './Styles.module.scss';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * DeliveryDelayModal
 * @param {Boolean} isOpen : 모달 on / off
 * @param {Function} onClose : 모달 Close
 * @param {Object} Order : OrderComplete
 * @returns {React.Component} DeliveryDelayModal
 */
function DeliveryDelayModal({ isOpen, onClose, order }) {
  const delayDeadlineDate = order?.delayDeadlineTimestamp
    ? moment(order?.delayDeadlineTimestamp).format('YYYY.MM.DD')
    : '';

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      contentLabel={'DeliveryDelayModal'}
    >
      <div className={css.wrap}>
        <div className={css.header}>
          발송지연상세
          <div className={css.delIcon} onClick={onClose} />
        </div>
        <div className={css.divider} />
        <div className={css.headerContentsWrap}>
          {/* 발송지연 사유 */}
          <div className={css.headerContentsRow}>
            <div className={css.headerContentsCol}>
              <div className={css.title}>발송지연 사유</div>
            </div>
          </div>
          <div className={css.headerContentsRow}>
            <div className={css.headerContentsCol}>
              <div className={css.content}>{order?.delayReason}</div>
            </div>
          </div>

          {/* 발송기한 */}
          <div className={css.headerContentsRow}>
            <div className={css.headerContentsCol}>
              <div className={css.title}>발송기한</div>
            </div>
          </div>
          <div className={css.headerContentsRow}>
            <div className={css.headerContentsCol}>
              <div className={css.content}>{delayDeadlineDate}</div>
            </div>
          </div>

          {/* 발송지연 상세이유 */}
          <div className={css.headerContentsRow}>
            <div className={css.headerContentsCol}>
              <div className={css.title}>발송지연 상세이유</div>
            </div>
          </div>
          <div className={css.headerContentsRow}>
            <div className={css.headerContentsCol}>
              <div className={css.content}>{order?.delayReasonDetail}</div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
DeliveryDelayModal.prototype = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  order: PropTypes.shape({
    delayDeadlineTimestamp: PropTypes.number,
    delayReason: PropTypes.string,
    delayReasonDetail: PropTypes.string,
  }),
};
export default DeliveryDelayModal;
