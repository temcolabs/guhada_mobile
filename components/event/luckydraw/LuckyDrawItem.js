import React, { useState, useCallback } from 'react';
import css from './LuckyDrawItem.module.scss';
import moment from 'moment';
import cn from 'classnames';
import { Transition } from 'react-transition-group';
import useStores from 'stores/useStores';
import anime from 'animejs';
import addCommaToNum from 'lib/common/addCommaToNum';
import { luckyDrawStatus } from 'lib/API/product/luckyDrawService';
import { loginStatus } from 'lib/constant';

/**
  * 데이터 바인딩 가이드는 zeplin 참조
  * zpl://screen?sid=5dc8d9d084487069649f83b1&pid=5ca71f1be141ada0c0df7152
  *
  * * 버튼 색은 statusCode 따라 변경
  - NORMAL : 응모 시작 24시간 이전
  - READY : 응모 시작 24시간 이내
  - START : 응모 시작
  - REQUESTED : 응모 완료
  - OUT_OF_TIME : 응모 마감
  - WINNER_ANNOUNCEMENT : 당첨자 발표
 */
export default function LuckyDrawItem({
  isFirst = 0,
  data = {
    dealId: 0,
    title: '',
    imageUrl: '',
    statusCode: '',
    statusText: '',
    sellPrice: 0,
    discountPrice: 0,
    discountRate: 0,
    now: 0,
    requestFromAt: 0,
    requestToAt: 0,
    remainedTimeForStart: 0,
    remainedTimeForEnd: 0,
    winnerAnnouncementAt: 0,
    remainedTimeForWinnerAnnouncement: 0,
    winnerBuyFromAt: 0,
    winnerBuyToAt: 0,
  },
}) {
  const { luckyDraw: luckyDrawStore, login: loginStore } = useStores();
  const [isRequestGuideVisible, setIsRequestGuideVisible] = useState(false);

  const { statusCode } = data;

  const handleClickRequestButton = useCallback(() => {
    luckyDrawStore.luckydrawDealId = data?.dealId;

    switch (statusCode) {
      case luckyDrawStatus.NORMAL:
        break;

      case luckyDrawStatus.READY:
        break;

      case luckyDrawStatus.START:
        loginStore.loginStatus === loginStatus.LOGIN_DONE
          ? luckyDrawStore.getEventUser()
          : luckyDrawStore.setLuckydrawLoginModal(true);
        break;

      case luckyDrawStatus.REQUESTED:
        break;

      case luckyDrawStatus.OUT_OF_TIME:
        break;

      case luckyDrawStatus.WINNER_ANNOUNCEMENT:
        luckyDrawStore.checkWinnerLuckyDraws({
          dealId: data?.dealId,
        });
        break;

      default:
        break;
    }
  }, [data, loginStore.loginStatus, luckyDrawStore, statusCode]);

  return (
    <div className={css.wrap}>
      {isFirst ? (
        <div className={css.startDateHeader}>
          <span className={css.startDateHeader__text}>
            {moment(data?.requestFromAt).format('M월 D일')}
          </span>
        </div>
      ) : null}
      <div className={css.productImageBackground}>
        <div
          className={css.productImage}
          style={{
            backgroundImage: `url('${data?.imageUrl}')`,
          }}
        />
      </div>

      <div className={css.productInfo}>
        <div className={css.productInfo__title}>{data?.title}</div>

        <div className={css.productInfo__priceWrapper}>
          <div className={css.productInfo__price}>
            <div className={css.productInfo__originalPrice}>
              {addCommaToNum(data?.sellPrice)}
            </div>
            <div className={css.productInfo__discountedPrice}>
              <span>{addCommaToNum(data?.discountPrice)}</span>
              <span>원</span>
            </div>
          </div>

          <div className={css.productInfo__discountRate}>
            <span>{data?.discountRate}</span> <span>%</span>
          </div>
        </div>
      </div>

      {/* 응모하기 버튼 */}
      <button
        className={cn(css.requestButton, statusCode)}
        onClick={() => handleClickRequestButton({})}
      >
        <span className={css.statusText}>{data?.statusText}</span>
      </button>

      <div className={css.requestGuide}>
        <button
          className={cn(css.requestGuide__button, {
            [css.isRequestGuideVisible]: isRequestGuideVisible,
          })}
          onClick={() => {
            setIsRequestGuideVisible((current) => !current);
          }}
        >
          응모안내
        </button>

        <Transition
          in={isRequestGuideVisible}
          timeout={400}
          onEnter={(node) => {
            anime({
              targets: node,
              easing: 'easeInOutQuad',
              duration: 400,
              opacity: 1,
              // display: 'block',
              begin: (anim) => {
                node.style.display = 'block';
                node.style.opacity = 0;
              },
            });
          }}
          onExit={(node) => {
            anime({
              targets: node,
              easing: 'easeInOutQuad',
              duration: 200,
              opacity: 0,
              complete: (anim) => {
                node.style.display = 'none';
              },
            });
          }}
        >
          {(state) => (
            <div className={cn(css.requestGuide__collapsingArea)}>
              <div className={css.requestGuide__table}>
                <div className={css.requestGuide__field}>
                  <div className={css.requestGuide__label}>이벤트 응모기간</div>
                  <div className={css.requestGuide__value}>
                    {moment(data?.requestFromAt).format('M월 D일 (dd) HH:mm')} -{' '}
                    {moment(data?.requestToAt).format('M월 D일 (dd) HH:mm')}
                  </div>
                </div>
                <div className={css.requestGuide__field}>
                  <div className={css.requestGuide__label}> 당첨자 발표일</div>
                  <div className={css.requestGuide__value}>
                    {moment(data?.winnerAnnouncementAt).format(
                      'M월 D일 (dd) HH:mm'
                    )}
                  </div>
                </div>
                <div className={css.requestGuide__field}>
                  <div className={css.requestGuide__label}>당첨자 구매기간</div>
                  <div className={css.requestGuide__value}>
                    {moment(data?.winnerBuyFromAt).format('M월 D일 (dd) HH:mm')}{' '}
                    - {moment(data?.winnerBuyToAt).format('M월 D일 (dd) HH:mm')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    </div>
  );
}
