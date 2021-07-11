import React from 'react';
import css from './AppEventPopup.module.scss';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react';

const AppEventPopup = ({ isOpen, eventpopup, data }) => {
  return useObserver(() => (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => {}}
      contentStyle={{
        background: 'transparent',
      }}
      zIndex={1000}
    >
      <div className={css.wrap}>
        {data.appDownLink ? (
          <a href={data.appDownLink} target="_blank" rel="noopener noreferrer">
            <div
              className={css.content}
              style={{
                backgroundImage: `url(${
                  data.agent === 'MOBILE' ? data.imgUrlM : data.imgUrl
                })`,
              }}
            />
          </a>
        ) : data.detailPageLink ? (
          <a
            href={data.detailPageLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className={css.content}
              style={{
                backgroundImage: `url(${
                  data.agent === 'MOBILE' ? data.imgUrlM : data.imgUrl
                })`,
              }}
            />
          </a>
        ) : (
          <div
            className={css.content}
            style={{
              backgroundImage: `url(${
                data.agent === 'MOBILE' ? data.imgUrlM : data.imgUrl
              })`,
            }}
          />
        )}

        <div className={css.buttonGroup}>
          <div
            className={css.stop}
            onClick={() => {
              eventpopup.appEventPopupClose({ stop: true }, data.eventTitle);
            }}
          >
            그만보기
          </div>
          <div
            className={css.close}
            onClick={() => {
              eventpopup.appEventPopupClose({}, data.eventTitle);
            }}
          >
            닫기
          </div>
        </div>
      </div>
    </ModalWrapper>
  ));
};

export default inject('eventpopup')(AppEventPopup);
