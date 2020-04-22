import React, { Component, useCallback } from 'react';
import css from './DeliveryTrackingModal.module.scss';
import cn from 'classnames';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant/date';
import { statusClassName } from 'stores/mypage/MypageDeliveryStore';
import { compose } from 'lodash/fp';
import ModalLayout, {
  useModalLayoutState,
} from 'components/layout/ModalLayout';

const enhancer = compose(
  inject('myDelivery'),
  observer
);

/**
 * 배송조회 모달
 */
function DeliveryTrackingModal({ myDelivery, isModalOpen }) {
  const { deliveryInfo = {} } = myDelivery;
  const shippingStatus = myDelivery.getCurrentShippingStatus(
    deliveryInfo?.level // level은 2~6. .store 참조
  );

  const { isModalLayoutOpen, closeModalLayout } = useModalLayoutState({
    isModalOpen,
    isOpenOnMount: false,
    onClose: useCallback(() => {}, []),
  });

  return (
    <ModalLayout
      pageTitle={'배송조회'}
      isOpen={myDelivery.isDeliveyTrackingModalOpen}
      onClose={myDelivery.closeDeliveryTrackingModal}
    >
      <div className={css.wrap}>
        <div className={css.deliveryInfo}>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>송장번호</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.invoiceNo}
            </div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>택배사</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.companyName}
            </div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>보낸사람</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.senderName}
            </div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>받는사람</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.receiverName}
            </div>
          </div>
          <div className={css.deliveryInfo__item}>
            <div className={css.deliveryInfo__label}>받는주소</div>
            <div className={css.deliveryInfo__content}>
              {deliveryInfo?.receiverAddr}
            </div>
          </div>
        </div>

        <div className={css.shippingProgress}>
          {shippingStatus.map((shipping, index) => {
            return (
              <div
                key={index}
                className={cn(
                  css.shippingLevelItem,
                  css[`deliveryIcon${index}`],
                  {
                    [css.active]:
                      shipping.className === statusClassName.CURRENT ||
                      shipping.className === statusClassName.PASS,
                    [css.current]:
                      shipping.className === statusClassName.CURRENT,
                    [css.pass]: shipping.className === statusClassName.PASS,
                  }
                )}
              >
                {/* 동그라미 */}
                <div
                  className={cn(css.dot, {
                    [css.pass]: shipping.className === statusClassName.PASS,
                    [css.current]:
                      shipping.className === statusClassName.CURRENT,
                  })}
                />
                {/* 라인 */}
                {index > 0 && (
                  <div
                    className={cn(css.line, {
                      [css.colored]:
                        shipping.className === statusClassName.PASS ||
                        shipping.className === statusClassName.CURRENT,
                    })}
                  />
                )}
                {/* 배송 상태 */}
                <div className={css.statusLabel}>{shipping.label}</div>
              </div>
            );
          })}
        </div>

        <div className={css.deliveryDetail}>
          {deliveryInfo?.trackingDetails
            ?.sort((a, b) => +moment(b.timeString) - +moment(a.timeString)) // 시간 역순 정렬
            .map((detail, index) => {
              return (
                <div className={css.deliveryDetail_item} key={index}>
                  <div className={css.dateWrap}>
                    <div className={css.date}>
                      {moment(detail.timeString).format(dateFormat.YYYYMMDD_UI)}
                      <div className={css.hours}>
                        {moment(detail.timeString).format(dateFormat.HHMM)}
                      </div>
                    </div>
                  </div>
                  <div className={css.detailWrap}>
                    <div className={css.detail}>
                      <div className={css.status}>
                        <span>{detail.where}</span>
                        <span>&nbsp;</span>
                        {!!detail.manName && (
                          <span>
                            ({detail.manName}
                            {!!detail.telno && <span> {detail.telno}</span>})
                          </span>
                        )}
                      </div>
                      <div className={css.location}>{detail.kind}</div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </ModalLayout>
  );
}

export default enhancer(DeliveryTrackingModal);
