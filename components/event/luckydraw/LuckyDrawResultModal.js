import React from 'react';
import css from './LuckyDrawResultModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject } from 'mobx-react';

function LuckyDrawResultModal({ luckyDraw, isOpen, data }) {
  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isOpen}>
        <div className={css.wrap}>
          <div className={css.contentWrap}>
            <div
              className={css.close}
              onClick={() => {
                luckyDraw.closeModal();
              }}
            />

            <div className={css.content}>
              <div className={css.complete}>
                <span>당첨자</span>
                <span> 발표</span>
              </div>
              <div className={css.title}>{data?.title}</div>

              <div className={css.winner}>{data?.userName}</div>
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('luckyDraw')(LuckyDrawResultModal);
