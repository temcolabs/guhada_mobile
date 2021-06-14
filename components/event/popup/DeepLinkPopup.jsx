import React from 'react';
import PropTypes from 'prop-types';
import css from './DeepLinkPopup.module.scss';
import { observer } from 'mobx-react-lite';

import ModalWrapper from 'components/common/modal/ModalWrapper';
import StarItem from 'components/mypage/review/StarItem';

const IMAGE_PATH = {
  homeIcon: '/static/icon/home_icon.png',
  shareBtn: '/static/icon/event/sharing-arrow-r-line@2x.png',
};

function DeepLinkPopup({ isOpen, onClose }) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      contentStyle={{
        background: 'transparent',
      }}
      zIndex={1000}
    >
      <div className={css.moveToAppPopupWrap}>
        <div className={css.deeplink__info}>
          <div className={css.deeplink__info__logo}>
            <img src={IMAGE_PATH.homeIcon} alt={'구하다 로고'} />
          </div>
          <div className={css.deeplink__info__desc}>
            <div className={css.stars}>앱스토어 후기 {StarItem('FIVE')}</div>
            <div className={css.description}>
              "상품 보기도 편하고 결제도 빨라요!"
            </div>
          </div>
        </div>
        <div className={css.deeplink__btn} onClick={onClose}>
          구하다앱으로 보기
          <img src={IMAGE_PATH.shareBtn} alt={'앱으로 보기 버튼'} />
        </div>
        <div className={css.close__btn} onClick={onClose}>
          괜찮습니다. 모바일웹으로 볼게요.
        </div>
      </div>
    </ModalWrapper>
  );
}

DeepLinkPopup.propTypes = {};

export default observer(DeepLinkPopup);
