import React from 'react';
import css from './LuckyDrawApplyModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import moment from 'moment';

import { inject } from 'mobx-react';

function LuckyDrawApplyModal({ luckyDraw, isOpen, data }) {
  return (
    <div>
      <SlideIn direction={slideDirection.BOTTOM} isVisible={isOpen}>
        <div className={css.wrap}>
          <div className={css.innerContent}>
            <div className={css.contentWrap}>
              <div
                className={css.close}
                onClick={() => {
                  luckyDraw.closeModal();
                }}
              />

              <div className={css.content}>
                <div className={css.title}>{data?.title}</div>

                <div className={css.complete}>
                  <span>럭키드로우</span>
                  <span> 응모 완료</span>
                </div>

                <div
                  className={css.itemImage}
                  style={{ backgroundImage: `url(${data?.imageUrl})` }}
                />

                <div
                  className={css.confirmButton}
                  onClick={() => {
                    luckyDraw.closeModal();
                  }}
                >
                  확인
                </div>
              </div>
            </div>
            <div className={css.noticeWrap}>
              <div className={css.noticeDate}>
                <div className={css.noticeDateSection}>
                  <span className={css.dateType}>당첨자 발표일</span>
                  <span className={css.date}>
                    {moment(data?.winnerAnnouncementAt).format(
                      'M월 D일 (dd) HH:mm'
                    )}
                  </span>
                </div>
                <div className={css.noticeDateSection}>
                  <span className={css.dateType}>당첨자 구매기간</span>
                  <span className={css.date}>
                    {`${moment(data?.requestFromAt).format(
                      'M월 D일 (dd) HH:mm'
                    )} - ${moment(data?.requestToAt).format(
                      'M월 D일 (dd) HH:mm'
                    )}`}
                  </span>
                </div>
              </div>

              <div className={css.notify}>
                <div>
                  · 당첨자 발표는 본인인증한 휴대전화 번호로 이뤄집니다.
                </div>
                <div>
                  · 당첨 안내수신 후 24시간 내 답변이 없을 시 취소 처리됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('luckyDraw')(LuckyDrawApplyModal);
