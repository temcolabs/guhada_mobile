import React from 'react';
import css from './FirstPurchase.module.scss';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';

const FirstPurchase = ({ isOpen, eventpopup }) => {
  return useObserver(() => (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => {}}
      contentStyle={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      zIndex={1000}
    >
      <div className={css.wrap}>
        <div className={css.content} />
        <div className={css.buttonGroup}>
          <div
            className={css.stop}
            onClick={() => {
              eventpopup.firstPurchasePopupClose('stop');
            }}
          >
            그만보기
          </div>
          <div
            className={css.close}
            onClick={() => {
              eventpopup.firstPurchasePopupClose();
            }}
          >
            닫기
          </div>
        </div>
      </div>
    </ModalWrapper>
  ));
};

export default inject('eventpopup')(FirstPurchase);
