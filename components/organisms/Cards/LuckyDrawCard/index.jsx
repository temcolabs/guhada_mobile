import React, { useEffect, useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';

import LuckyDrawTimer from 'components/atoms/Timer/LuckyDrawTimer';
import LuckyDrawPhotoFrame from '../../../molecules/PhotoFrame/LuckyDrawCardFrame';

import {
  Wrapper,
  SectionForm,
  SectionFormHeader,
  SectionFormPrice,
  SectionFormPriceRate,
  SectionFromSellPrice,
  SectionFromSellDiscountPrice,
  SectionNotify,
  SectionNotifyItem,
  WrapperDivder,
} from './Styled';

import LuckyDrawButton from 'components/atoms/Button/LuckyDrawButton';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import { getTimeDiff } from 'childs/lib/common/getTimeDiff';
import moment from 'moment';

/**
 * 럭키드로우 Card
 * @param {String} brandName : 상품 브랜드명
 * @param {Number} dealId : 상품 ID
 * @param {Number} discountPrice : 할인 금액
 * @param {Number} discountRate : 할인율
 * @param {String} imageUrl : 상품 이미지
 * @param {Number} requestFromAt : 이벤트 시작 시간
 * @param {Number} requestToAt : 이벤트 마감 시간
 * @param {Number} sellPrice : 판매 가격
 * @param {String} statusCode : 상품 상태 (NORMAL, READY, START, REQUESTED)
 * @param {String} statusText : 상품 상태 submit text
 * @param {String} title : 상품 제목
 * @param {Number} winnerAnnouncementAt : 발표 일자
 * @param {Number} winnerBuyFromAt : 구매 시작
 * @param {Nubmer} winnerBuyToAt} : 구매 마감
 * @returns
 */
function LuckyDrawCard({
  brandName,
  dealId,
  discountPrice,
  discountRate,
  imageUrl,
  requestFromAt,
  requestToAt,
  sellPrice,
  statusCode,
  statusText,
  title,
  winnerAnnouncementAt,
  winnerBuyFromAt,
  winnerBuyToAt,
  onClickRequestLuckyDraw,
}) {
  /**
   * states
   */
  const timer = useRef(null); // 럭키드로우 타이머 Interval
  const [deadLine, setDeadLine] = useState(null); // 럭키드로우 타이머 String

  /**
   * side effects
   */
  useEffect(() => {
    if (!timer.current) countDown();
    timer.current = setInterval(countDown, 1000);
    return () => clearInterval(timer.current);
  }, [requestToAt]);

  /**
   * helpers
   */

  /**
   * 럭키드로우 타이머 카운트다운
   */
  const countDown = () => {
    const timeStamp = getTimeDiff(requestToAt, Date.now());
    if (timeStamp > 0) {
      const time = moment.duration(timeStamp)?._data;
      setDeadLine({
        day: time.days,
        date: `
          ${moment(time).format('HH')} :
          ${moment(time).format('mm')} :
          ${moment(time).format('ss')}
        `,
      });
    } else {
      clearInterval(timer.current);
    }
  };

  const MemoWrapper = React.memo(Wrapper);
  const MemoLuckyDrawPhotoFrame = React.memo(LuckyDrawPhotoFrame);
  const MemoLuckyDrawButton = React.memo(LuckyDrawButton);
  const MemoSectionForm = React.memo(SectionForm);

  /**
   * render
   */
  return (
    <>
      <MemoWrapper>
        {/* 타이머 헤더 */}
        {deadLine && (statusCode === 'START' || statusCode === 'REQUESTED') && (
          <LuckyDrawTimer day={deadLine.day} date={deadLine.date} />
        )}

        {(statusCode === 'NORMAL' || statusCode === 'READY') && (
          <LuckyDrawTimer text={statusText.replace('오픈', 'OPEN')} />
        )}

        {/* 이미지 영역 */}
        <MemoLuckyDrawPhotoFrame imageUrl={imageUrl} statusCode={statusCode} />

        {/* 응모하기 폼 */}
        {/* TODO : 컴포넌트 분리 */}
        <MemoSectionForm>
          <SectionFormHeader>
            <div>{brandName}</div>
            <div>{title}</div>
          </SectionFormHeader>
          <SectionFormPrice>
            <div>
              <SectionFormPriceRate>
                <span>{discountRate}%</span>
              </SectionFormPriceRate>
              <SectionFromSellDiscountPrice>
                <span>{addCommaToNum(sellPrice)}</span>
              </SectionFromSellDiscountPrice>
            </div>
            <SectionFromSellPrice>
              <span>{addCommaToNum(discountPrice)}</span>
              <span>원</span>
            </SectionFromSellPrice>
          </SectionFormPrice>
          <MemoLuckyDrawButton
            isActive={statusCode === 'START' ? true : false}
            contents={
              statusCode === 'NORMAL' || statusCode === 'READY'
                ? '오픈예정'
                : statusText
            }
            onClick={() => onClickRequestLuckyDraw(dealId)}
          />
          {/* TODO : Atoms > Paragraph > LuckyDaraw Notifiy */}
          <SectionNotify>
            <SectionNotifyItem>
              <span>응모기간</span>
              <span />
              <span>
                {moment(requestFromAt).format('M월 DD일 (ddd) HH:mm')} ~{' '}
                {moment(requestToAt).format('M월 DD일 (ddd) HH:mm')}
              </span>
            </SectionNotifyItem>
            <SectionNotifyItem>
              <span>발표일자</span>
              <span />
              <span>
                {moment(winnerAnnouncementAt).format('M월 DD일 (ddd) HH:mm')}
              </span>
            </SectionNotifyItem>
            <SectionNotifyItem>
              <span>구매기간</span>
              <span />
              <span>
                {moment(winnerBuyFromAt).format('M월 DD일 (ddd) HH:mm')} ~{' '}
                {moment(winnerBuyToAt).format('M월 DD일 (ddd) HH:mm')}
              </span>
            </SectionNotifyItem>
          </SectionNotify>
        </MemoSectionForm>
        <WrapperDivder />
      </MemoWrapper>
    </>
  );
}

LuckyDrawCard.propTypes = {
  brandName: PropTypes.string,
  discountPrice: PropTypes.number,
  discountRate: PropTypes.number,
  imageUrl: PropTypes.string,
  requestToAt: PropTypes.number,
  sellPrice: PropTypes.number,
  statusCode: PropTypes.string,
  statusText: PropTypes.string,
  title: PropTypes.string,
  onClickRequestLuckyDraw: PropTypes.func,
};

export default memo(LuckyDrawCard);
