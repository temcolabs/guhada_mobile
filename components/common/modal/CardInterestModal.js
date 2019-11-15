import React, { useState, useEffect } from 'react';
import css from './CardInterestModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

import { inject } from 'mobx-react';
import moment from 'moment';
function CardInterestModal({ isVisible, onClose, cardinterest }) {
  const [year, setYear] = useState('0');
  const [month, setMonth] = useState('0');
  useEffect(() => {
    setYear(moment(cardinterest?.cardInterest?.eventMonth).format('YYYY'));
    setMonth(moment(cardinterest?.cardInterest?.eventMonth).format('MM'));
  }, [cardinterest]);

  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <div className={css.headerWrap}>
            <div className={css.header}>
              <div className={css.headerTitle}>무이자 할부 안내</div>
              <div className={css.headerClose} onClick={onClose} />
            </div>
          </div>

          <div className={css.interestInfo}>
            {year && month ? (
              <div
                className={css.contentTitle}
              >{`무이자 할부정보 (${year}년 ${month}월)`}</div>
            ) : null}
            <div className={css.interestList}>
              {cardinterest?.cardInterest?.map((data, index) => {
                return (
                  <div className={css.interestItem} key={index}>
                    <div
                      className={css.cardImage}
                      style={{ backgroundImage: `url(${data.imgUrl})` }}
                    />
                    <div className={css.cardInfo}>
                      <div className={css.interestDate}>{`${
                        data.startEventDate
                      }~${data.endEventDate}`}</div>
                      <div className={css.interestNote}>{`${data.note}`}</div>
                      <div className={css.interestEtc}>
                        {data.etc ? `※ ${data.etc}` : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div className={css.infoEtc}>
            <div className={css.contentTitle}>
              삼성카드 10/12/18/24개월 다이어트 할부
            </div>
            <table>
              <thead>
                <tr>
                  <td width="180px">구분</td>
                  <td width="180px">연장기간</td>
                  <td width="178px">회원 이자 청구</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10개월 다이어트 할부</td>
                  <td rowSpan="4">2019~2019</td>
                  <td>10개월 다이어트 할부</td>
                </tr>
                <tr>
                  <td>10개월 다이어트 할부</td>
                  <td>10개월 다이어트 할부</td>
                </tr>
                <tr>
                  <td>10개월 다이어트 할부</td>
                  <td>10개월 다이어트 할부</td>
                </tr>
                <tr>
                  <td>10개월 다이어트 할부</td>
                  <td>10개월 다이어트 할부</td>
                </tr>
              </tbody>
            </table>
          </div> */}
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('cardinterest')(CardInterestModal);
