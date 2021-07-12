import React, { Component, useCallback } from 'react';
import css from './QuickDeliveryTrackingModal.module.scss';
import cn from 'classnames';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { dateFormat } from 'lib/constant/date';
import { compose } from 'lodash/fp';
import ModalLayout, {
  useModalLayoutState,
} from 'components/layout/ModalLayout';

const enhancer = compose(inject('myDelivery'), observer);

function QuickDeliveryTrackingModal({ myDelivery, isModalOpen }) {
  const { deliveryInfo = {} } = myDelivery;
  const { isModalLayoutOpen, closeModalLayout } = useModalLayoutState({
    isModalOpen,
    isOpenOnMount: false,
    onClose: useCallback(() => {}, []),
  });

  return (
    <ModalLayout
      pageTitle={'퀵배송 조회'}
      isOpen={myDelivery.isQuickDeliveyTrackingModalOpen}
      onClose={myDelivery.closeDeliveryTrackingModal}
    >
      <div className={css.wrap}>
        <div className={css.deliveryInfo}>
          <div className={css.deliveryInfo__detail}>
            <div className={css.deliveryInfo__text}>퀵배송 정보입니다.</div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>배송 방법</div>
            <div className={css.deliveryInfo__content}>택배</div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>배송 업체</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.quickCompany}
            </div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>업체 전화번호</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.quickPhoneNumber}
            </div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>예상 출발시간</div>
            <div className={css.deliveryInfo__content}>
              {moment(deliveryInfo?.dueStartDeliveryTime).format(
                dateFormat.YYYYMMDD_UI
              )}{' '}
              {moment(deliveryInfo?.dueStartDeliveryTime).format(
                dateFormat.HHMM
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
}

export default enhancer(QuickDeliveryTrackingModal);
